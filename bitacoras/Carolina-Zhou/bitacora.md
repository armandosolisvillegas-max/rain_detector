
# Proyecto: Rain Detector

# Bitácora de: Carolina Zhou Zheng

## Semana 1 — 18/10/2026

### Actividades realizadas

Participé en la construcción de la maqueta de la casa para representar físicamente la propuesta del proyecto Rain Detector. Colaboré en la elaboración de la estructura, organización y distribución de los elementos que conforman la vivienda, procurando que la maqueta permitiera representar el funcionamiento del sistema automatizado.

También participé en la instalación y organización de los componentes electrónicos del proyecto, incluyendo el Arduino, el sensor de lluvia y el servomotor. Durante esta actividad colaboré con el montaje de los componentes y su incorporación a la estructura física de la casa, con el propósito de representar cómo funcionaría el sistema ante la detección de lluvia.

### Avances

Se completó la construcción de la estructura principal de la maqueta y se avanzó en la instalación de los componentes electrónicos necesarios para representar el funcionamiento del Rain Detector. Además, se estableció una primera relación entre la parte física de la vivienda y los elementos encargados de detectar la lluvia y generar una respuesta automatizada.

### Dificultades encontradas

Durante la elaboración de la maqueta fue necesario organizar adecuadamente el espacio disponible para incorporar los componentes electrónicos sin afectar la estructura de la casa. También fue necesario considerar la ubicación de los elementos para que pudieran representar correctamente el funcionamiento esperado del proyecto.

### Soluciones implementadas

Se trabajó en conjunto para organizar la estructura de la maqueta y distribuir los componentes electrónicos de manera que pudieran integrarse con la representación física de la vivienda. Se realizaron ajustes durante el montaje para facilitar la incorporación de los elementos del sistema.

### Decisiones técnicas

Se decidió utilizar una maqueta de una vivienda como representación física del proyecto, ya que permite demostrar de manera visual cómo funcionaría un sistema de detección de lluvia aplicado a una casa. También se incorporaron los componentes electrónicos necesarios para representar la detección de lluvia y la respuesta automatizada mediante el servomotor.

### Pruebas efectuadas

Durante esta etapa se trabajó principalmente en la construcción y el montaje físico de la maqueta, así como en la instalación de los componentes electrónicos. Se realizó la organización inicial de los elementos para comprobar que pudieran incorporarse a la estructura de la vivienda. Las pruebas completas de funcionamiento del sistema quedaron pendientes para las siguientes etapas del proyecto.

### Aprendizajes obtenidos

Esta actividad me permitió comprender mejor la relación entre la estructura física de un prototipo y los componentes electrónicos que permiten automatizar su funcionamiento. También aprendí sobre la importancia de planificar la distribución de los componentes desde la construcción de la maqueta, para facilitar su posterior integración y funcionamiento.

### Próximos pasos

Continuar con el desarrollo del proyecto mediante la integración de los componentes electrónicos, la programación del sistema y la creación de una aplicación que permita visualizar la información generada por el detector de lluvia.

---

## Semana 2 — 26/10/2026 a 29/10/2026

### Actividades realizadas

Durante esta semana trabajé en el desarrollo de la aplicación web del proyecto Rain Detector. Mi participación se enfocó en construir la interfaz de usuario y desarrollar la lógica del backend necesaria para recibir, almacenar y consultar la información generada por el sistema de detección de lluvia.

En la parte del frontend desarrollé la estructura de la interfaz utilizando HTML, CSS y JavaScript. La aplicación permite visualizar el estado actual del detector de lluvia, presentar alertas y consultar un historial de eventos que registra los cambios de estado, incluyendo sus respectivas fechas y horas.

En cuanto al backend, trabajé con Node.js y Express para implementar los servicios encargados de procesar la información. También desarrollé la lógica de conexión con SQLite para almacenar los eventos generados por el sistema. Se implementaron endpoints para consultar el estado actual, obtener el historial y registrar nuevos eventos.

Además, trabajé en la integración del firmware del ESP32 con el backend mediante solicitudes HTTP utilizando HTTPClient. El objetivo de esta implementación es permitir que el ESP32 envíe los cambios de estado detectados por el sensor hacia el servidor a través de una conexión Wi-Fi.

Finalmente, organicé los archivos desarrollados, incorporé pruebas para el backend, actualicé la documentación correspondiente y publiqué los cambios en el repositorio compartido de GitHub.

### Avances

Se desarrolló la interfaz web del proyecto mediante los archivos `index.html`, `styles.css` y `app.js`, permitiendo visualizar el estado actual de la lluvia, las alertas y el historial de eventos.

Se implementó el backend utilizando Node.js y Express en el archivo `server.js`, junto con la lógica de persistencia de datos en `database.js` mediante SQLite.

Se desarrollaron los endpoints `/api/status`, `/api/events` y `POST /api/events`, destinados a consultar el estado del sistema, recuperar los eventos registrados y almacenar nuevos eventos.

