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
- **No state management** — local state + props only

## Directory Structure

```
src/
├── App.tsx                       Main router definition
├── main.tsx                      Entry point with BrowserRouter
├── index.css                     Global styles & Tailwind imports
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
│   ├── Trainer.tsx              [DEAD FILE - not in router]
│   └── trainer/
│       ├── WVTrainer.tsx        Winter Variation (/trainer/wv)
│       ├── MWTrainer.tsx        Magic Wonderful (/trainer/mw)
│       ├── OLLTrainer.tsx       OLL (/trainer/oll)
│       ├── PLLTrainer.tsx       PLL (/trainer/pll)
│       └── F2LTrainer.tsx       F2L [NO ROUTE YET]
│
├── Components/
│   ├── GlobalComponents/
│   │   ├── Navbar.tsx           Sticky header with theme toggle
│   │   ├── Footer.tsx
│   │   ├── Button.tsx           Reusable button with FontAwesome
│   │   └── ThemeToggle.tsx      Dark/light mode
│   │
│   ├── cube/
│   │   └── CubeHero.tsx         Interactive 3D cube via cubing.js <twisty-player>
│   │
│   ├── Home/
│   │   ├── Hero.tsx             Hero section with CTA (uses CubeHero)
│   │   ├── AlgorithmSection.tsx Grid of algorithm sets
│   │   ├── AlgorithmCard.tsx    Card linking to trainer
│   │   ├── HowItWorks.tsx       3-step process section
│   │   └── CTASection.tsx       [UNUSED]
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
│   │   ├── AlgorithmModal.tsx   Detail modal with cube viewer + variants
│   │   └── CubeViewer.tsx       cubing.js twisty-player wrapper with controls
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
│   ├── useTrainer.ts           Basic trainer logic (fixed scrambles)
│   └── useScrambledTrainer.ts  [PLANNED] Trainer with dynamic scrambles
│
└── data/
    ├── WVCases.ts              Winter Variation cases [POPULATED]
    ├── MWCases.ts              Magic Wonderful cases [POPULATED]
    ├── f2lCases.ts             F2L cases [POPULATED]
    ├── OLLCases.ts             OLL 57 cases [POPULATED]
    └── PLLCases.ts             PLL 21 cases [POPULATED]

scripts/
├── validateCleanScrambles.ts       564/564 pattern + clean (todos subsets)
└── validateScrambleDiversity.ts    OLL 33 uniqueness + D-equivalence
```

## Current Route Map

All imports in `src/App.tsx` have been corrected to use lowercase `./pages/...` which allows the application to compile successfully on case-sensitive systems (such as Linux).

| Route | Component | Status | Details |
|-------|-----------|--------|---------|
| `/` | `src/pages/Home.tsx` | ✓ Working | Landing page |
| `/trainer/wv` | `src/pages/trainer/WVTrainer.tsx` | ✓ Fixed | WV trainer |
| `/trainer/mw` | `src/pages/trainer/MWTrainer.tsx` | ✓ Fixed | MW trainer |
| `/trainer/oll` | `src/pages/trainer/OLLTrainer.tsx` | ✓ Working | OLL trainer |
| `/trainer/pll` | `src/pages/trainer/PLLTrainer.tsx` | ✓ Working | PLL trainer |
| `/trainer/f2l` | `src/pages/trainer/F2LTrainer.tsx` | ✓ Fixed | F2L trainer |
| `/algorithms/oll` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | OLL algorithm browser |
| `/algorithms/pll` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | PLL algorithm browser |
| `/algorithms/wv` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | WV algorithm browser |
| `/algorithms/mw` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | MW algorithm browser |
| `/algorithms/f2l` | `src/pages/algorithms/AlgorithmCategory.tsx` | ✓ Working | F2L algorithm browser |
| `/about` | Not defined | ❌ Missing | Linked in Navbar but no route/page |

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

AlgorithmCategory (for OLL 33 currently)
  ├─ dynamicScramble: string | undefined
  ├─ handleNewScramble: () => void
  └─ AlgorithmModal(dynamicScramble, onNewScramble)
    ├─ CubeViewer(setupAlg)               [twisty-player with scramble]
    └─ Button "Nuevo Scramble"

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
