/*
 * Proyecto Integrador - Paradigmas de Programación
 * PARTE 1: ARDUINO UNO (sensor de agua + servo)
 *
 * El Arduino detecta la lluvia y mueve la palanca de la ropa.
 * Además le reporta el estado al ESP32 (que tiene el WiFi) y
 * recibe órdenes de él (METER / SACAR) por comunicación serial.
 *
 * Paradigma principal: Programación Orientada a Objetos (POO)
 *   - Clases: SensorLluvia, Tendedero, EnlaceESP32, DetectorLluvia.
 *   - Encapsulamiento: cada clase oculta sus pines y detalles internos.
 *   - Abstracción por especificación: precondiciones y postcondiciones.
 *
 * Paradigma complementario: Programación dirigida por eventos
 *   - Eventos: empieza a llover, deja de llover, llega una orden del ESP32.
 *
 * Conexiones (Arduino Uno):
 *   Water Sensor: S -> A0  |  + -> 5V  |  - -> GND
 *   Servo:        señal (amarillo) -> pin 9  |  rojo -> 5V  |  café -> GND
 *   ESP32:        pin 11 (TX) -> resistencia 1k -> RX2 (GPIO16) del ESP32
 *                 RX2 del ESP32 -> resistencia 2k -> GND   (divisor de voltaje)
 *                 pin 10 (RX) <- TX2 (GPIO17) del ESP32
 *                 GND <-> GND del ESP32
 *
 * Protocolo (texto, una línea por mensaje):
 *   Arduino -> ESP32:  ESTADO,<lectura>,<lluvia 0/1>,<ropaAdentro 0/1>
 *   ESP32 -> Arduino:  METER   o   SACAR
 */

#include <Servo.h>
#include <SoftwareSerial.h>

// ============================================================
// Configuración
// ============================================================
const int PIN_SENSOR     = A0;
const int UMBRAL_LLUVIA  = 300;   // Uno lee de 0 a 1023; calibrar con el Serial Monitor
const int PIN_SERVO      = 9;
const int ANGULO_AFUERA  = 90;    // ropa al sol
const int ANGULO_ADENTRO = 0;     // ropa protegida
const int PIN_RX_ESP     = 10;
const int PIN_TX_ESP     = 11;

// ============================================================
// Clase SensorLluvia: abstrae el sensor de agua
// ============================================================
class SensorLluvia {
  private:
    int pin;
    int umbral;

  public:
    SensorLluvia(int pin, int umbral) : pin(pin), umbral(umbral) {}

    /*
     * Precondición:  el sensor está conectado al pin analógico indicado.
     * Postcondición: devuelve la lectura (0 = seco, hasta 1023 = muy mojado).
     */
    int leer() {
      return analogRead(pin);
    }

    /*
     * Precondición:  lectura es un valor devuelto por leer().
     * Postcondición: devuelve true si la lectura indica agua.
     */
    bool hayLluvia(int lectura) {
      return lectura > umbral;
    }
};

// ============================================================
// Clase Tendedero: abstrae el servo que mueve la palanca
// ============================================================
class Tendedero {
  private:
    Servo servo;
    int pin;
    int anguloAfuera;
    int anguloAdentro;
    bool ropaAdentro;

  public:
    Tendedero(int pin, int anguloAfuera, int anguloAdentro)
      : pin(pin), anguloAfuera(anguloAfuera), anguloAdentro(anguloAdentro), ropaAdentro(false) {}

    /* Debe llamarse en setup(): el hardware no está listo en el constructor. */
    void iniciar() {
      servo.attach(pin);
      sacarRopa();
    }

    /* Postcondición: la palanca queda en posición "adentro". */
    void meterRopa() {
      servo.write(anguloAdentro);
      ropaAdentro = true;
    }

    /* Postcondición: la palanca queda en posición "afuera". */
    void sacarRopa() {
      servo.write(anguloAfuera);
      ropaAdentro = false;
    }

    bool estaAdentro() {
      return ropaAdentro;
    }
};

// ============================================================
// Clase EnlaceESP32: abstrae la comunicación serial con el ESP32
// ============================================================
class EnlaceESP32 {
  private:
    SoftwareSerial puerto;
    String buffer;

  public:
    EnlaceESP32(int pinRx, int pinTx) : puerto(pinRx, pinTx) {}

    void iniciar() {
      puerto.begin(9600);
    }

