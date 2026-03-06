# 🧩 AlgoTrainer

AlgoTrainer es una aplicación web diseñada para **speedcubers** que
desean practicar y mejorar su conocimiento de algoritmos del cubo de
Rubik.

La plataforma permite entrenar distintos **sets de algoritmos**,
practicar el **reconocimiento de casos** y mejorar la **ejecución de
algoritmos** mediante sesiones de práctica rápidas y continuas.

El objetivo del proyecto es ofrecer una herramienta simple y eficiente
para entrenar algoritmos, similar a los sistemas de práctica utilizados
por speedcubers avanzados.

------------------------------------------------------------------------

# 🚀 Características

La aplicación incluye las siguientes funciones principales:

-   Generación de **casos aleatorios**
-   Visualización del **scramble** que genera ese caso
-   Visualización del **algoritmo correspondiente**
-   Botón **Next Case** para cambiar rápidamente al siguiente caso
-   Opción para **ocultar el algoritmo** y practicar reconocimiento
-   Sistema de **práctica continua**

Estas herramientas permiten entrenar algoritmos de manera eficiente y
enfocada.

------------------------------------------------------------------------

# 📚 Sets de algoritmos incluidos

AlgoTrainer permitirá practicar diferentes conjuntos de algoritmos del
cubo 3x3:

-   **Winter Variation (WV)**
-   **Magic Wondeful (casos F2L)**
-   **OLL (Orientation of the Last Layer)**
-   **PLL (Permutation of the Last Layer)**

------------------------------------------------------------------------

# 🛠 Tecnologías utilizadas

El proyecto está construido con tecnologías modernas de desarrollo web:

-   React
-   Vite
-   JavaScript
-   cubing.js (para visualización del cubo 3D)

Estas tecnologías permiten crear una aplicación rápida, modular y fácil
de mantener.

------------------------------------------------------------------------

# 📁 Estructura del proyecto

Estructura recomendada del proyecto:

    src
    │
    ├── components
    │   ├── CaseViewer.jsx
    │   ├── ScrambleBox.jsx
    │   └── AlgoBox.jsx
    │
    ├── pages
    │   ├── Home.jsx
    │   └── Trainer.jsx
    │
    ├── data
    │   ├── wv.js
    │   ├── oll.js
    │   └── pll.js
    │
    ├── App.jsx
    └── main.jsx

Cada carpeta tiene un propósito específico:

-   **components** → Componentes reutilizables de la interfaz
-   **pages** → Páginas principales de la aplicación
-   **data** → Algoritmos y datos de entrenamiento
-   **App.jsx** → Configuración principal de la aplicación
-   **main.jsx** → Punto de entrada del proyecto

------------------------------------------------------------------------

# 🎯 Funcionamiento del Trainer

La página de entrenamiento mostrará información como:

    Case: WV 12

    Scramble:
    R U R' U' F2 ...

    Algoritmo:
    R U R' U R U2 R'

    [ Next Case ]

Cada vez que el usuario presione **Next Case**, la aplicación generará
un nuevo caso aleatorio para continuar la práctica.

------------------------------------------------------------------------

# 🔮 Mejoras futuras

En futuras versiones se podrían añadir nuevas funciones como:

-   Generador de **scrambles específicos**
-   **Modo examen**
-   **Modo reconocimiento**
-   **Estadísticas de entrenamiento**
-   **Cubo 3D interactivo**

Soporte para más sets de algoritmos:

-   ZBLL
-   CLL
-   COLL
-   F2L avanzado

------------------------------------------------------------------------

# 🎯 Objetivo del proyecto

El objetivo de AlgoTrainer es proporcionar una herramienta práctica para
que los **speedcubers** puedan entrenar algoritmos de manera organizada,
rápida y eficiente.

La aplicación busca mejorar tanto el **reconocimiento de casos** como la
**ejecución de algoritmos**, dos habilidades fundamentales para mejorar
tiempos en el cubo de Rubik.
