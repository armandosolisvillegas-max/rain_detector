# Proyecto: Rain Detector

# Bitácora de: Manuel Josue Cardenas Sanchez

## Semana 1 — [11/10/2026] a [18/10/2026]

### Actividades realizadas

- Facilitación de la placa microcontroladora Arduino UNO R3, protoboard, cables jumper y componentes electrónicos principales para el desarrollo del prototipo.
- Diseño inicial del esquema de conexiones eléctricas en protoboard para integrar el sensor de lluvia (FC-37) y el micro servomotor SG90 con el Arduino UNO.
- Montaje preliminar de los componentes en la protoboard y cableado de alimentación básica (riel de 5V y GND).
- Participación en la sesión presencial de trabajo colaborativo para definir el alcance del sistema, la distribución de componentes en la maqueta y la integración física preliminar.

### Avances

- Circuito inicial funcional montado en protoboard: sensor de lluvia conectado al pin analógico `A0` del Arduino UNO y servomotor SG90 conectado al pin digital con modulación por ancho de pulsos (`Pin 9` PWM).
- Verificación física del flujo de alimentación: alimentación del Arduino mediante puerto USB y distribución de 5V al módulo sensor y al servomotor.
- Se acordó con el equipo la arquitectura básica de control: el Arduino UNO asume el control local inmediato de lectura analógica y accionamiento del actuador mecánico para garantizar respuesta en tiempo real (fail-safe).

### Dificultades encontradas

- Inestabilidad o caídas de tensión momentáneas al alimentar el servomotor SG90 directamente desde el pin de 5V del Arduino durante movimientos bruscos, lo que en ciertas pruebas provocaba fluctuaciones en la lectura analógica del sensor.
- Organización del cableado sobre la protoboard para permitir manipular el sensor y el servo sin desconectar accidentalmente cables durante la integración con la maqueta.

### Soluciones implementadas

- Se optimizó el conexionado de tierra y alimentación en la protoboard, utilizando pistas separadas en los rieles y asegurando contactos firmes para minimizar el ruido inducido por el motor sobre la línea analógica del sensor.
- Se seleccionaron cables jumper de longitud adecuada y código de colores estandarizado (rojo para 5V, negro/marrón para GND, amarillo para señal del servo y azul para la señal analógica del sensor) para facilitar la trazabilidad y mantenimiento del circuito.

### Decisiones técnicas

- Uso del Arduino UNO R3 como controlador principal de adquisición y control físico, debido a la estabilidad de su conversor analógico-digital (ADC de 10 bits con rango 0–1023) y la confiabilidad en la generación de pulsos PWM para el servomotor sin jitter.
- Conexión del sensor analógico en `A0` y el pin de señal del servomotor en el pin digital `9` con soporte de temporizador por hardware (`Timer1`).

### Pruebas efectuadas

- Medición con multímetro de las tensiones en los rieles de 5V y GND de la protoboard durante el reposo y en el momento de activación del servo.
- Prueba básica de movimiento angular del servomotor (recorrido entre 0° y 90°) al humedecer manualmente la placa sensora con gotas de agua, validando que el circuito responda físicamente ante la presencia de humedad.

### Aprendizajes obtenidos

- Consideraciones de alimentación y acoplamiento en proyectos con actuadores electromecánicos: los servomotores generan picos de corriente que pueden afectar las lecturas analógicas si no se cuida la distribución del bus de alimentación.
- Importancia de estandarizar el código de colores y el enrutamiento de cables para evitar cortocircuitos y facilitar la depuración conjunta en equipo.

### Próximos pasos

- Diseñar la interconexión física y lógica de comunicación serial entre el Arduino UNO y el módulo ESP32, resolviendo la discrepancia de niveles lógicos de voltaje (5V vs. 3.3V).
- Elaborar el diagrama formal de arquitectura global del sistema para la documentación técnica.

---

## Semana 2 — [19/10/2026] a [26/10/2026]

### Actividades realizadas

- Diseño e implementación del circuito de comunicación serial bidireccional entre el Arduino UNO (5V) y el ESP32 DevKit (3.3V).
- Cálculo, selección y montaje de un circuito divisor de voltaje resistivo para adaptar el nivel de transmisión lógica de 5V del Arduino hacia el pin de recepción RX (tolerante solo a 3.3V) del ESP32.
- Unificación de referencias de masa (GND común) entre ambas placas microcontroladoras para permitir la transmisión serial confiable.
- Elaboración del documento y diagrama de arquitectura global del sistema (`docs/arquitectura/README.md`) utilizando diagramas en formato Mermaid para representar las cinco capas de la solución (Física/Edge, Transporte/Red, Servidor/Backend, Persistencia y Presentación).

