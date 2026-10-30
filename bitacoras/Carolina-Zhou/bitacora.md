
# Proyecto: Rain Detector

# Bit├ícora de: Carolina Zhou Zheng

## Semana 1 ÔÇö 18/10/2026

### Actividades realizadas

Particip├® en la construcci├│n de la maqueta de la casa para representar f├¡sicamente la propuesta del proyecto Rain Detector. Colabor├® en la elaboraci├│n de la estructura, organizaci├│n y distribuci├│n de los elementos que conforman la vivienda, procurando que la maqueta permitiera representar el funcionamiento del sistema automatizado.

Tambi├®n particip├® en la instalaci├│n y organizaci├│n de los componentes electr├│nicos del proyecto, incluyendo el Arduino, el sensor de lluvia y el servomotor. Durante esta actividad colabor├® con el montaje de los componentes y su incorporaci├│n a la estructura f├¡sica de la casa, con el prop├│sito de representar c├│mo funcionar├¡a el sistema ante la detecci├│n de lluvia.

### Avances

Se complet├│ la construcci├│n de la estructura principal de la maqueta y se avanz├│ en la instalaci├│n de los componentes electr├│nicos necesarios para representar el funcionamiento del Rain Detector. Adem├ís, se estableci├│ una primera relaci├│n entre la parte f├¡sica de la vivienda y los elementos encargados de detectar la lluvia y generar una respuesta automatizada.

### Dificultades encontradas

Durante la elaboraci├│n de la maqueta fue necesario organizar adecuadamente el espacio disponible para incorporar los componentes electr├│nicos sin afectar la estructura de la casa. Tambi├®n fue necesario considerar la ubicaci├│n de los elementos para que pudieran representar correctamente el funcionamiento esperado del proyecto.

### Soluciones implementadas

Se trabaj├│ en conjunto para organizar la estructura de la maqueta y distribuir los componentes electr├│nicos de manera que pudieran integrarse con la representaci├│n f├¡sica de la vivienda. Se realizaron ajustes durante el montaje para facilitar la incorporaci├│n de los elementos del sistema.

### Decisiones t├®cnicas

Se decidi├│ utilizar una maqueta de una vivienda como representaci├│n f├¡sica del proyecto, ya que permite demostrar de manera visual c├│mo funcionar├¡a un sistema de detecci├│n de lluvia aplicado a una casa. Tambi├®n se incorporaron los componentes electr├│nicos necesarios para representar la detecci├│n de lluvia y la respuesta automatizada mediante el servomotor.

### Pruebas efectuadas

Durante esta etapa se trabaj├│ principalmente en la construcci├│n y el montaje f├¡sico de la maqueta, as├¡ como en la instalaci├│n de los componentes electr├│nicos. Se realiz├│ la organizaci├│n inicial de los elementos para comprobar que pudieran incorporarse a la estructura de la vivienda. Las pruebas completas de funcionamiento del sistema quedaron pendientes para las siguientes etapas del proyecto.

### Aprendizajes obtenidos

Esta actividad me permiti├│ comprender mejor la relaci├│n entre la estructura f├¡sica de un prototipo y los componentes electr├│nicos que permiten automatizar su funcionamiento. Tambi├®n aprend├¡ sobre la importancia de planificar la distribuci├│n de los componentes desde la construcci├│n de la maqueta, para facilitar su posterior integraci├│n y funcionamiento.

### Pr├│ximos pasos

Continuar con el desarrollo del proyecto mediante la integraci├│n de los componentes electr├│nicos, la programaci├│n del sistema y la creaci├│n de una aplicaci├│n que permita visualizar la informaci├│n generada por el detector de lluvia.

---

## Semana 2 ÔÇö 26/10/2026 a 29/10/2026

### Actividades realizadas

Durante esta semana trabaj├® en el desarrollo de la aplicaci├│n web del proyecto Rain Detector. Mi participaci├│n se enfoc├│ en construir la interfaz de usuario y desarrollar la l├│gica del backend necesaria para recibir, almacenar y consultar la informaci├│n generada por el sistema de detecci├│n de lluvia.

En la parte del frontend desarroll├® la estructura de la interfaz utilizando HTML, CSS y JavaScript. La aplicaci├│n permite visualizar el estado actual del detector de lluvia, presentar alertas y consultar un historial de eventos que registra los cambios de estado, incluyendo sus respectivas fechas y horas.

