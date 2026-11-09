# Proyecto: Rain Detector

# Bitácora de: Armando José Solís Villegas

## Semana 1 — [11/10/2026] a [18/10/2026]

### Actividades realizadas

- Configuración del entorno de desarrollo local y de las herramientas necesarias para el equipo.
- Definición e implementación de la estructura inicial del proyecto y organización de directorios (`src/firmware`, `src/backend`, `src/frontend`, `docs/`, `bitacoras/`).
- Creación y configuración inicial del repositorio en GitHub, gestión de ramas de trabajo, archivo `.gitignore` y documentación base en el `README.md`.

### Avances

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
- Colaborar en el montaje físico y elementos demostrativos de la maqueta del tendedero.

---

## Semana 2 — [19/10/2026] a [26/10/2026]

### Actividades realizadas

- Elaboración y confección de ropa a escala (prendas en miniatura) para la maqueta física del proyecto Rain Detector.
- Adaptación de las prendas con ganchos pequeños y ajuste en la cuerda/palanca móvil del tendedero conectada al servomotor.
- Pruebas físicas de peso, balance y desplazamiento mecánico para asegurar que el servomotor mueva la ropa entre la intemperie y la zona protegida sin trabarse.

### Avances

- Se confeccionaron y adaptaron varias piezas de ropa en miniatura utilizando telas ligeras y cortes proporcionales a las dimensiones de la maqueta de la casa.
- Se integró la ropa al mecanismo del tendedero móvil, logrando una representación visual realista del funcionamiento del sistema.
- Se verificó que el movimiento de entrada (0°, posición protegida bajo techo) y salida (90°, posición expuesta al sol) se ejecute de manera fluida y sin obstáculos mecánicos.

### Dificultades encontradas

- Si las prendas eran muy pesadas o excesivamente grandes, el microservomotor SG90 experimentaba sobreesfuerzo en el brazo mecánico o las prendas se atoraban con los bordes del techo/pared de la maqueta al momento de retraer el tendedero.
- Lograr una sujeción firme pero liviana para que las prendas no se desprendieran durante las aceleraciones del servomotor.

### Soluciones implementadas

- Se seleccionaron retazos de tela delgada y liviana y se redujo la escala de las prendas, calibrando la distancia de separación entre ellas en el alambre del tendedero.
- Se diseñaron ganchos miniaturas ligeros y estables para fijar las prendas a la cuerda sin añadir peso innecesario.
- Se ajustaron los topes y la trayectoria del brazo mecánico para garantizar una apertura y cierre libre de fricción.

### Decisiones técnicas

- Uso de materiales textiles ligeros y ganchos a escala para no superar el límite de torque del servomotor SG90 (1.8 kg·cm a 4.8V).
- Establecer un rango de movimiento angular de 90° (desde 90° al exterior hasta 0° en el interior resguardado) para asegurar que toda la ropa quede completamente cubierta por la estructura del techo de la vivienda.

### Pruebas efectuadas

- Pruebas mecánicas de movimiento continuo activando el servomotor entre 0° y 90° repetidamente con la ropa colgada, verificando estabilidad física y ausencia de atascos.
- Simulación manual de detección para corroborar que al activarse la alerta, la ropa queda resguardada a tiempo del área de exposición al agua.

### Aprendizajes obtenidos

- Consideraciones de diseño mecánico en prototipos IoT: la importancia de evaluar el torque, peso y dimensiones físicas de los elementos para no comprometer el desempeño de los actuadores electrónicos.
- Técnicas de prototipado rápido y elaboración de modelos a escala para demostraciones funcionales de proyectos integradores.

### Próximos pasos

- Realizar la investigación de fuentes bibliográficas confiables para el artículo académico del proyecto.
- Redactar las referencias en formato IEEE y colaborar en la revisión final del documento formal.

---

## Semana 3 — [27/10/2026] a [08/11/2026]

### Actividades realizadas