También se incorporó una lógica para evitar registros duplicados cuando se recibe repetidamente un mismo estado de lluvia. Adicionalmente, se trabajó en la integración del firmware del ESP32 con el backend mediante HTTPClient, preparando el envío de los cambios de estado del sensor a través de Wi-Fi.

Se agregaron pruebas automatizadas para el backend y documentación sobre su funcionamiento. Finalmente, se publicaron los cambios realizados en la rama `main` del repositorio.

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

El commit registró modificaciones en 10 archivos, con 2278 inserciones y 26 eliminaciones.

### Dificultades encontradas

Durante el desarrollo fue necesario organizar la comunicación entre los diferentes componentes del sistema para conseguir que la información pudiera recibirse, almacenarse y mostrarse correctamente. También se presentó un conflicto al ejecutar el backend debido a que el puerto 3000 ya estaba siendo utilizado por otro proceso.

Otra dificultad fue adaptar la comunicación del firmware del ESP32 para que pudiera enviar información al servidor mediante solicitudes HTTP. Asimismo, fue necesario considerar la posibilidad de recibir varias notificaciones con un mismo estado de lluvia, ya que esto podía provocar registros repetidos en el historial de eventos.

### Soluciones implementadas

Para organizar el funcionamiento de la aplicación se separaron las responsabilidades del frontend, el backend y la base de datos en sus respectivos directorios. Se implementaron endpoints específicos para consultar el estado del sistema, obtener el historial y registrar nuevos eventos.

Para almacenar la información se utilizó SQLite, mientras que se incorporó una lógica de deduplicación para evitar registros innecesarios cuando se recibe repetidamente el mismo estado. En cuanto al conflicto del puerto 3000, se revisó la ejecución del servidor y se logró iniciarlo cuando el puerto estuvo disponible.

Para la comunicación con el ESP32 se incorporó HTTPClient en el firmware, preparando el envío de los cambios de estado hacia el backend. Finalmente, se utilizaron comandos de Git para organizar, confirmar y publicar los cambios en el repositorio compartido.

### Decisiones técnicas

Para el desarrollo de la interfaz se utilizaron HTML, CSS y JavaScript, debido a que permiten construir una aplicación web que presenta de manera organizada el estado del detector de lluvia, las alertas y el historial de eventos.

Se seleccionó Node.js junto con Express para desarrollar el backend y gestionar las solicitudes realizadas por la aplicación y los componentes del sistema. Para almacenar los eventos se utilizó SQLite, ya que permite mantener la información de manera estructurada y consultarla desde los servicios implementados.

También se decidió separar el código en directorios para facilitar la organización y el mantenimiento del proyecto. Para la comunicación entre el ESP32 y el backend se incorporó HTTPClient, con el propósito de transmitir los cambios de estado del sensor mediante la red Wi-Fi.

Por último, se implementó un mecanismo para evitar eventos duplicados y se utilizó GitHub como herramienta de control de versiones y colaboración entre los integrantes del equipo.

### Pruebas efectuadas

Durante esta etapa ejecuté el backend mediante el comando `npm start` para comprobar que el servidor pudiera iniciar correctamente y mostrar las direcciones de red disponibles. Durante la ejecución se presentó un conflicto porque el puerto 3000 ya estaba siendo utilizado por otro proceso, por lo que fue necesario revisar la disponibilidad del puerto antes de iniciar nuevamente el servidor. También incorporé un archivo de pruebas automatizadas en `src/backend/test/backend.test.js` para verificar la lógica implementada en el backend. Adicionalmente, preparé la comunicación entre el firmware del ESP32 y el servidor mediante solicitudes HTTP utilizando HTTPClient. Finalmente, verifiqué la publicación de los cambios en GitHub mediante comandos de Git, comprobando que la rama `main` quedara sincronizada con `origin/main` y que no existieran modificaciones pendientes. La prueba física de integración entre el sensor de lluvia, el ESP32 y la aplicación web queda pendiente de realizarse para confirmar el funcionamiento completo del prototipo.

### Aprendizajes obtenidos

Durante esta semana reforcé mis conocimientos sobre el desarrollo de aplicaciones web y la integración de diferentes componentes de software dentro de un proyecto IoT. Aprendí a organizar una aplicación separando el frontend, el backend y la base de datos, además de implementar servicios para recibir, almacenar y consultar información. También reforcé el uso de Node.js, Express y SQLite, así como la comunicación mediante solicitudes HTTP entre dispositivos electrónicos y un servidor. Por otra parte, adquirí experiencia trabajando con Git y GitHub para integrar y publicar cambios dentro de un proyecto colaborativo.

### Próximos pasos

