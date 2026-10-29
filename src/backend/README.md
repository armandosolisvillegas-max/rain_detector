# Backend y Dashboard Web — Rain Detector

Este módulo contiene el servidor backend en **Node.js + Express**, la base de datos persistente en **SQLite**, la suite de pruebas unitarias y la interfaz web moderna para el monitoreo en tiempo real del sistema **Rain Detector**.

---

## 🚀 Requisitos Previos

- **Node.js** (versión 18 LTS o superior, probado y verificado en v24).
- **npm** (incluido con Node.js).
- Red Wi-Fi local de **2.4 GHz** (para la conexión inalámbrica del ESP32).

---

## 📁 Estructura del Módulo

```text
src/
├── backend/
│   ├── database.js          # Conexión SQLite, esquema de tablas y lógica de eventos
│   ├── server.js            # Servidor Express, API REST y servicio del frontend
│   ├── package.json         # Dependencias y scripts (start, dev, test)
│   ├── test/
│   │   └── backend.test.js  # Pruebas unitarias nativas (node --test)
│   ├── rain_detector.db     # Base de datos local (en .gitignore, se crea automáticamente)
│   └── README.md            # Este manual de instalación y configuración
└── frontend/
    ├── index.html           # Estructura del dashboard con iconografía SVG
    ├── styles.css           # Diseño dark moderno azul petróleo y responsivo
    └── app.js               # Sincronización continua cada 2s e interactividad
```

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Instalar dependencias

Abre una terminal en la carpeta `src/backend`:

```powershell
cd "src/backend"
npm install
```

### 2. Iniciar el servidor

El proyecto incluye scripts configurados en `package.json`:

- **Modo normal:**
  ```powershell
  npm start
  ```

- **Modo desarrollo (recarga automática al modificar archivos):**
  ```powershell
  npm run dev
  ```

- **Ejecutar pruebas unitarias automatizadas:**
  ```powershell
  npm test
  ```

Al iniciar, el servidor indicará en la consola las direcciones disponibles:

```text
🌧️  Rain Detector - Servidor Backend Activo
📡 Local:            http://localhost:3000
🌐 En tu red (ESP32): http://192.168.X.X:3000
```

### 3. Abrir la aplicación web

Abre tu navegador e ingresa a:

👉 **`http://localhost:3000`**

---

## 📡 Configuración del ESP32 y Conexión de Red

Para que el ESP32 envíe los eventos de lluvia al backend, ambos dispositivos deben estar conectados a la **misma red Wi-Fi de 2.4 GHz**.

### 1. Obtener la IP local de tu computadora en Windows

1. Abre **PowerShell** o **Símbolo del sistema (CMD)** en Windows.
2. Ejecuta:
   ```powershell
   ipconfig
   ```
3. Busca tu adaptador Wi-Fi activo y copia el valor de **`Dirección IPv4`** (por ejemplo: `192.168.0.2` o `192.168.1.50`).

> ⚠️ **IMPORTANTE:** NUNCA uses `localhost` ni `127.0.0.1` en el firmware del ESP32, ya que desde la perspectiva del microcontrolador esas direcciones apuntan a sí mismo y no a tu computadora.

### 2. Configurar el firmware del ESP32

Abre el archivo [`src/firmware/esp32_panel_wifi.ino`](../firmware/esp32_panel_wifi.ino) y edita las siguientes líneas:

```cpp
// 1. Datos de tu red Wi-Fi (debe ser 2.4 GHz)
const char* WIFI_NOMBRE = "NOMBRE_DE_TU_RED";
const char* WIFI_CLAVE  = "CONTRASENA_DE_TU_RED";

// 2. URL del backend con tu IPv4 local obtenida en el paso anterior
const char* URL_BACKEND = "http://192.168.X.X:3000/api/events";
```

### 3. Subir el firmware al ESP32

1. Abre `esp32_panel_wifi.ino` en **Arduino IDE** (o VS Code con PlatformIO).
2. Selecciona la placa **ESP32 Dev Module** y el puerto COM asignado.
3. Haz clic en **Subir (Upload)**.
4. Abre el **Monitor Serial a 115200 baudios** para verificar que se conecte a la red Wi-Fi e inicialice el cliente HTTP.

---

## 🌐 Endpoints de la API REST

| Método | Ruta | Descripción | Ejemplo de Respuesta |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | Estado actual del sensor (`isRaining`), lectura y última actualización. | `{"success": true, "isRaining": false, "lastReading": 120, "lastUpdated": "..."}` |
| `GET` | `/api/events` | Historial de transiciones ordenadas cronológicamente (más recientes primero). | `{"success": true, "total": 2, "events": [...]}` |
| `POST` | `/api/events` | Reporte de telemetría desde ESP32 o pruebas locales. | `{"success": true, "stateChanged": true, "isRaining": true, "event": {...}}` |

### Formato esperado en `POST /api/events`

Inicio de lluvia:
```json
{
  "isRaining": true,
  "reading": 650
}
```

Fin de lluvia:
```json
{
  "isRaining": false,
  "reading": 90
}
```

> **Prevención de eventos duplicados:**  
> El sistema cuenta con doble protección:  
> 1. El ESP32 solo envía peticiones HTTP cuando detecta un cambio real en la variable de lluvia (`nuevaLluvia != lluvia`).  
> 2. El backend en SQLite verifica el estado actual y no inserta filas redundantes en la base de datos si recibe lecturas periódicas con el mismo estado meteorológico.