En cuanto al backend, trabaj├® con Node.js y Express para implementar los servicios encargados de procesar la informaci├│n. Tambi├®n desarroll├® la l├│gica de conexi├│n con SQLite para almacenar los eventos generados por el sistema. Se implementaron endpoints para consultar el estado actual, obtener el historial y registrar nuevos eventos.

Adem├ís, trabaj├® en la integraci├│n del firmware del ESP32 con el backend mediante solicitudes HTTP utilizando HTTPClient. El objetivo de esta implementaci├│n es permitir que el ESP32 env├¡e los cambios de estado detectados por el sensor hacia el servidor a trav├®s de una conexi├│n Wi-Fi.

Finalmente, organic├® los archivos desarrollados, incorpor├® pruebas para el backend, actualic├® la documentaci├│n correspondiente y publiqu├® los cambios en el repositorio compartido de GitHub.

### Avances

Se desarroll├│ la interfaz web del proyecto mediante los archivos `index.html`, `styles.css` y `app.js`, permitiendo visualizar el estado actual de la lluvia, las alertas y el historial de eventos.

Se implement├│ el backend utilizando Node.js y Express en el archivo `server.js`, junto con la l├│gica de persistencia de datos en `database.js` mediante SQLite.

Se desarrollaron los endpoints `/api/status`, `/api/events` y `POST /api/events`, destinados a consultar el estado del sistema, recuperar los eventos registrados y almacenar nuevos eventos.

Tambi├®n se incorpor├│ una l├│gica para evitar registros duplicados cuando se recibe repetidamente un mismo estado de lluvia. Adicionalmente, se trabaj├│ en la integraci├│n del firmware del ESP32 con el backend mediante HTTPClient, preparando el env├¡o de los cambios de estado del sensor a trav├®s de Wi-Fi.

Se agregaron pruebas automatizadas para el backend y documentaci├│n sobre su funcionamiento. Finalmente, se publicaron los cambios realizados en la rama `main` del repositorio.

**Evidencia del avance en GitHub:**

