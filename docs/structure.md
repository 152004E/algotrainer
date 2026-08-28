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
│   │   │   ├── CubeViewer.tsx        — twisty-player wrapper con controles (browser)
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
│   │   │   ├── TrainerPage.tsx        — dispatcher passive/virtual (Outlet context)
│   │   │   ├── TrainerSidebar.tsx     — stats reales + botón Settings
│   │   │   ├── TrainerTabs.tsx        — Link + useLocation (funcional)
│   │   │   ├── TrainerToolsSidebar.tsx — abre SettingsModal
│   │   │   ├── TrainerModeToggle.tsx  — switch pasivo / virtual (persistido)
│   │   │   ├── PassiveTrainerView.tsx — modo reconocimiento (useScrambledTrainer)
│   │   │   ├── VirtualTrainerView.tsx  — modo resolución (useExecutionTrainer)
│   │   │   ├── CubeViewer.tsx         — ✓ <twisty-player>: drag, hint facelets, guía 3D
│   │   │   ├── ScrambleBox.tsx        — scramble + skeleton `loading`
│   │   │   ├── AlgorithmBox.tsx       — reveal del algoritmo
│   │   │   ├── AlgorithmReveal.tsx    — wrapper con `forceReveal` (Modo aprender)
│   │   │   ├── NextCaseButton.tsx     — PrimaryButton + SpaceHint
│   │   │   ├── FeedbackPanel.tsx      — verdict, movimientos, Repetir / Siguiente
│   │   │   ├── PrimaryButton.tsx      — CTA estándar (h-14, soporta kbd shortcut)
│   │   │   ├── SecondaryButton.tsx    — acción secundaria
│   │   │   ├── SpaceHint.tsx          — hint "Space ..." con kbd consistente
│   │   │   ├── ToggleSwitch.tsx       — switch cápsula para ajustes
│   │   │   ├── SettingsModal.tsx      — ajustes Cronómetro / Reconocimiento / Resolución
│   │   │   └── difficulty.ts          — difficulty → color (Easy/Medium/Hard)
│   │   │
│   │   └── Modals/
│   │       └── TrainerModal.tsx       — modal con grid de algoritmos
│   │
│   ├── hooks/
│   │   ├── useTrainer.ts             — lógica de trainer (scrambles fijos) — OLL/PLL/MW/F2L
│   │   ├── useScrambledTrainer.ts    — ✓ trainer con scrambles dinámicos (modo pasivo)
│   │   ├── useExecutionTrainer.ts    — ✓ modo virtual (recognize/execute/feedback)
│   │   ├── useTrainerSettings.ts     — ✓ settings tipados + localStorage versionado
│   │   ├── TrainerStatsStore.ts      — mini store pub/sub (stats compartidas)
│   │   └── TrainerContext.tsx        — [LEGACY] código muerto
│   │
│   ├── utils/
│   │   ├── scrambleService.ts         — ✓ generación dinámica de scrambles (Kociemba)
│   │   ├── resolveVariants.ts        — resolución de variantes
│   │   ├── mirrorAlgorithm.ts        — mirror para pares ergonómicos
│   │   └── verifySolve.ts            — ✓ verificación de resolución por estado (AUF-tolerant)
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

## Flujo de Datos — WV Trainer Base (implementado)

```
data/WVCases.ts → AlgoCase[] (27 casos diestros)

TrainerLayout
  ├─ mode (localStorage["algotrainer:trainerMode"])
  ├─ settings (localStorage["algotrainer:trainerSettings"] versionado)
  └─ Outlet context → { mode, settings, onSettingsChange }

WVTrainer → TrainerPage
  ├─ mode === "passive"
  │   └─ PassiveTrainerView(cases, settings)
  │        ├─ useScrambledTrainer → { currentCase, scramble, loading, nextCase, revealed, revealAlgorithm }
  │        ├─ ScrambleBox(scramble, loading)
  │        ├─ CubeViewer(scramble, hintFacelets={settings.recognition.hiddenFaces ? "floating" : "none"})
  │        ├─ NextCaseButton(onNext)         — PrimaryButton + SpaceHint
  │        └─ AlgorithmReveal(algorithm, revealed, onReveal)
  └─ mode === "virtual"
      └─ VirtualTrainerView(cases, settings)
           ├─ useExecutionTrainer → { phase, currentCase, scramble, solution, userMoves,
           │                          cubeRef, undoMove, clearMoves, syncMoves,
           │                          startExecution, check, verdict, recognitionTime,
           │                          executionTime, repeatCase, nextCase, revealed, reveal }
           ├─ ScrambleBox
           ├─ CubeViewer(ref, scramble, interactive={phase === "execute"},
           │              guide={settings.resolution.guide},
           │              hintFacelets={settings.recognition.hiddenFaces ? "floating" : "none"})
           ├─ Phase recognize: name/diff + "Lo sé — Ejecutar" (PrimaryButton) + SpaceHint
           ├─ Phase execute:   ControlsCard + userMoves + Deshacer/Limpiar (Secondary) + Comprobar (Primary + shortcut="Space")
           ├─ Phase feedback:  FeedbackPanel(verdict, userMoves, times) — SecondaryButton Repetir + PrimaryButton Siguiente caso
           └─ AlgorithmReveal(solution, revealed, onReveal)   [forceReveal={settings.resolution.learnMode}]
```

### Verificación de resolución (modo virtual)

```
useExecutionTrainer.check()
  └─ verifySolve(initialState, userMoves, solution) → { solved, exact }
       └─ AUF-tolerant (ignora U/U'/U2 al final del userMoves)
       └─ comparado contra estado resuelto vía KPattern

scripts/verifyInteractiveSolve.ts  (pnpm run verify-interactive-solve) → 135/135 checks
```

### Settings (persistido)

```
localStorage["algotrainer:trainerSettings"]  → JSON.stringify({ version, resolution, recognition })
  ├─ resolution: { guide, controls, learnMode }      (Modo resolución en SettingsModal)
  └─ recognition: { hiddenFaces, hideFaces }        (Modo reconocimiento; "Ocultar cubo")
SETTINGS_VERSION: si versión guardada ≠ actual → DEFAULT_TRAINER_SETTINGS
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

## Flujo de Datos (WV — migración pendiente para MW/OLL/PLL/F2L)

```
Trainer Page (legacy: useTrainer + componentes sueltos)
  ├── ScrambleBox(scramble: currentCase.scramble)
  ├── CubeViewer(scramble)         ← reusar el nuevo Components/trainer/CubeViewer.tsx
  ├── AlgorithmBox(algorithm, revealed)
  └── NextCaseButton(onNext)
```

Migración a la base nueva: reemplazar el cuerpo del trainer legacy por

```tsx
export default function XxxTrainer() {
  return <TrainerPage cases={XxxCases} />;
}
```
