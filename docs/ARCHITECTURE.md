# Architecture & Project Structure

## Tech Stack
- **React 19** + TypeScript + Vite 7
- **TailwindCSS v4** (via `@tailwindcss/vite`, NOT PostCSS)
- **React Router v7**
- **FontAwesome** (react-fontawesome for icons)
- **Material Symbols** (Google icon font) en trainer (cube + algorithm reveal)
- **cubing.js** — `cubing/puzzles`, `cubing/kpuzzle`, `cubing/search`, `cubing/alg`, `cubing/twisty`
  - 3x3x3 interactive cube in Hero
  - `<twisty-player>` web component en trainer (rotación libre, move-press, hint facelets)
  - KPattern + KTransformation for cube state
  - `experimentalSolve3x3x3IgnoringCenters` (min2phase/Kociemba) for scramble generation
  - `Alg` for invert/normalize
- **No state management library** — local state + props; mini store pub/sub `trainerStatsStore` (`src/hooks/TrainerStatsStore.ts`); settings persistidos con `localStorage` versionado (`src/hooks/useTrainerSettings.ts`)

## Directory Structure

```
src/
├── App.tsx                       Main router definition
├── main.tsx                      Entry point with BrowserRouter
├── index.css                     Global styles & Tailwind imports
├── types.ts                      AlgoCase, AlgorithmCategory, SessionStats
│
├── types/
│   └── cubing.d.ts              JSX type augmentation for <twisty-player>
│
├── assets/
│   ├── Rubik's_cube.svg         [UNUSED - replaced by CubeHero]
│   └── fongoImg.png             Background pattern
│
├── Layouts/
│   ├── MainLayout.tsx           Navbar + Outlet + Footer + TrainerModal
│   └── TrainerLayout.tsx        Left sidebar + tabs + main + right sidebar
│
├── pages/
│   ├── Home.tsx                 Landing page (Hero + AlgorithmSection + HowItWorks)
│   ├── About.tsx                About page (/about)
│   ├── algorithms/
│   │   ├── AlgorithmsHome.tsx   Índice de subsets (/algorithms)
│   │   └── AlgorithmCategory.tsx Categoría por subset (/algorithms/:slug)
│   ├── dev/
│   │   └── GeneratePreviews.tsx Dev tool (/dev/generate)
│   └── trainer/
│       ├── WVTrainer.tsx        Winter Variation (/trainer/wv)
│       ├── MWTrainer.tsx        Magic Wonderful (/trainer/mw)
│       ├── OLLTrainer.tsx       OLL (/trainer/oll)
│       ├── PLLTrainer.tsx       PLL (/trainer/pll)
│       └── F2LTrainer.tsx       F2L (/trainer/f2l)
│
├── Components/
│   ├── GlobalComponents/
│   │   ├── Navbar.tsx           Sticky header with theme toggle
│   │   ├── Footer.tsx
│   │   ├── Button.tsx           Reusable button with FontAwesome
│   │   ├── ThemeToggle.tsx      Dark/light mode
│   │   └── ThemeToggleButton.tsx Botón toggle reutilizable
│   │
│   ├── cube/
│   │   └── CubeHero.tsx         Interactive 3D cube via cubing.js <twisty-player>
│   │
│   ├── Home/
│   │   ├── Hero.tsx             Hero section with CTA (uses CubeHero)
│   │   ├── AlgorithmSection.tsx Grid of algorithm sets
│   │   ├── AlgorithmCard.tsx    Card linking to trainer
│   │   └── HowItWorks.tsx        3-step process section
│   │
│   ├── trainer/
│   │   ├── TrainerPage.tsx        Dispatcher passive/virtual según modo (Outlet context)
│   │   ├── TrainerSidebar.tsx     Left sidebar: session stats reales (trainerStatsStore)
│   │   ├── TrainerTabs.tsx        Top tabs: F2L / WV / MW / OLL / PLL — Link + useLocation
│   │   ├── TrainerToolsSidebar.tsx Right sidebar: atajo a SettingsModal
│   │   ├── TrainerModeToggle.tsx  Switch reconocimiento / resolución (persistido)
│   │   ├── PassiveTrainerView.tsx Modo reconocimiento (scramble + cubo + reveal + next)
│   │   ├── VirtualTrainerView.tsx  Modo resolución (cubo virtual + execute + feedback)
│   │   ├── CubeViewer.tsx          <twisty-player>: guía 3D, hint facelets, move-press
│   │   ├── ScrambleBox.tsx         Muestra scramble (con skeleton `loading`)
│   │   ├── AlgorithmBox.tsx        Reveal del algoritmo (botón / display)
│   │   ├── AlgorithmReveal.tsx     Wrapper de AlgorithmBox con `forceReveal` (Modo aprender)
│   │   ├── NextCaseButton.tsx      "Siguiente caso" + hint Space (PrimaryButton + SpaceHint)
│   │   ├── FeedbackPanel.tsx       Feedback de resolución (verdict, movimientos, Repetir/Siguiente)
│   │   ├── PrimaryButton.tsx       CTA estándar (h-14, soporta kbd shortcut)
│   │   ├── SecondaryButton.tsx     Acción secundaria (Deshacer/Limpiar/Repetir)
│   │   ├── SpaceHint.tsx           Hint "Space ..." con kbd consistente
│   │   ├── ToggleSwitch.tsx        Switch cápsula para ajustes
│   │   ├── SettingsModal.tsx       Modal de ajustes (Cronómetro / Reconocimiento / Resolución)
│   │   └── difficulty.ts           difficulty → color (Easy/Medium/Hard) compartido
│   │
│   ├── algorithms/
│   │   ├── AlgorithmCard.tsx     Algorithm browse card (shows mezcla + solución)
│   │   ├── AlgorithmCategoryCard.tsx  Card de categoría en /algorithms
│   │   ├── AlgorithmFilter.tsx   Filtros de búsqueda (dificultad, shape, etc.)
│   │   ├── AlgorithmModal.tsx    Detail modal with cube viewer + variants
│   │   ├── CubeViewer.tsx        cubing.js twisty-player wrapper with controls
│   │   └── CubeAlgorithmViewer.tsx Viewer de algoritmo con controles
│   │
│   └── Modals/
│       └── TrainerModal.tsx     Modal showing algorithm selection grid
│
├── utils/
│   ├── scrambleService.ts      Dynamic scramble generation (Kociemba composition)
│   ├── resolveVariants.ts      Algorithm variant resolution
│   ├── mirrorAlgorithm.ts      Mirror transformation for ergonomic pairs
│   └── verifySolve.ts          State-comparison solve verification (AUF-tolerant)
│
├── hooks/
│   ├── useTrainer.ts             Trainer logic (scrambles fijos) — usado por OLL/PLL/MW/F2L
│   ├── useScrambledTrainer.ts    Trainer con scrambles dinámicos (Kociemba) — passive mode
│   ├── useExecutionTrainer.ts    Hook del modo virtual (recognize/execute/feedback) — WV
│   ├── useTrainerSettings.ts     Settings tipados + localStorage versionado
│   ├── TrainerStatsStore.ts      Mini store pub/sub (stats compartidas sidebar ↔ hooks)
│   └── TrainerContext.tsx        [LEGACY] código muerto — reemplazado por Outlet context
│
└── data/
    ├── algorithmCatalog.ts     Metadatos de categorías (slug, iconos, filtros)
    ├── WVCases.ts              Winter Variation cases (27) [POPULATED]
    ├── MWCases.ts              Magic Wonderful cases (41) [POPULATED]
    ├── f2lCases.ts             F2L cases (42) [POPULATED]
    ├── OLLCases.ts             OLL 57 cases [POPULATED]
    └── PLLCases.ts             PLL 21 cases [POPULATED]

scripts/
├── validateCleanScrambles.ts               OLL 33: 500 scrambles, orientation + clean
├── validateScrambleDiversity.ts             OLL 33 uniqueness + D-equivalence
└── validateScrambleGeneration.ts            General: 5 subsets, 20 iteraciones c/u
```

