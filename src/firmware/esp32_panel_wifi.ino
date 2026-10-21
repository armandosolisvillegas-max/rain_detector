/*
 * Proyecto Integrador - Paradigmas de Programación
 * PARTE 2: ESP32 (WiFi + página web)
 *
 * El ESP32 recibe el estado del Arduino por comunicación serial,
 * lo muestra en una página web y envía las órdenes del usuario
 * (METER / SACAR) al Arduino.
 *
 * Paradigma principal: Programación Orientada a Objetos (POO)
 *   - Clases: ConexionWiFi, EnlaceArduino, PanelWeb.
 *
 * Paradigma complementario: Programación dirigida por eventos
 *   - Eventos: llega un mensaje del Arduino, el usuario presiona un botón.
 *
 * Conexiones (ESP32 DevKit):
 *   RX2 (GPIO16) <- divisor de voltaje <- pin 11 del Arduino
 *   TX2 (GPIO17) -> pin 10 del Arduino
 *   GND <-> GND del Arduino
 *
 * No necesita librerías extra: WiFi.h y WebServer.h vienen con el paquete esp32.
 */

#include <WiFi.h>
#include <WebServer.h>

// ============================================================
// Configuración (cambiar aquí)
// ============================================================
// IMPORTANTE: el ESP32 solo se conecta a redes de 2.4 GHz.
// Si "SOTO-5G" es de 5 GHz, cambiar por la red de 2.4 GHz del router
// (por ejemplo "SOTO" o "SOTO-2.4G") o por el hotspot de un celular.
// Antes de subir a GitHub, reemplazar la clave por "TU_CLAVE".
const char* WIFI_NOMBRE = "SOTO-5G";
const char* WIFI_CLAVE  = "delunoalnueve";

const int PIN_RX_ARDUINO = 16;   // RX2
const int PIN_TX_ARDUINO = 17;   // TX2

// ============================================================
// Clase ConexionWiFi: abstrae la conexión a la red
// ============================================================
class ConexionWiFi {
  private:
    const char* nombre;
    const char* clave;

  public:
    ConexionWiFi(const char* nombre, const char* clave) : nombre(nombre), clave(clave) {}

    /*
     * Precondición:  la red es de 2.4 GHz (el ESP32 no se conecta a 5 GHz).
     * Postcondición: devuelve true si se conectó antes de tiempoMaxMs.
     */
    bool conectar(unsigned long tiempoMaxMs = 15000) {
      WiFi.mode(WIFI_STA);
      WiFi.begin(nombre, clave);
      Serial.print("Conectando a ");
      Serial.print(nombre);

      unsigned long inicio = millis();
      while (!estaConectado() && millis() - inicio < tiempoMaxMs) {
        delay(500);
        Serial.print(".");
      }
      Serial.println();

      if (estaConectado()) {
        Serial.print("WiFi conectado. Abre en el navegador: http://");
        Serial.println(WiFi.localIP());
        return true;
      }
      Serial.println("No se pudo conectar al WiFi.");
      return false;
    }

    bool estaConectado() {
      return WiFi.status() == WL_CONNECTED;
    }
};

// ============================================================
// Clase EnlaceArduino: abstrae la comunicación serial con el Arduino
// ============================================================
class EnlaceArduino {
  private:
    HardwareSerial& puerto;
    int pinRx;
    int pinTx;
    String buffer;

    // Último estado recibido
    int lectura = 0;
    bool lluvia = false;
    bool ropaAdentro = false;
    bool recibioAlgo = false;
    unsigned long ultimoMensaje = 0;

    /* Evento: llegó una línea completa del Arduino. */
    void alRecibirLinea(const String& linea) {
      if (!linea.startsWith("ESTADO,")) return;

      int c1 = linea.indexOf(',');
      int c2 = linea.indexOf(',', c1 + 1);
      int c3 = linea.indexOf(',', c2 + 1);
      if (c1 < 0 || c2 < 0 || c3 < 0) return;   // mensaje incompleto

      lectura     = linea.substring(c1 + 1, c2).toInt();
      lluvia      = linea.substring(c2 + 1, c3).toInt() == 1;
      ropaAdentro = linea.substring(c3 + 1).toInt() == 1;
      recibioAlgo = true;
      ultimoMensaje = millis();

      Serial.print("Arduino -> ESP32: ");
      Serial.println(linea);
    }

  public:
    EnlaceArduino(HardwareSerial& puerto, int pinRx, int pinTx)
      : puerto(puerto), pinRx(pinRx), pinTx(pinTx) {}

    void iniciar() {
      puerto.begin(9600, SERIAL_8N1, pinRx, pinTx);
    }

    /* Debe llamarse en cada vuelta del loop para leer los mensajes. */
    void actualizar() {
      while (puerto.available()) {
        char c = puerto.read();
        if (c == '\n') {
          buffer.trim();
          alRecibirLinea(buffer);
          buffer = "";
        } else if (c != '\r') {
          buffer += c;
          if (buffer.length() > 40) buffer = "";
        }
      }
    }

