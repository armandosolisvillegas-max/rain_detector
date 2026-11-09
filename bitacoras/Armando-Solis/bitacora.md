# Proyecto: Rain Detector

# Bitácora de: Armando José Solís Villegas

## Semana 1 — [11/10/2026] a [18/10/2026]

### Actividades realizadas

- Configuración del entorno de desarrollo local y de las herramientas necesarias para el equipo.
- Definición e implementación de la estructura inicial del proyecto y organización de directorios (`src/firmware`, `src/backend`, `src/frontend`, `docs/`, `bitacoras/`).
- Creación y configuración inicial del repositorio en GitHub, gestión de ramas de trabajo, archivo `.gitignore` y documentación base en el `README.md`.

### Avances

- Commit: abc1234 — "Estructura inicial del repositorio y configuración de firmware"
- Estructura del repositorio consolidada y organizada por módulos para firmware, backend, frontend y documentación.
- Integración del equipo de trabajo y estandarización del flujo de ramas y Pull Requests para el desarrollo colaborativo.
- Commits relevantes:
  - `4c288bd` — "Implemnetacion de la estructura del Proyecto"
  - `132a88c` — "Doc nuevo"
  - `c75ffc4` — "Ajustes de la estructura"
  - `b6debae` — "Add team member to README.md"

### Dificultades encontradas

- Definir una estructura de carpetas limpia y modular que permitiera separar de manera ordenada el código de microcontroladores/firmware (Arduino y ESP32), el backend en Node.js, la interfaz web (frontend) y la documentación técnica sin generar conflictos entre los integrantes.
- Establecer las reglas de exclusión en `.gitignore` para evitar subir archivos temporales, dependencias pesadas (`node_modules`) o binarios de compilación.

### Soluciones implementadas

- Se investigaron buenas prácticas de organización para proyectos IoT integrados (firmware + web/servidor) y se estructuró una jerarquía de directorios clara y comprensible para todos los miembros del equipo.
- Se configuró un archivo `.gitignore` adaptado tanto para entornos Node.js como para desarrollo de microcontroladores y C++.

### Decisiones técnicas

- Organización modular del proyecto dividiendo el código fuente (`src/`) en tres subsistemas claros: `firmware` (código de Arduino y ESP32), `backend` (API y servidor Node.js) y `frontend` (interfaz de usuario).
- Uso de Git y GitHub mediante ramas por integrante y Pull Requests para garantizar la revisión, respaldo y trazabilidad de los cambios.
- Creación de un espacio específico para bitácoras individuales (`bitacoras/<Nombre-Apellido>`) para llevar el registro del avance personal de cada integrante.

### Pruebas efectuadas

- Verificación de la clonación correcta del repositorio y sincronización de ramas de trabajo (`ArmandoBranch` hacia `main`).
- Validación de que la estructura de carpetas y archivos base estuvieran disponibles y accesibles para todos los miembros del equipo.

### Aprendizajes obtenidos

- Importancia de definir una arquitectura de directorios clara y estandarizada desde el inicio del proyecto para evitar conflictos de fusión y desorden entre los distintos módulos.
- Gestión de flujos de trabajo colaborativos en Git con ramas de características y Pull Requests.

### Próximos pasos

- Apoyar en la integración y validación del flujo entre los módulos de firmware y la aplicación web.
- Documentar las pruebas del sistema e incorporar detalles adicionales a la documentación técnica y arquitectura del proyecto.

---

<!-- Agrega una sección nueva por cada semana siguiendo el mismo formato -->

<!--
## Semana 2 — [DD/MM/AAAA] a [DD/MM/AAAA]
### Actividades realizadas
- ...
### Avances
- ...
### Dificultades encontradas
- ...
### Soluciones implementadas
- ...
### Decisiones técnicas
- ...
### Pruebas efectuadas
- ...
### Aprendizajes obtenidos
- ...
### Próximos pasos
- ...
-->
