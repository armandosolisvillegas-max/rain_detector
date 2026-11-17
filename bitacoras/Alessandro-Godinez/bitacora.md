# Proyecto: Rain Detector

# Bitácora de: Alessandro Godinez Rodriguez

## Semana 1 — [11/10/2026] a [18/10/2026]

- Nosotros trabajamos todo en un mismo día así que solo requerimos de 1 semana para completar la parte de conexiones, pagina Web y maqueta del sistema como tal.

### Actividades realizadas

- Descagué Arduino para hacer las conexiones de ambos dispositivos y trabajar el codigo desde ahí, también ajustamos un poco el Arduino UNO para mejor respuesta a la hora de tener el contacto con el agua

### Avances

- Se completó sistema y conexiones, además de la Web y también la maqueta.
- Por error del grupo, ese mismo día se trabajó el código en rama main así que no hay como tal commits de cada uno, pero sí hay de Carolina para la implementación de la Web

### Dificultades encontradas

- el mayor problema que encontramos fue el hacer la conexion del ESP32 con el Arduino UNO porque por alguna razón no conectaba el Wi-Fi y por ende no había conexión con la página web así que básicamente no mostraba cuando llovía

### Soluciones implementadas

- Debido a que no hubo manera de conectarse a mi red de Wi-Fi o incluso mi red de celular, decidimos probar desde otra Red, lo cual se implementó en la casa de Carolina

### Decisiones técnicas

- Decidimos utilizar Arduino UNO para una mejor conexión tanto en manipulación como en los requerimientos del proyecto pensado, además, fue tomado en cuenta por Manuel quien facilitó su uso. Todo esto fue consultado al profesor y nos dio visto bueno.

### Pruebas efectuadas

- Se probó que se diera un movimiento en el microservo apenas percibiera agua en el water sensor. Como resultado tuvimos el movimiento esperado del microservo para cuando cayera agua

### Aprendizajes obtenidos

- Aprendí mucho acerca de la conexión de Arduino UNO ya que tuvimos algunos percances que nos movió a investigar un poco, por ejemplo los puertos de entrada y su importancia en saber conectarlos bien

### Próximos pasos

- Queda únicamente trabajar en el artículo y montar ya bien lo que viene siendo la maqueta

## Semana 2 — [09/11/2026] a [16/11/2026]

### Actividades realizadas

- Instalé las dependencias del backend (Node.js + Express + SQLite) y lo puse a correr en mi computadora para ver la página web del historial de eventos.
- Volví a subir el código al ESP32 configurando la red Wi-Fi y la dirección IP de mi computadora para que pudiera enviar los eventos al backend.

### Avances

- Se logró que el ESP32 se conectara al Wi-Fi usando el hotspot del celular y que el panel web del ESP32 (botones Meter/Sacar) cargara desde el navegador.
- El backend quedó corriendo y respondiendo en el puerto 3000.

### Dificultades encontradas

- El ESP32 no se conectaba a la red porque el hotspot del celular estaba en 5 GHz y el ESP32 solo trabaja con redes de 2.4 GHz.
- La IP del backend en el código no era la de mi computadora, por lo que los eventos no llegaban.
- El Arduino IDE estaba subiendo una copia vieja del código, por eso el ESP32 seguía intentando conectarse a la red anterior.
- El panel del ESP32 muestra "Arduino sin conexión", ya que no le llegan los datos del Arduino por el cableado serial.

### Soluciones implementadas

- Se activó "Maximizar compatibilidad" en el hotspot del iPhone para que funcionara en 2.4 GHz.
- Se actualizó la URL del backend con la IPv4 real de la computadora (obtenida con `ipconfig`).
- Se movieron las credenciales Wi-Fi a un archivo `secrets.h` para no subir contraseñas al repositorio.
- Se agregó una regla en el Firewall de Windows para permitir conexiones al puerto 3000.

### Decisiones técnicas

- Usar el hotspot del celular como red de pruebas para no depender de la red de la casa.
- Mantener las credenciales fuera de git usando `secrets.h` y un archivo de ejemplo.

### Pruebas efectuadas

- Se verificó en el Monitor Serie (115200 baudios) que el ESP32 se conectara al Wi-Fi y mostrara su IP. Resultado: conectado correctamente.
- Se abrió el panel del ESP32 en el navegador. Resultado: carga, pero indica "Arduino sin conexión".
- Se revisó el Monitor Serie del Arduino (9600 baudios). Resultado: el sensor lee y el servo responde correctamente.

### Aprendizajes obtenidos

- Aprendí que el ESP32 guarda el programa en su memoria y que hay que volver a subirlo cada vez que se cambia el código, no basta con reiniciarlo.
- Aprendí la diferencia entre las redes de 2.4 GHz y 5 GHz y cómo afecta a los microcontroladores.
- Aprendí a revisar la IP de la computadora y cómo el firewall puede bloquear la comunicación con otros dispositivos.

### Próximos pasos

- Revisar el cableado entre el Arduino y el ESP32 (GND común, pin 11 → GPIO16 con divisor de voltaje y pin 10 ← GPIO17).
- Verificar que los eventos de lluvia lleguen al backend y se muestren en la página web.
- Calibrar el umbral del sensor de lluvia.