    /* Postcondición: el Arduino recibe la orden (METER o SACAR). */
    void enviarComando(const char* comando) {
      puerto.println(comando);
      Serial.print("ESP32 -> Arduino: ");
      Serial.println(comando);
    }

    /* Devuelve true si el Arduino envió algo en los últimos 5 segundos. */
    bool arduinoConectado() {
      return recibioAlgo && (millis() - ultimoMensaje < 5000);
    }

    int getLectura()     { return lectura; }
    bool hayLluvia()     { return lluvia; }
    bool estaAdentro()   { return ropaAdentro; }
};

// ============================================================
// Página web del panel
// ============================================================
const char PAGINA_HTML[] = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Detector de lluvia</title>
<style>
  body { font-family: sans-serif; text-align: center; padding: 20px; background: #eef2f7; }
  .tarjeta { background: #fff; border-radius: 12px; padding: 20px; max-width: 360px;
             margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
  .estado { font-size: 2em; margin: 12px 0; }
  .aviso { color: #c53030; font-weight: bold; }
  button { font-size: 1.1em; padding: 12px 20px; margin: 8px; border: none;
           border-radius: 8px; color: #fff; cursor: pointer; }
  .meter { background: #2b6cb0; }
  .sacar { background: #c05621; }
</style>
</head>
<body>
<div class="tarjeta">
  <h2>Detector de lluvia</h2>
  <p class="aviso" id="aviso"></p>
  <div class="estado" id="lluvia">...</div>
  <p>Lectura del sensor: <b id="lectura">-</b></p>
  <p>Ropa: <b id="ropa">-</b></p>
  <button class="meter" onclick="accion('/meter')">Meter ropa</button>
  <button class="sacar" onclick="accion('/sacar')">Sacar ropa</button>
</div>
<script>
  function mostrar(d) {
    document.getElementById('aviso').textContent = d.conectado ? '' : 'Arduino sin conexión';
    document.getElementById('lluvia').textContent = d.lluvia ? '🌧️ Lloviendo' : '☀️ Seco';
    document.getElementById('lectura').textContent = d.lectura;
    document.getElementById('ropa').textContent = d.ropa;
  }
  function actualizar() { fetch('/estado').then(r => r.json()).then(mostrar); }
  function accion(url)  { fetch(url).then(() => setTimeout(actualizar, 300)); }
  setInterval(actualizar, 1000);
  actualizar();
</script>
</body>
</html>
)rawliteral";

// ============================================================
// Clase PanelWeb: servidor web para ver el estado y dar órdenes
// ============================================================
class PanelWeb {
  private:
    WebServer servidor;
    EnlaceArduino& arduino;

    void enviarPagina() {
      servidor.send(200, "text/html", PAGINA_HTML);
    }

    void enviarEstado() {
      String json = "{\"conectado\":" + String(arduino.arduinoConectado() ? "true" : "false") +
                    ",\"lectura\":" + String(arduino.getLectura()) +
                    ",\"lluvia\":" + (arduino.hayLluvia() ? "true" : "false") +
                    ",\"ropa\":\"" + (arduino.estaAdentro() ? "adentro" : "afuera") + "\"}";
      servidor.send(200, "application/json", json);
    }

    // ---------- Eventos del usuario ----------
    void alPresionarMeter() {
      arduino.enviarComando("METER");
      servidor.send(200, "text/plain", "OK");
    }

    void alPresionarSacar() {
      arduino.enviarComando("SACAR");
      servidor.send(200, "text/plain", "OK");
    }

  public:
    PanelWeb(int puerto, EnlaceArduino& arduino) : servidor(puerto), arduino(arduino) {}

    void iniciar() {
      servidor.on("/",       [this]() { enviarPagina(); });
      servidor.on("/estado", [this]() { enviarEstado(); });
      servidor.on("/meter",  [this]() { alPresionarMeter(); });
      servidor.on("/sacar",  [this]() { alPresionarSacar(); });
      servidor.begin();
    }

    /* Debe llamarse en cada vuelta del loop. */
    void atender() {
      servidor.handleClient();
    }
};

// ============================================================
// Creación de los objetos
// ============================================================
ConexionWiFi  wifi(WIFI_NOMBRE, WIFI_CLAVE);
EnlaceArduino arduino(Serial2, PIN_RX_ARDUINO, PIN_TX_ARDUINO);
PanelWeb      panel(80, arduino);

// ============================================================
// Programa principal
// ============================================================
void setup() {
  Serial.begin(115200);
  arduino.iniciar();
  wifi.conectar();
  panel.iniciar();
  Serial.println("ESP32: panel WiFi iniciado");
}

void loop() {
  arduino.actualizar();
  panel.atender();
}
