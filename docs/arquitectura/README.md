# Arquitectura del Sistema: Rain Detector

Este documento describe la arquitectura global del sistema **Rain Detector**, detallando las capas que componen la solución, los flujos de comunicación y las responsabilidades de cada componente.

---

## 1. Diagrama de Arquitectura Global

```mermaid
flowchart TB
    subgraph CapaEdge ["1. Capa Física / Edge (Firmware)"]
        SensorLluvia["Sensor de Lluvia (FC-37)<br/>Salidas A0 / D0"]
        SensorDHT["Sensor Ambiental (DHT11/22)<br/>Temp / Humedad"]
        ActBuzzer["Buzzer & LEDs de Alerta"]
        ActServo["Servomotor / Relé de Mitigación"]
        ESP32["Microcontrolador ESP32<br/>(FreeRTOS Tasks / ADC / Wi-Fi)"]

        SensorLluvia -->|Lectura Analógica / Digital| ESP32
        SensorDHT -->|Lectura Digital (1-Wire)| ESP32
        ESP32 -->|GPIO / PWM| ActBuzzer
        ESP32 -->|GPIO / PWM| ActServo
    end

    subgraph CapaRed ["2. Capa de Transporte & Red"]
        WiFiRouter["Punto de Acceso / Router Wi-Fi"]
        Protocolo["Protocolo: HTTP REST / MQTT / WebSockets"]
        ESP32 -->|Paquetes JSON| WiFiRouter
        WiFiRouter --> Protocolo
    end

    subgraph CapaBackend ["3. Capa de Servidor & Procesamiento"]
        API["Servidor Backend (Node.js / Express / Python)<br/>Controladores & Middlewares"]
        MotorReglas["Motor de Reglas & Detección de Eventos"]
        Pipeline["Procesamiento Funcional de Telemetría"]

        Protocolo --> API
        API --> Pipeline
        Pipeline --> MotorReglas
    end

    subgraph CapaPersistencia ["4. Capa de Datos"]
        DB[("Base de Datos (SQLite / PostgreSQL / InfluxDB)<br/>Histórico de Telemetría y Alertas")]
        MotorReglas --> DB
    end

    subgraph CapaPresentacion ["5. Capa de Usuario (Dashboard & Alertas)"]
        Dashboard["Dashboard Web / App de Monitoreo"]
        Notificaciones["Servicio de Notificaciones (Push / Telegram / Email)"]

        API -->|WebSocket / SSE en tiempo real| Dashboard
        MotorReglas -->|Disparo de Alertas| Notificaciones
    end
```

---

## 2. Descripción de Capas

### 1. Capa Física / Edge (Firmware)
- **ESP32:** Controla la toma de muestras periódicas a través del conversor analógico a digital (ADC) y pines digitales.
- **Sensores:** Capturan la presencia de gotas y estiman la intensidad de la precipitación.
- **Actuadores locales:** Ofrecen respuesta inmediata sin depender de la conectividad de red (fail-safe).

### 2. Capa de Red y Transporte
- Conexión vía Wi-Fi local asegurando transmisión de payloads en formato JSON.
- Admite tanto envío periódico de telemetría (cada $N$ segundos) como envío por interrupción al detectar lluvia inmediata.

### 3. Capa Backend & Procesamiento
- Recibe y valida los payloads mediante una API REST o broker MQTT.
- Aplica transformaciones funcionales (filtrado de ruido, cálculo de medias móviles).
- Evalúa umbrales de lluvia para disparar alertas automáticas.

### 4. Capa de Persistencia
- Almacena el histórico cronológico de las lecturas para consultas posteriores, gráficas temporales y auditoría.

### 5. Capa de Presentación
- Interfaz gráfica web para visualización en tiempo real y recepción de notificaciones de emergencia.