### Avances

- Circuito de enlace serial implementado con éxito:
  - Transmisión Arduino → ESP32: Pin digital 11 de Arduino (`TX` por SoftwareSerial a 5V) pasa por una resistencia en serie de $1\,\text{k}\Omega$ hacia el pin `GPIO16` (`RX2`) del ESP32, con una resistencia de $2\,\text{k}\Omega$ conectada de `GPIO16` a `GND`. Esto atenúa el voltaje de salida a aproximadamente $3.33\,\text{V}$, protegiendo el pin del microcontrolador ESP32.
  - Recepción Arduino ← ESP32: Pin digital 10 de Arduino (`RX` por SoftwareSerial) conectado directamente a `GPIO17` (`TX2` a 3.3V) del ESP32, dado que los 3.3V del ESP32 superan con seguridad el umbral mínimo de nivel lógico alto ($V_{IH} \approx 3.0\,\text{V}$) del microcontrolador ATmega328P del Arduino.
  - Conexión de puente entre los pines de tierra (`GND`) de ambas placas para garantizar una referencia eléctrica común.
- Redacción y publicación de la documentación de arquitectura en el repositorio (`docs/arquitectura/README.md`), detallando la separación de capas y los protocolos de intercambio.

### Dificultades encontradas

- Riesgo potencial de dañar los pines del ESP32 si se conectaba directamente la salida digital de 5V del pin 11 del Arduino UNO sin acoplamiento de nivel de tensión.
- En las primeras pruebas de comunicación se presentaron pérdidas esporádicas de caracteres por falta de una referencia de tierra común bien consolidada entre el cable USB del Arduino y la fuente del ESP32.

### Soluciones implementadas

- Implementación del divisor de voltaje con resistencias de precisión de $1\,\text{k}\Omega$ y $2\,\text{k}\Omega$:
  $$V_{out} = V_{in} \cdot \left(\frac{R_2}{R_1 + R_2}\right) = 5\,\text{V} \cdot \left(\frac{2\,\text{k}\Omega}{1\,\text{k}\Omega + 2\,\text{k}\Omega}\right) \approx 3.33\,\text{V}$$
- Cableado directo y permanente entre los terminales `GND` de ambas placas en la protoboard, asegurando que ambas compartieran el mismo potencial cero de referencia y eliminando errores de sincronismo serial.

### Decisiones técnicas

- Emplear la librería `SoftwareSerial` en pines 10 (RX) y 11 (TX) del Arduino UNO, reservando los pines de hardware serial 0 (RX) y 1 (TX) para la programación y el monitor serial con la computadora a 9600 baudios.
- Utilizar el puerto serial secundario del ESP32 (`Serial2` en GPIO16 y GPIO17) para mantener libre el puerto de depuración por USB `Serial` a 115200 baudios.

### Pruebas efectuadas

- Medición con multímetro de la tensión entregada en el punto medio del divisor resistivo al emitir pulsos a nivel alto desde el pin 11 del Arduino, verificando una salida constante en el rango seguro de $3.3\,\text{V} \pm 0.1\,\text{V}$.
- Verificación de la lectura de voltaje analógico entregada por el sensor FC-37: lectura de ~$1023$ en condición seca (sin lluvia) y caída por debajo de $300$ al humedecer la placa sensora con una película de agua.

### Aprendizajes obtenidos

- Aplicación práctica de circuitos divisores de tensión para interconexión de sistemas embebidos de voltaje mixto (5V y 3.3V).
- Importancia de unificar referencias de masa (common ground) en comunicaciones asíncronas UART entre dispositivos independientes.
- Modelado formal de arquitecturas de software y hardware mediante diagramas de flujo y diagramas por capas.

### Próximos pasos

- Realizar pruebas integrales de laboratorio junto con el equipo para verificar el flujo completo: detección física de lluvia → movimiento mecánico del servo → transmisión de telemetría hacia el ESP32 / PC → backend en Node.js y dashboard web.
- Montar y fijar definitivamente los cables y componentes dentro de la maqueta de la vivienda.

---

## Semana 3 — [09/11/2026] a [16/11/2026]

### Actividades realizadas