- Búsqueda e investigación exhaustiva de fuentes bibliográficas académicas y técnicas sobre Internet de las Cosas (IoT), sensores de lluvia (módulo FC-37), microcontroladores (Arduino UNO R3 y ESP32) y sistemas de automatización doméstica.
- Redacción y estructuración rigurosa de las referencias bibliográficas del artículo del proyecto bajo las directrices y normas de citación IEEE.
- Participación en la revisión editorial y unificación final del artículo técnico junto con los compañeros de equipo (verificación de citas en el texto, ortografía, formato a dos columnas, numeración de tablas y figuras).

### Avances

- Se investigaron e integraron 6 referencias primarias y secundarias de alto rigor académico en formato IEEE:
  - Documentos de cátedra y especificaciones de Proyecto Integrador de la UNA [1].
  - Guía oficial de citación y referenciación con normas IEEE de la Revista Forestal Mesoamericana Kurú [2].
  - Artículo científico sobre arquitectura y tecnologías habilitadoras de IoT en *IEEE Communications Surveys & Tutorials* [3].
  - Artículo indexado en *Journal of Engineering Technology* sobre sistemas automatizados de tendedero con sensor FC-37 y monitoreo [4].
  - Manual de referencia y datasheet del fabricante de Arduino UNO R3 [5].
  - Hoja de datos técnica (Datasheet v5.3) oficial de Espressif Systems para el ESP32 [6].
- Se completó la revisión integral del manuscrito del artículo, asegurando consistencia entre las afirmaciones teóricas, la metodología descrita y las citas bibliográficas correspondientes.
- Se verificó que la tabla de resultados de pruebas físicas (lecturas ADC de 112 a 436 y respuestas HTTP 200) y las figuras estuvieran debidamente identificadas y referenciadas en el texto.

### Dificultades encontradas

- Encontrar artículos científicos específicos sobre automatización de tendederos residenciales basados en sensores de lluvia para contrastar con nuestra solución técnica.
- Adaptar rigurosamente los metadatos de las fuentes digitales (autores, títulos normalizados, volumen, número, páginas, DOI o enlaces con fecha de acceso) conforme a la última versión del estándar IEEE.

### Soluciones implementadas

- Búsqueda dirigida en repositorios y revistas internacionales de ingeniería y tecnología (IEEE Xplore, Google Scholar, UTeM Journal of Engineering Technology), identificando trabajos afines como el de Sulaiman et al. (2023).
- Aplicación sistemática de la guía de la Revista Forestal Mesoamericana Kurú para estructurar cada tipo de fuente (artículo de revista, manual de producto, especificación institucional).

### Decisiones técnicas

- Seleccionar una combinación equilibrada de referencias teóricas fundamentales de IoT (Al-Fuqaha et al.), antecedentes directos de tendederos automatizados y documentación oficial de los fabricantes del hardware empleado (Arduino y Espressif).
- Mantener la trazabilidad de citas en el cuerpo del artículo mediante corchetes numéricos correlativos ([1] a [6]) en las secciones de Introducción, Marco Teórico y Discusión.

### Pruebas efectuadas

- Verificación cruzada entre cada cita numérica en el texto y su respectiva entrada en la lista final de Referencias para descartar discrepancias o referencias huérfanas.
- Revisión de estilo editorial: formato de dos columnas, numeración consecutiva de figuras y tablas, y control ortográfico y gramatical del documento consolidado.

### Aprendizajes obtenidos

- Aplicación práctica de las normas de estilo y citación IEEE para artículos de ingeniería e informática.
- Criterios para evaluar la validez y confiabilidad de fuentes bibliográficas (papers indexados vs. hojas de datos de fabricantes vs. documentación académica).
- Procesos de revisión por pares y edición colaborativa para la entrega formal de un documento de investigación integrador.

### Próximos pasos

- Preparar la defensa y presentación oral del proyecto integrador ante el profesor y compañeros del curso.
- Apoyar en la demostración en vivo del funcionamiento de la maqueta y la plataforma web.