## Current Route Map

All imports in `src/App.tsx` have been corrected to use lowercase `./pages/...` which allows the application to compile successfully on case-sensitive systems (such as Linux).

| Route | Component | Status | Details |
|-------|-----------|--------|---------|
| `/` | `src/pages/Home.tsx` | ✓ Working | Landing page |
| `/algorithms` | `src/pages/algorithms/AlgorithmsHome.tsx` | ✓ Working | Índice de subsets |
| `/about` | `src/pages/About.tsx` | ✓ Working | About page |
| `/dev/generate` | `src/pages/dev/GeneratePreviews.tsx` | ✓ Working | Dev tool: generar previews |
| `/trainer/wv` | `src/pages/trainer/WVTrainer.tsx` | ✓ Fixed | WV trainer |
| `/trainer/mw` | `src/pages/trainer/MWTrainer.tsx` | ✓ Fixed | MW trainer |
| `/trainer/oll` | `src/pages/trainer/OLLTrainer.tsx` | ✓ Working | OLL trainer |
| `/trainer/pll` | `src/pages/trainer/PLLTrainer.tsx` | ✓ Working | PLL trainer |
| `/trainer/f2l` | `src/pages/trainer/F2LTrainer.tsx` | ✓ Fixed | F2L trainer |
| `/algorithms/oll` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | OLL algorithm browser (vía `/algorithms/:slug`), PLL variation en 57/57 OLLs |
| `/trainer/wv` | `src/pages/trainer/WVTrainer.tsx` | ✓ Working | WV trainer con `useScrambledTrainer` (PLL variation en 27/27) |
| `/algorithms/pll` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | PLL algorithm browser |
| `/algorithms/wv` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | WV algorithm browser |
| `/algorithms/mw` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | MW algorithm browser |
| `/algorithms/f2l` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | F2L algorithm browser |

