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
│   ├── types.ts               — AlgoCase, AlgorithmCategory, SessionStats
│   ├── types/
│   │   └── cubing.d.ts         — JSX type augmentation para <twisty-player>
│   │
│   ├── Layouts/
│   │   ├── MainLayout.tsx      — Navbar + Outlet + Footer + TrainerModal
│   │   └── TrainerLayout.tsx   — TrainerSidebar + Tabs + Outlet + ToolsSidebar
│   │
│   ├── pages/
│   │   ├── Home.tsx            — /
│   │   ├── About.tsx           — /about
│   │   ├── algorithms/
│   │   │   ├── AlgorithmsHome.tsx     — índice de subsets (/algorithms)
│   │   │   └── AlgorithmCategory.tsx  — browse de algoritmos por subset (/algorithms/:slug)
│   │   ├── dev/
│   │   │   └── GeneratePreviews.tsx   — generación de previews (dev tool, /dev/generate)
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
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ThemeToggleButton.tsx
│   │   │
│   │   ├── algorithms/
│   │   │   ├── AlgorithmCard.tsx     — card con mezcla + solución
│   │   │   ├── AlgorithmCategoryCard.tsx — card de categoría en /algorithms
│   │   │   ├── AlgorithmFilter.tsx   — filtros (dificultad, shape, etc.)
│   │   │   ├── AlgorithmModal.tsx    — modal con viewer + variantes
│   │   │   ├── CubeViewer.tsx        — twisty-player wrapper con controles
│   │   │   └── CubeAlgorithmViewer.tsx — viewer de algoritmo con controles
│   │   │
│   │   ├── cube/
│   │   │   └── CubeHero.tsx          — twisty-player interactivo en Home
│   │   │
│   │   ├── Home/
│   │   │   ├── Hero.tsx
│   │   │   ├── AlgorithmSection.tsx
│   │   │   ├── AlgorithmCard.tsx     — card de navegación a trainer
│   │   │   └── HowItWorks.tsx        — (CTASection eliminado del repo)
│   │   │
│   │   ├── trainer/
│   │   │   ├── TrainerSidebar.tsx     — stats reales vía trainerStatsStore
│   │   │   ├── TrainerTabs.tsx        — navegación con Link + useLocation (funcional)
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
│   │   ├── useTrainer.ts             — lógica de trainer (scrambles fijos) — usado por los 5 trainers
│   │   ├── useScrambledTrainer.ts     — ✓ implementado: trainer con scrambles dinámicos (sin integrar)
│   │   ├── TrainerContext.tsx         — context para stats del trainer
│   │   └── TrainerStatsStore.ts       — mini store pub/sub (stats compartidas)
│   │
│   ├── utils/
│   │   ├── scrambleService.ts         — ✓ generación dinámica de scrambles (Kociemba)
│   │   ├── resolveVariants.ts        — resolución de variantes
│   │   └── mirrorAlgorithm.ts        — mirror para pares ergonómicos
│   │
│   └── data/
│       ├── algorithmCatalog.ts        — metadatos de categorías (slug, iconos, filtros)
│       ├── OLLCases.ts               — 57 casos OLL
│       ├── PLLCases.ts               — 21 casos PLL
│       ├── WVCases.ts                — 27 casos Winter Variation
│       ├── MWCases.ts                — 41 casos Magic Wonderful
│       └── f2lCases.ts              — 42 casos F2L
│
├── scripts/
│   ├── validateCleanScrambles.ts     — OLL 33: 500 scrambles (564/564 clean)
│   ├── validateScrambleDiversity.ts  — OLL 33 uniqueness + D-equivalence
│   └── validateScrambleGeneration.ts — general: 5 subsets, 20 iteraciones
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
/algorithms              → MainLayout → AlgorithmsHome
/algorithms/:slug        → MainLayout → AlgorithmCategory
/about                   → MainLayout → About
/dev/generate            → GeneratePreviews (dev tool)
/trainer/wv              → TrainerLayout → WVTrainer
/trainer/mw              → TrainerLayout → MWTrainer
/trainer/oll             → TrainerLayout → OLLTrainer
/trainer/pll             → TrainerLayout → PLLTrainer
/trainer/f2l             → TrainerLayout → F2LTrainer
```

## Flujo de Datos — Scramble Generation (implementado)

```
data/XxxCases.ts → AlgoCase[]
  └─ case.scramble o case.algorithm (para WV)

ScrambleService.generateScramble(caseData)   ✓ Kociemba composition
  ├─ experimentalSolve3x3x3IgnoringCenters (min2phase) + simplifyMoves
  ├─ retorna string diferente cada vez
  └─ mismo patrón que el scramble original (validado ✓)

useScrambledTrainer(cases)   ✓ implementado, sin integrar en trainers
  ├─ currentCase, scramble, loading
  ├─ nextCase() → genera nuevo scramble asíncrono
  └─ revealAlgorithm()

Trainer Page (hoy usa useTrainer con scrambles fijos)
  ├─ ScrambleBox(scramble, loading)   — skeleton mientras carga
  ├─ CubeViewer(scramble)             — twisty-player real (⚠ pendiente)
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
