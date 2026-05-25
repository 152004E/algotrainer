# Architecture & Project Structure

## Tech Stack
- **React 19** + TypeScript + Vite 7
- **TailwindCSS v4** (via `@tailwindcss/vite`, NOT PostCSS)
- **React Router v7**
- **FontAwesome** (react-fontawesome for icons)
- **cubing.js** (3x3x3 interactive cube in Hero)
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
│   │   ├── CubeViewer.tsx       [PLACEHOLDER - see CubeHero for cubing.js integration]
│   │   ├── ScrambleBox.tsx      Displays scramble string
│   │   ├── AlgorithmBox.tsx     Displays algorithm string
│   │   └── NextCaseButton.tsx   Next case button
│   │
│   └── Modals/
│       └── TrainerModal.tsx     Modal showing algorithm selection grid
│
└── data/
    ├── WVCases.ts              Winter Variation cases [EMPTY]
    ├── MWCases.ts              Magic Wonderful cases [EMPTY]
    └── f2lCases.ts             F2L cases [EMPTY]
    (OLLCases.ts & PLLCases.ts missing)
```

## Current Route Map

All imports in `src/App.tsx` have been corrected to use lowercase `./pages/...` which allows the application to compile successfully on case-sensitive systems (such as Linux).

| Route | Component File (Target) | Status | Details |
|-------|--------------------------|--------|---------|
| `/` | `src/pages/Home.tsx` | ✓ Working | Page renders correctly and build passes. |
| `/trainer/wv` | `src/pages/trainer/WVTrainer.tsx` | ⚠️ BUG | Incorrectly imports from `MWTrainer.tsx` (which exports the `WVTrainer` component). |
| `/trainer/mw` | `src/pages/trainer/MWTrainer.tsx` | ⚠️ BUG | Incorrectly maps to the `OLLTrainer` component. |
| `/trainer/oll` | `src/pages/trainer/OLLTrainer.tsx` | ✓ Working | Renders the OLL trainer view correctly. |
| `/trainer/pll` | `src/pages/trainer/PLLTrainer.tsx` | ✓ Working | Renders the PLL trainer view correctly. |
| `/trainer/f2l` | `src/pages/trainer/F2LTrainer.tsx` | ❌ Missing | No route defined in `App.tsx` and the component file is currently empty. |
| `/algorithms` | Not defined | ❌ Missing | Linked in `Navbar.tsx` but no route or page component exists. |
| `/about` | Not defined | ❌ Missing | Linked in `Navbar.tsx` but no route or page component exists. |

## Data Flow

### Current (Hardcoded)
```
Trainer Page
  ├─ ScrambleBox(scramble: "R U R' U'")  [static string]
  ├─ CubeViewer()                         [placeholder div]
  ├─ AlgorithmBox(algorithm: "...")       [static string]
  └─ NextCaseButton(onNext: () => {})     [logs to console]
```

### Target (Dynamic)
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
