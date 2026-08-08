# Architecture & Project Structure

## Tech Stack
- **React 19** + TypeScript + Vite 7
- **TailwindCSS v4** (via `@tailwindcss/vite`, NOT PostCSS)
- **React Router v7**
- **FontAwesome** (react-fontawesome for icons)
- **cubing.js** — `cubing/puzzles`, `cubing/kpuzzle`, `cubing/search`, `cubing/alg`
  - 3x3x3 interactive cube in Hero
  - KPattern + KTransformation for cube state
  - `experimentalSolve3x3x3IgnoringCenters` (min2phase/Kociemba) for scramble generation
  - `Alg` for invert/normalize
- **No state management library** — local state + props; mini store pub/sub `trainerStatsStore` (`src/hooks/TrainerStatsStore.ts`) + `TrainerContext` para stats del trainer

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
│   │   └── HowItWorks.tsx       3-step process section
│   │
│   ├── trainer/
│   │   ├── TrainerSidebar.tsx   Left sidebar: session stats [PLACEHOLDER]
│   │   ├── TrainerTabs.tsx      Top tabs: F2L / WV / MW / OLL / PLL [NON-FUNCTIONAL]
│   │   ├── TrainerToolsSidebar.tsx Right sidebar: help & shortcuts [PLACEHOLDER]
│   │   ├── CubeViewer.tsx       [PLACEHOLDER - will show twisty-player with scramble]
│   │   ├── ScrambleBox.tsx      Displays scramble string (accepts loading prop)
│   │   ├── AlgorithmBox.tsx     Displays algorithm string
│   │   └── NextCaseButton.tsx   Next case button
│   │
│   ├── algorithms/
│   │   ├── AlgorithmCard.tsx    Algorithm browse card (shows mezcla + solución)
│   │   ├── AlgorithmCategoryCard.tsx  Card de categoría en /algorithms
│   │   ├── AlgorithmFilter.tsx  Filtros de búsqueda (dificultad, shape, etc.)
│   │   ├── AlgorithmModal.tsx   Detail modal with cube viewer + variants
│   │   ├── CubeViewer.tsx       cubing.js twisty-player wrapper with controls
│   │   └── CubeAlgorithmViewer.tsx Viewer de algoritmo con controles
│   │
│   └── Modals/
│       └── TrainerModal.tsx     Modal showing algorithm selection grid
│
├── utils/
│   ├── scrambleService.ts      Dynamic scramble generation (Kociemba composition)
│   ├── resolveVariants.ts      Algorithm variant resolution
│   └── mirrorAlgorithm.ts      Mirror transformation for ergonomic pairs
│
├── hooks/
│   ├── useTrainer.ts           Trainer logic (fixed scrambles) — usado por los 5 trainers
│   ├── useScrambledTrainer.ts  Trainer with dynamic scrambles (implementado, sin integrar)
│   ├── TrainerContext.tsx      Context para stats del trainer
│   └── TrainerStatsStore.ts    Mini store pub/sub (stats compartidas sidebar ↔ hooks)
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
| `/algorithms/pll` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | PLL algorithm browser |
| `/algorithms/wv` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | WV algorithm browser |
| `/algorithms/mw` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | MW algorithm browser |
| `/algorithms/f2l` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | F2L algorithm browser |

## Data Flow

### Phase 1 (Hardcoded scrambles)
```
Trainer Page
  ├─ ScrambleBox(scramble: "R U R' U'")  [static string]
  ├─ CubeViewer()                         [placeholder div]
  ├─ AlgorithmBox(algorithm: "...")       [static string]
  └─ NextCaseButton(onNext: () => {})     [logs to console]
```

### Phase 2 (Dynamic with single scramble)
```
useTrainer(cases: AlgoCase[])
  ├─ currentCase: AlgoCase
  ├─ nextCase(): void
  └─ sessionStats: SessionStats

Trainer Page
  ├─ ScrambleBox(scramble: currentCase.scramble)
  ├─ CubeViewer(scramble: currentCase.scramble)
  ├─ AlgorithmBox(algorithm: currentCase.algorithm, revealed: bool)
  ├─ NextCaseButton(onNext: nextCase)
  └─ TrainerSidebar(stats: sessionStats)
```

### Phase 3 (Dynamic scramble generation — implemented)
```
ScrambleService (singleton)
  └─ generateScramble(caseData) → string
    └─ Kociemba composition:
      └─ target = solved.applyAlg(getEffectiveSetup(c))
      └─ pert = randomMoves(3-5)
      └─ solveMin2Phase(target.applyAlg(pert)) → invert → solvedToPerturbed
      └─ scramble = simplifyMoves([solvedToPerturbed, invert(pert)].join(" "))

AlgorithmCategory (for all 57 OLLs)
  ├─ dynamicScramble: string | undefined
  ├─ handleNewScramble: () => void       [activado si id.startsWith("oll-")]
  └─ AlgorithmModal(dynamicScramble, onNewScramble)
    ├─ CubeViewer(setupAlg)               [twisty-player with scramble]
    └─ Button "Nuevo Scramble"            [visible en todos los OLLs]

useScrambledTrainer(cases: AlgoCase[])
  ├─ currentCase: AlgoCase
  ├─ scramble: string                    [generated fresh each time]
  ├─ loading: boolean                    [while scramble generates]
  ├─ revealed: boolean
  ├─ nextCase(): void
  ├─ revealAlgorithm(): void
  └─ stats: SessionStats
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
   ├─ TrainerSidebar
   ├─ TrainerTabs
   ├─ XxxTrainer (WV/MW/OLL/PLL/F2L)
   │  ├─ ScrambleBox
   │  ├─ CubeViewer
   │  ├─ AlgorithmBox
   │  └─ NextCaseButton
   └─ TrainerToolsSidebar
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
