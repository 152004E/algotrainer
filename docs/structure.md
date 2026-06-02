# Estructura del Proyecto

## Árbol de Archivos

```
algotrainer/
├── docs/
│   ├── AI_RULES.md              — reglas de estilo y patrones
│   ├── ARCHITECTURE.md          — estructura, rutas, data flow
│   ├── CLAUDE.md                — contexto para IA
│   ├── CONTRIBUTING.md          — guía de contribución
│   ├── DATA_STRUCTURE.md        — tipos TS y shape de datos
│   ├── PLAN.md                  — qué falta implementar
│   ├── ROADMAP.md               — fases de release
│   ├── SCRAMBLE_GENERATION.md   — sistema de generación dinámica de scrambles
│   └── structure.md             — este archivo
│
├── scripts/
│   └── validateScrambleGeneration.ts  — validación matemática de scrambles
│
├── src/
│   ├── App.tsx                 — definición de rutas
│   ├── main.tsx                — entry point
│   ├── index.css               — estilos globales + Tailwind
│   │
│   ├── assets/
│   │   ├── Rubik's_cube.svg
│   │   └── fongoImg.png
│   │
│   ├── types/
│   │   └── cubing.d.ts         — JSX type augmentation para <twisty-player>
│   │
│   ├── Layouts/
│   │   ├── MainLayout.tsx      — Navbar + Outlet + Footer + TrainerModal
│   │   └── TrainerLayout.tsx   — TrainerSidebar + Tabs + Outlet + ToolsSidebar
│   │
│   ├── pages/
│   │   ├── Home.tsx            — /
│   │   ├── algorithms/
│   │   │   └── AlgorithmCategory.tsx  — browse de algoritmos por subset
│   │   ├── dev/
│   │   │   └── GeneratePreviews.tsx   — generación de previews (dev tool)
│   │   ├── Trainer.tsx         — ⚠ archivo muerto, no tiene ruta
│   │   └── trainer/
│   │       ├── WVTrainer.tsx   — /trainer/wv
│   │       ├── MWTrainer.tsx   — /trainer/mw
│   │       ├── OLLTrainer.tsx  — /trainer/oll
│   │       ├── PLLTrainer.tsx  — /trainer/pll
│   │       └── F2LTrainer.tsx  — /trainer/f2l
│   │
│   ├── Components/
│   │   ├── GlobalComponents/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   ├── algorithms/
│   │   │   ├── AlgorithmCard.tsx     — card con mezcla + solución
│   │   │   ├── AlgorithmModal.tsx    — modal con viewer + variantes
│   │   │   └── CubeViewer.tsx        — twisty-player wrapper con controles
│   │   │
│   │   ├── cube/
│   │   │   └── CubeHero.tsx          — twisty-player interactivo en Home
│   │   │
│   │   ├── Home/
│   │   │   ├── Hero.tsx
│   │   │   ├── AlgorithmSection.tsx
│   │   │   ├── AlgorithmCard.tsx     — card de navegación a trainer
│   │   │   ├── HowItWorks.tsx
│   │   │   └── CTASection.tsx        — ⚠ sin uso
│   │   │
│   │   ├── trainer/
│   │   │   ├── TrainerSidebar.tsx     — stats placeholder
│   │   │   ├── TrainerTabs.tsx        — navegación (no funcional)
│   │   │   ├── TrainerToolsSidebar.tsx — ayuda placeholder
│   │   │   ├── CubeViewer.tsx         — ⚠ PLACEHOLDER, reemplazar con twisty-player
│   │   │   ├── ScrambleBox.tsx        — muestra scramble string
│   │   │   ├── AlgorithmBox.tsx       — muestra algoritmo string
│   │   │   └── NextCaseButton.tsx     — botón siguiente caso
│   │   │
│   │   └── Modals/
│   │       └── TrainerModal.tsx       — modal con grid de algoritmos
│   │
│   ├── hooks/
│   │   ├── useTrainer.ts             — lógica básica de trainer
│   │   └── useScrambledTrainer.ts     — ⏳ trainer con scrambles dinámicos
│   │
│   ├── utils/
│   │   ├── scrambleService.ts         — ⏳ generación dinámica de scrambles
│   │   ├── resolveVariants.ts        — resolución de variantes
│   │   └── mirrorAlgorithm.ts        — mirror para pares ergonómicos
│   │
│   └── data/
│       ├── OLLCases.ts               — 57 casos OLL
│       ├── PLLCases.ts               — 21 casos PLL
│       ├── WVCases.ts                — 27 casos Winter Variation
│       ├── MWCases.ts                — 32 casos Magic Wonderful
│       └── f2lCases.ts              — 41 casos F2L
│
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

## Flujo de Rutas

```
/                        → MainLayout → Home
/trainer/wv              → TrainerLayout → WVTrainer
/trainer/mw              → TrainerLayout → MWTrainer
/trainer/oll             → TrainerLayout → OLLTrainer
/trainer/pll             → TrainerLayout → PLLTrainer
/trainer/f2l             → TrainerLayout → F2LTrainer
/algorithms/oll          → AlgorithmCategory
/algorithms/pll          → AlgorithmCategory
/algorithms/wv           → AlgorithmCategory
/algorithms/mw           → AlgorithmCategory
/algorithms/f2l          → AlgorithmCategory
/about                   → ⚠ NO EXISTE
```

## Flujo de Datos — Scramble Generation (objetivo)

```
data/XxxCases.ts → AlgoCase[]
  └─ case.scramble o case.algorithm (para WV)

ScrambleService.generateScramble(caseData)
  ├─ solveTwips con generatorMoves ["U","D","R","L","F","B"]
  ├─ retorna string diferente cada vez
  └─ mismo patrón que el scramble original (validado ✓)

useScrambledTrainer(cases)
  ├─ currentCase, scramble, loading
  ├─ nextCase() → genera nuevo scramble asíncrono
  └─ revealAlgorithm()

Trainer Page
  ├─ ScrambleBox(scramble, loading)   — skeleton mientras carga
  ├─ CubeViewer(scramble)             — twisty-player real
  ├─ AlgorithmBox(algorithm, revealed)
  └─ NextCaseButton(onNext)
```

## Flujo de Rutas

```
/                     → MainLayout → Home
/trainer/wv           → TrainerLayout → WVTrainer    ← BUG: actualmente MWTrainer
/trainer/mw           → TrainerLayout → MWTrainer    ← BUG: actualmente OLLTrainer
/trainer/oll          → TrainerLayout → OLLTrainer
/trainer/pll          → TrainerLayout → PLLTrainer
/trainer/f2l          → ⚠ NO EXISTE aún
/algorithms           → ⚠ NO EXISTE aún
/about                → ⚠ NO EXISTE aún
```

## Flujo de Datos Actual (hardcoded)

```
TrainerPage
  └── ScrambleBox(scramble: "string literal")
  └── CubeViewer()
  └── AlgorithmBox(algorithm: "string literal")
  └── NextCaseButton(onNext: () => console.log)
```

## Flujo de Datos Objetivo

```
data/XxxCases.ts → useTrainer(cases) → currentCase
  └── ScrambleBox(scramble: currentCase.scramble)
  └── CubeViewer(scramble: currentCase.scramble)
  └── AlgorithmBox(algorithm: currentCase.algorithm, revealed: bool)
  └── NextCaseButton(onNext: nextCase)
  └── TrainerSidebar(stats: sessionStats)
```