- Integración y fijación final de los componentes electrónicos (Arduino UNO, protoboard, cableado, servomotor y sensor de lluvia) dentro y fuera de la estructura física de la maqueta del proyecto.
- Verificación exhaustiva de la estabilidad mecánica de las conexiones para evitar desconexiones accidentales al mover o transportar la maqueta.
- Participación en la jornada de pruebas de integración de punta a punta junto con Alessandro, Carolina y Armando, evaluando la respuesta coordinada entre hardware, firmware, servidor backend y dashboard web.
- Calibración final del umbral de detección analógica del sensor de lluvia en conjunto con las rutinas de firmware.

### Avances

- Conexiones físicas finales completamente verificadas y documentadas según la tabla de asignación de pines:
  - **Sensor de lluvia FC-37:** `VCC` a `5V`, `GND` a `GND`, salida analógica `A0` a pin `A0` de Arduino UNO.
  - **Servomotor SG90:** Señal de control a `Pin 9` (PWM), `VCC` a `5V`, `GND` a `GND`.
  - **Línea serial PC:** Conexión USB mediante cable tipo A-B para monitoreo de depuración a 9600 baudios.
  - **Interconexión microcontroladores:** Pines 10 y 11 de Arduino vinculados con GPIO17 y GPIO16 del ESP32 mediante el divisor de tensión y GND común.
- Se comprobó que el mecanismo físico de palanca accionado por el servomotor retrae la ropa hacia la zona techada (posición 0°) de manera inmediata en cuanto caen gotas sobre la placa sensora, y la extiende nuevamente al secarse (posición 90°).
- Apoyo en la consolidación del manual de conexiones físicas y puesta en marcha para la sección 5 del documento `README.md` del repositorio.

### Dificultades encontradas

- El espacio interno de la maqueta requería un enrutamiento de cables muy compacto para que no interfirieran con el giro de la palanca del tendedero ni con las prendas en miniatura colgadas.
- Durante pruebas continuas con agua, gotas residuales en la superficie de las pistas niqueladas del sensor mantenían la lectura por debajo del umbral de lluvia aunque la precipitación externa hubiera cesado, retardando la reapertura del tendedero.

### Soluciones implementadas

- Se organizaron y aseguraron los arneses de cables utilizando cinchos y sujeción adhesiva por la parte posterior e inferior de la maqueta, dejando el área de movimiento del servo y tendedero totalmente despejada.
- Se realizaron pruebas de secado del sensor y ajuste de sensibilidad mediante el potenciómetro del módulo acondicionador y el umbral de software (`UMBRAL_LLUVIA = 300`), logrando una detección rápida y un retorno consistente al estado seco una vez drenado el líquido.

### Decisiones técnicas

- Mantener la fijación mecánica de la palanca del tendedero directamente al cabezal del servomotor SG90 asegurando un ángulo de apertura de 90° libres de resistencia física.
- Mantener la arquitectura fail-safe: ante cualquier fallo de comunicación de red o servidor web, el Arduino UNO y el servo continúan operando de forma autónoma garantizando la protección de las prendas.

### Pruebas efectuadas

- Prueba de estrés de 15 ciclos consecutivos de humedecimiento y secado del sensor de lluvia, comprobando una tasa de respuesta del 100% en el posicionamiento del servomotor (0° ante lluvia, 90° al secarse).
- Comprobación con multímetro de la continuidad y ausencia de falsos contactos en todo el arnés de cables una vez montado dentro de la maqueta.
- Validación de la integración completa: al simular lluvia con un gotero, el Arduino activó el servo inmediatamente y transmitió la trama de estado para que el backend registrara el evento `POST /api/events` con respuesta HTTP 200 y se reflejara la alerta roja en el dashboard web.

### Aprendizajes obtenidos

- Importancia del diseño mecánico y la gestión física del cableado en prototipos mecatrónicos e IoT integrados.
- Valor del principio de desacoplamiento y autonomía local (Edge Computing) en sistemas embebidos de misión crítica, permitiendo que la función esencial (guardar la ropa) no dependa de la conectividad de la red.
- Experiencia de trabajo multidisciplinario coordinando hardware analógico, firmware embebido, redes inalámbricas y desarrollo de software para la entrega final del proyecto integrador.

### Próximos pasos

- Preparación de la presentación final y demostración funcional del prototipo ante el profesor y compañeros de clase.
- Colaborar en los detalles finales de la entrega del repositorio y el artículo formal del proyecto.