    /*
     * Postcondición: el ESP32 recibe una línea "ESTADO,lectura,lluvia,ropa".
     */
    void enviarEstado(int lectura, bool lluvia, bool ropaAdentro) {
      puerto.print("ESTADO,");
      puerto.print(lectura);
      puerto.print(',');
      puerto.print(lluvia ? 1 : 0);
      puerto.print(',');
      puerto.println(ropaAdentro ? 1 : 0);
    }

    /*
     * Postcondición: devuelve true y guarda el texto en 'comando'
     *                si llegó una línea completa desde el ESP32.
     */
    bool recibirComando(String& comando) {
      while (puerto.available()) {
        char c = puerto.read();
        if (c == '\n') {
          comando = buffer;
          comando.trim();
          buffer = "";
          return comando.length() > 0;
        }
        if (c != '\r') {
          buffer += c;
          if (buffer.length() > 32) buffer = "";   // evita basura acumulada
        }
      }
      return false;
    }
};

// ============================================================
// Clase DetectorLluvia: coordina todo y maneja los eventos
// ============================================================
class DetectorLluvia {
  private:
    SensorLluvia& sensor;
    Tendedero& tendedero;
    EnlaceESP32& enlace;
    bool lloviendo = false;
    int ultimaLectura = 0;
    unsigned long ultimoChequeo = 0;
    unsigned long ultimoReporte = 0;
    const unsigned long INTERVALO_LECTURA_MS = 500;
    const unsigned long INTERVALO_REPORTE_MS = 2000;

    void reportar() {
      enlace.enviarEstado(ultimaLectura, lloviendo, tendedero.estaAdentro());
      ultimoReporte = millis();
    }

    // ---------- Eventos ----------
    void alEmpezarLluvia() {
      Serial.println("EVENTO: empezo a llover -> metiendo la ropa");
      tendedero.meterRopa();
      reportar();
    }

    void alTerminarLluvia() {
      Serial.println("EVENTO: dejo de llover -> sacando la ropa");
      tendedero.sacarRopa();
      reportar();
    }

    void alRecibirComando(const String& comando) {
      Serial.print("EVENTO: orden del ESP32 -> ");
      Serial.println(comando);
      if (comando == "METER") {
        tendedero.meterRopa();
      } else if (comando == "SACAR") {
        tendedero.sacarRopa();
      }
      reportar();
    }

  public:
    DetectorLluvia(SensorLluvia& sensor, Tendedero& tendedero, EnlaceESP32& enlace)
      : sensor(sensor), tendedero(tendedero), enlace(enlace) {}

    /* Debe llamarse en cada vuelta del loop. No usa delay(). */
    void actualizar() {
      String comando;
      if (enlace.recibirComando(comando)) {
        alRecibirComando(comando);
      }

      if (millis() - ultimoChequeo >= INTERVALO_LECTURA_MS) {
        ultimoChequeo = millis();
        ultimaLectura = sensor.leer();
        bool llueve = sensor.hayLluvia(ultimaLectura);

        Serial.print("Lectura: ");
        Serial.print(ultimaLectura);
        Serial.print(" | Lluvia: ");
        Serial.print(llueve ? "SI" : "NO");
        Serial.print(" | Ropa: ");
        Serial.println(tendedero.estaAdentro() ? "ADENTRO" : "AFUERA");

        bool estadoAnterior = lloviendo;
        lloviendo = llueve;
        if (llueve && !estadoAnterior) {
          alEmpezarLluvia();
        } else if (!llueve && estadoAnterior) {
          alTerminarLluvia();
        }
      }

      if (millis() - ultimoReporte >= INTERVALO_REPORTE_MS) {
        reportar();
      }
    }
};

// ============================================================
// Creación de los objetos
// ============================================================
SensorLluvia   sensor(PIN_SENSOR, UMBRAL_LLUVIA);
Tendedero      tendedero(PIN_SERVO, ANGULO_AFUERA, ANGULO_ADENTRO);
EnlaceESP32    enlace(PIN_RX_ESP, PIN_TX_ESP);
DetectorLluvia detector(sensor, tendedero, enlace);

// ============================================================
// Programa principal
// ============================================================
void setup() {
  Serial.begin(9600);
  enlace.iniciar();
  tendedero.iniciar();
  Serial.println("Arduino: detector de lluvia iniciado");
}

void loop() {
  detector.actualizar();
}