## Data Flow

### WV Trainer Base (Phase 4 — implementado)

```
TrainerLayout
  ├─ mode (localStorage["algotrainer:trainerMode"])        [passive | virtual]
  ├─ settings (localStorage["algotrainer:trainerSettings"]) [versioned]
  └─ Outlet context → { mode, settings, onSettingsChange }

TrainerPage (TrainerPage.tsx)
  └─ mode === "passive"
       └─ PassiveTrainerView(cases, settings)
            ├─ useScrambledTrainer(cases) → currentCase, loading, scramble
            ├─ ScrambleBox(scramble, loading)
            ├─ CubeViewer(scramble, guide, hintFacelets)
            ├─ NextCaseButton(onNext) → PrimaryButton + SpaceHint
            └─ AlgorithmReveal(algorithm, revealed, onReveal)
  └─ mode === "virtual"
       └─ VirtualTrainerView(cases, settings)
            ├─ useExecutionTrainer(cases) → phases recognize/execute/feedback
            ├─ ScrambleBox
            ├─ CubeViewer(scramble, interactive, guide, hintFacelets, ref)
            ├─ Phase recognize: name/diff + "Lo sé — Ejecutar" + SpaceHint
            ├─ Phase execute:   ControlsCard + userMoves + Deshacer/Limpiar + Comprobar
            ├─ Phase feedback:  FeedbackPanel (Repetir / Siguiente caso)
            └─ AlgorithmReveal(solution, revealed, onReveal)
```

### CubeViewer (trainer)
```
<twisty-player>
  experimental-drag-input="auto"     // orbit + move-press simultáneos
  experimental-setup-anchor="start"
  experimental-hint-facelets={hintFacelets}   // atributo (no reactivo tras mount)
  ref={playerRef}
  imperative: el.hintFacelets = "floating"     // via useEffect (reactividad)

FaceLabel overlay (solo si guide=true)
  ├─ INITIAL_FACE_POSITIONS = computeFacePositions(DEFAULT_ORBIT)   // sync on mount
  └─ addFreshListener(orbitCoordinates, ...) → setFacePositions     // rotación
```