- **Commit:** `d43392b`
- **Mensaje:** `lo que me faltaba por subir`
- **Fecha:** 29/10/2026
- **Rama:** `main`
- **Repositorio:** [Rain Detector](https://github.com/armandosolisvillegas-max/rain_detector)

**Archivos incluidos en el commit:**

- `.gitignore`
- `src/backend/README.md`
- `src/backend/database.js`
- `src/backend/package.json`
- `src/backend/server.js`
- `src/backend/test/backend.test.js`
- `src/firmware/esp32_panel_wifi.ino`
- `src/frontend/app.js`
- `src/frontend/index.html`
- `src/frontend/styles.css`

El commit registr├│ modificaciones en 10 archivos, con 2278 inserciones y 26 eliminaciones.

### Dificultades encontradas

Durante el desarrollo fue necesario organizar la comunicaci├│n entre los diferentes componentes del sistema para conseguir que la informaci├│n pudiera recibirse, almacenarse y mostrarse correctamente. Tambi├®n se present├│ un conflicto al ejecutar el backend debido a que el puerto 3000 ya estaba siendo utilizado por otro proceso.

Otra dificultad fue adaptar la comunicaci├│n del firmware del ESP32 para que pudiera enviar informaci├│n al servidor mediante solicitudes HTTP. Asimismo, fue necesario considerar la posibilidad de recibir varias notificaciones con un mismo estado de lluvia, ya que esto pod├¡a provocar registros repetidos en el historial de eventos.

### Soluciones implementadas

Para organizar el funcionamiento de la aplicaci├│n se separaron las responsabilidades del frontend, el backend y la base de datos en sus respectivos directorios. Se implementaron endpoints espec├¡ficos para consultar el estado del sistema, obtener el historial y registrar nuevos eventos.

Para almacenar la informaci├│n se utiliz├│ SQLite, mientras que se incorpor├│ una l├│gica de deduplicaci├│n para evitar registros innecesarios cuando se recibe repetidamente el mismo estado. En cuanto al conflicto del puerto 3000, se revis├│ la ejecuci├│n del servidor y se logr├│ iniciarlo cuando el puerto estuvo disponible.

Para la comunicaci├│n con el ESP32 se incorpor├│ HTTPClient en el firmware, preparando el env├¡o de los cambios de estado hacia el backend. Finalmente, se utilizaron comandos de Git para organizar, confirmar y publicar los cambios en el repositorio compartido.

### Decisiones t├®cnicas

Para el desarrollo de la interfaz se utilizaron HTML, CSS y JavaScript, debido a que permiten construir una aplicaci├│n web que presenta de manera organizada el estado del detector de lluvia, las alertas y el historial de eventos.

Se seleccion├│ Node.js junto con Express para desarrollar el backend y gestionar las solicitudes realizadas por la aplicaci├│n y los componentes del sistema. Para almacenar los eventos se utiliz├│ SQLite, ya que permite mantener la informaci├│n de manera estructurada y consultarla desde los servicios implementados.

Tambi├®n se decidi├│ separar el c├│digo en directorios para facilitar la organizaci├│n y el mantenimiento del proyecto. Para la comunicaci├│n entre el ESP32 y el backend se incorpor├│ HTTPClient, con el prop├│sito de transmitir los cambios de estado del sensor mediante la red Wi-Fi.

Por ├║ltimo, se implement├│ un mecanismo para evitar eventos duplicados y se utiliz├│ GitHub como herramienta de control de versiones y colaboraci├│n entre los integrantes del equipo.

### Pruebas efectuadas

Durante esta etapa ejecut├® el backend mediante el comando `npm start` para comprobar que el servidor pudiera iniciar correctamente y mostrar las direcciones de red disponibles. Durante la ejecuci├│n se present├│ un conflicto porque el puerto 3000 ya estaba siendo utilizado por otro proceso, por lo que fue necesario revisar la disponibilidad del puerto antes de iniciar nuevamente el servidor. Tambi├®n incorpor├® un archivo de pruebas automatizadas en `src/backend/test/backend.test.js` para verificar la l├│gica implementada en el backend. Adicionalmente, prepar├® la comunicaci├│n entre el firmware del ESP32 y el servidor mediante solicitudes HTTP utilizando HTTPClient. Finalmente, verifiqu├® la publicaci├│n de los cambios en GitHub mediante comandos de Git, comprobando que la rama `main` quedara sincronizada con `origin/main` y que no existieran modificaciones pendientes. La prueba f├¡sica de integraci├│n entre el sensor de lluvia, el ESP32 y la aplicaci├│n web queda pendiente de realizarse para confirmar el funcionamiento completo del prototipo.

### Aprendizajes obtenidos

Durante esta semana reforc├® mis conocimientos sobre el desarrollo de aplicaciones web y la integraci├│n de diferentes componentes de software dentro de un proyecto IoT. Aprend├¡ a organizar una aplicaci├│n separando el frontend, el backend y la base de datos, adem├ís de implementar servicios para recibir, almacenar y consultar informaci├│n. Tambi├®n reforc├® el uso de Node.js, Express y SQLite, as├¡ como la comunicaci├│n mediante solicitudes HTTP entre dispositivos electr├│nicos y un servidor. Por otra parte, adquir├¡ experiencia trabajando con Git y GitHub para integrar y publicar cambios dentro de un proyecto colaborativo.

### Pr├│ximos pasos

Como siguientes pasos, queda pendiente realizar pruebas f├¡sicas del prototipo para comprobar que el sensor de lluvia detecte correctamente los cambios en las condiciones clim├íticas y que el ESP32 pueda transmitir esa informaci├│n al backend mediante Wi-Fi. Tambi├®n ser├í necesario verificar que los eventos recibidos se almacenen correctamente en SQLite y que la interfaz web muestre el estado actual y el historial de acuerdo con la informaci├│n recibida. Posteriormente, se deber├ín realizar pruebas de integraci├│n para comprobar el funcionamiento conjunto de la maqueta, los componentes electr├│nicos y la aplicaci├│n web. Adem├ís, queda pendiente trabajar en el art├¡culo del proyecto y continuar documentando los avances, las dificultades y las soluciones implementadas.

---

<!-- Agrega una secci├│n nueva por cada semana siguiendo el mismo formato -->

<!--
## Semana 3 ÔÇö [DD/MM/AAAA] a [DD/MM/AAAA]

### Actividades realizadas

### Avances

### Dificultades encontradas

### Soluciones implementadas

### Decisiones t├®cnicas

### Pruebas efectuadas

### Aprendizajes obtenidos

### Pr├│ximos pasos
-->
