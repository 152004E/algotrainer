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

-   Generación de **casos aleatorios** (5 subsets: WV, MW, OLL, PLL, F2L)
-   **Scrambles dinámicos** vía Kociemba/min2phase (564/564 validados)
-   **Cubo 3D virtual** con `<twisty-player>`: rotación libre, move-press, hint facelets, guía de caras
-   Visualización del **scramble** que genera ese caso
-   **Dos modos de entrenamiento**: reconocimiento (pasivo) y resolución en cubo virtual
-   Visualización del **algoritmo correspondiente** (revelado manual o automático en modo aprender)
-   **Verificación de resolución por estado** (AUF-tolerant, 135/135 tests)
-   Botón **Siguiente caso** para cambiar rápidamente
-   **Settings persistentes** por modo (guía, hint facelets, controles, ocultar cubo, modo aprender)
-   Atajos de teclado: `Space` (revelar/siguiente), `U/D/R/L/F/B` + `Shift`/`2`/`Z` (modo virtual)
-   Sistema de **práctica continua** con estadísticas de sesión

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

-   React 19
-   TypeScript
-   Vite 7
-   TailwindCSS v4
-   React Router v7
-   cubing.js (para visualización 3D interactiva del cubo y generación de scrambles vía Kociemba/min2phase)

Estas tecnologías permiten crear una aplicación rápida, modular y fácil
de mantener.

------------------------------------------------------------------------

# 📁 Estructura del proyecto

    src
    │
    ├── Components/
    │   ├── GlobalComponents/      Navbar, Footer, Button, ThemeToggle, etc.
    │   ├── cube/                  CubeHero (Home)
    │   ├── Home/                  Hero, AlgorithmSection, HowItWorks
    │   ├── trainer/               TrainerPage, PassiveTrainerView, VirtualTrainerView,
    │   │                          CubeViewer (twisty-player real), ScrambleBox,
    │   │                          AlgorithmBox, AlgorithmReveal, NextCaseButton,
    │   │                          FeedbackPanel, PrimaryButton, SecondaryButton,
    │   │                          SpaceHint, ToggleSwitch, SettingsModal, difficulty
    │   ├── algorithms/            AlgorithmCard, AlgorithmFilter, AlgorithmModal, ...
    │   └── Modals/                TrainerModal
    │
    ├── Layouts/                   MainLayout, TrainerLayout
    ├── pages/                     Home, About, /algorithms, /trainer/{wv,mw,oll,pll,f2l}
    ├── hooks/                     useTrainer, useScrambledTrainer, useExecutionTrainer,
    │                              useTrainerSettings, TrainerStatsStore
    ├── utils/                     scrambleService, verifySolve, mirrorAlgorithm,
    │                              resolveVariants
    └── data/                      WVCases, MWCases, OLLCases, PLLCases, f2lCases,
                                   algorithmCatalog

Cada carpeta tiene un propósito específico:

-   **Components/** → Componentes reutilizables de la interfaz
-   **pages/** → Páginas principales de la aplicación (rutas)
-   **Layouts/** → Layouts compartidos (MainLayout, TrainerLayout)
-   **hooks/** → Lógica reutilizable del trainer y settings
-   **utils/** → Servicios (scramble, verificación) y utilidades puras
-   **data/** → Algoritmos y datos de entrenamiento (5 subsets)

------------------------------------------------------------------------

# 🎯 Funcionamiento del Trainer

Cada trainer tiene dos modos de entrenamiento seleccionables desde la
interfaz (toggle persistido):

-   **Reconocimiento**: cubo virtual + scramble. Mirá, reconocé el caso,
    revelá el algoritmo manualmente si lo necesitás, y avanzá al siguiente.
-   **Resolución en cubo virtual**: ejecutá el algoritmo en el cubo
    interactivo (U/D/R/L/F/B, Shift=inverso, 2=doble, Z=retroceder) y
    verificá la resolución por estado del cubo.

Información que muestra el trainer:

    Case: WV 12

    Scramble:
    R U R' U' F2 ...

    [Cubo 3D virtual]

    Algoritmo recomendado:
    R U R' U R U2 R'

    [ Lo sé — Ejecutar ] / [ Comprobar ] / [ Siguiente caso ]

Cada vez que el usuario presione **Siguiente caso** (`Space` o botón),
la aplicación generará un nuevo scramble para el mismo u otro caso.

------------------------------------------------------------------------

# 🔮 Mejoras futuras

Funcionalidades implementadas pero no aplicadas a todos los subsets
(ver `docs/PLAN.md`):

-   **Migrar MW/OLL/PLL/F2L** a la nueva base (`<TrainerPage cases={...} />`)
   para que también tengan modos pasivo/virtual, settings y cubo virtual
-   **Tab Cronómetro** del modal de ajustes (placeholder, sin funcionalidad)
-   **Stats Ao5/Ao12 + timer de ejecución** visibles en sidebar
-   **Modo examen**
-   **Modo weak cases**
-   **Persistencia de progreso** en localStorage (progreso, casos dominados)

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