### Mode toggle + Settings
```
TrainerSidebar → onOpenSettings → SettingsModal
TrainerLayout SPACE handler
  ├─ [data-exec-trainer] presente? → no-op (useExecutionTrainer maneja)
  └─ si no: revelado? → [data-reveal-algo].click() : [data-next-case].click()

localStorage["algotrainer:trainerSettings"]
  └─ { version: SETTINGS_VERSION, resolution: {...}, recognition: {...} }
     └─ load: si version mismatch → DEFAULT_TRAINER_SETTINGS (reset)
```

### Scramble generation (existente)
```
ScrambleService (singleton)
  └─ generateScramble(caseData) → string
    └─ Kociemba composition:
      └─ target = solved.applyAlg(getEffectiveSetup(c))
      └─ pert = randomMoves(3-5)
      └─ solveMin2Phase(target.applyAlg(pert)) → invert → solvedToPerturbed
      └─ scramble = simplifyMoves([solvedToPerturbed, invert(pert)].join(" "))

useScrambledTrainer(cases: AlgoCase[])
  ├─ currentCase: AlgoCase
  ├─ scramble: string                    [generated fresh each time]
  ├─ loading: boolean                    [while scramble generates]
  ├─ revealed: boolean
  ├─ nextCase(): void
  ├─ revealAlgorithm(): void
  └─ stats: SessionStats

useExecutionTrainer(cases: AlgoCase[])
  ├─ currentCase, scramble, solution, loading
  ├─ phase: "recognize" | "execute" | "feedback"
  ├─ userMoves, cubeRef, undoMove, clearMoves, syncMoves
  ├─ startExecution, check (verifySolve → verdict), verdict, executionTime, recognitionTime
  ├─ repeatCase, nextCase
  └─ revealed, reveal
```

## Component Hierarchy

```
App
├─ MainLayout
│  ├─ Navbar
│  ├─ Home
│  │  ├─ Hero
│  │  │  └─ CubeHero (cubing.js <twisty-player>)
│  │  ├─ AlgorithmSection
│  │  │  └─ AlgorithmCard[] (6 cards)
│  │  └─ HowItWorks
│  ├─ Footer
│  └─ TrainerModal
│     └─ AlgorithmSection
│
└─ TrainerLayout
   ├─ TrainerSidebar (stats reales + botón Settings → SettingsModal)
   ├─ TrainerTabs
   ├─ TrainerModeToggle  (selector modo reconocimiento / resolución)
   └─ Outlet
      └─ WVTrainer → TrainerPage
         ├─ PassiveTrainerView
         │  ├─ ScrambleBox
         │  ├─ CubeViewer (twisty-player, hint facelets)
         │  ├─ NextCaseButton (PrimaryButton + SpaceHint)
         │  └─ AlgorithmReveal (AlgorithmBox)
         └─ VirtualTrainerView
            ├─ ScrambleBox
            ├─ CubeViewer (twisty-player, interactive)
            ├─ Contenido por fase
            │  ├─ recognize: PrimaryButton + SpaceHint
            │  ├─ execute:   ControlsCard + SecondaryButtons + PrimaryButton
            │  └─ feedback:  FeedbackPanel (SecondaryButton + PrimaryButton)
            └─ AlgorithmReveal
```

## Styling
- **Tailwind v4**: configure in `vite.config.ts` via `@tailwindcss/vite` plugin
- **No CSS files**: all styles via utility classes
- **Theme colors**: `blue-500` primary, slate/gray for text, dark mode support
- **Spacing**: gap-8, p-6 standard padding
- **Responsive**: `sm:`, `md:`, `lg:` prefixes for breakpoints

## Design Patterns
- **Props-based state**: pass data down, callbacks up
- **Layout components**: MainLayout & TrainerLayout handle chrome
- **Page components**: focused on content, minimal logic
- **Global components**: reused across layouts (Button, Navbar, Footer)
- **Trainer components**: modular pieces (ScrambleBox, CubeViewer, etc.)