Como siguientes pasos, queda pendiente realizar pruebas físicas del prototipo para comprobar que el sensor de lluvia detecte correctamente los cambios en las condiciones climáticas y que el ESP32 pueda transmitir esa información al backend mediante Wi-Fi. También será necesario verificar que los eventos recibidos se almacenen correctamente en SQLite y que la interfaz web muestre el estado actual y el historial de acuerdo con la información recibida. Posteriormente, se deberán realizar pruebas de integración para comprobar el funcionamiento conjunto de la maqueta, los componentes electrónicos y la aplicación web. Además, queda pendiente trabajar en el artículo del proyecto y continuar documentando los avances, las dificultades y las soluciones implementadas.

---
****
---

## Semana 3 — 15/11/2026 a 16/11/2026

### Actividades realizadas

Durante esta semana participé en una reunión de trabajo con los integrantes del equipo para realizar los últimos ajustes del proyecto Rain Detector. El objetivo principal fue revisar los detalles de la maqueta, mejorar su presentación física y comprobar que los diferentes componentes estuvieran correctamente ubicados e integrados.

Durante la reunión se revisó la estructura de la vivienda y la distribución de los elementos electrónicos, procurando que la representación del sistema fuera clara y que la maqueta permitiera demostrar adecuadamente el funcionamiento del tendedero automatizado.

Además, se realizaron pruebas de funcionamiento para verificar la respuesta del sensor de lluvia, el movimiento del servomotor y la comunicación entre los componentes del sistema y la aplicación web. También se revisaron los detalles finales para asegurarnos de que el proyecto estuviera preparado para su presentación y demostración.

### Avances

Se realizaron los últimos ajustes en la maqueta física del proyecto, mejorando la organización y presentación de sus componentes. Asimismo, se revisó el funcionamiento general del prototipo y se llevaron a cabo pruebas para comprobar que el sistema respondiera correctamente ante la detección de lluvia.

También se verificó el funcionamiento de la aplicación web, incluyendo la recepción de información, la visualización del estado del detector y el registro de eventos en el historial.

Con estas actividades se avanzó en la finalización del proyecto, integrando los aspectos físicos y de software desarrollados durante las semanas anteriores.

### Dificultades encontradas

Durante la revisión final fue necesario prestar atención a pequeños detalles de la maqueta y a la correcta organización de los componentes, ya que estos aspectos podían influir tanto en la presentación como en la demostración del prototipo.

También fue importante comprobar que los diferentes elementos funcionaran de manera coordinada y que la información presentada en la aplicación web correspondiera con los cambios detectados por el sistema.

### Soluciones implementadas

Se realizaron ajustes en la distribución y presentación de los elementos de la maqueta para mejorar su organización. Además, se revisaron las conexiones y el funcionamiento de los componentes electrónicos, efectuando pruebas para identificar posibles inconvenientes antes de la presentación final.

En cuanto al software, se verificó el funcionamiento del backend y del dashboard, comprobando que la información pudiera recibirse y visualizarse correctamente.

### Decisiones técnicas

Se decidió enfocar esta última etapa en la revisión general del prototipo y en la corrección de los detalles pendientes, priorizando la estabilidad del funcionamiento y la presentación de la maqueta.

También se consideró importante realizar pruebas de los componentes físicos y de la aplicación web para comprobar que las partes desarrolladas durante el proyecto estuvieran correctamente integradas.

### Pruebas efectuadas

Se realizaron pruebas físicas con el sensor de lluvia para comprobar su capacidad de detectar la presencia de agua y generar el cambio de estado correspondiente. También se verificó la respuesta del servomotor, observando su movimiento de acuerdo con las condiciones detectadas por el sensor.

Adicionalmente, se revisó la comunicación con la aplicación web para comprobar la recepción de los datos, las respuestas del backend y la actualización del dashboard y del historial de eventos.

Estas pruebas permitieron revisar el funcionamiento general del prototipo y realizar los últimos ajustes necesarios para su demostración.

### Aprendizajes obtenidos

Durante esta última semana reforcé la importancia de realizar pruebas de integración antes de considerar terminado un proyecto. Aprendí que no es suficiente con desarrollar cada componente por separado, sino que también es necesario comprobar que todos funcionen correctamente en conjunto.

Asimismo, comprendí la importancia de revisar los detalles físicos de una maqueta, mantener una buena organización de los componentes y trabajar colaborativamente para resolver los últimos aspectos pendientes de un proyecto.

Esta experiencia me permitió relacionar los conocimientos adquiridos durante el curso con el desarrollo de un prototipo funcional que combina programación, electrónica, automatización y desarrollo web.

### Próximos pasos

Al tratarse de la última semana de desarrollo, los siguientes pasos consisten en finalizar la documentación del proyecto, preparar la presentación y organizar la demostración del prototipo. También queda completar la entrega de los archivos y evidencias correspondientes.

<!-- Agrega una sección nueva por cada semana siguiendo el mismo formato -->

<!--
## Semana 3 — [DD/MM/AAAA] a [DD/MM/AAAA]

### Actividades realizadas

### Avances

### Dificultades encontradas

### Soluciones implementadas

### Decisiones técnicas

### Pruebas efectuadas

### Aprendizajes obtenidos

### Próximos pasos
-->
