# Architecture & Project Structure

## Tech Stack
- **React 19** + TypeScript + Vite 7
- **TailwindCSS v4** (via `@tailwindcss/vite`, NOT PostCSS)
- **React Router v7**
- **FontAwesome** (react-fontawesome for icons)
- **No state management** — local state + props only

## Directory Structure

```
src/
├── App.tsx                       Main router definition
├── main.tsx                      Entry point with BrowserRouter
├── index.css                     Global styles & Tailwind imports
│
├── assets/
│   ├── Rubik's_cube.svg         Hero image
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
│   ├── Home/
│   │   ├── Hero.tsx             Hero section with CTA
│   │   ├── AlgorithmSection.tsx Grid of algorithm sets
│   │   ├── AlgorithmCard.tsx    Card linking to trainer
│   │   ├── HowItWorks.tsx       3-step process section
│   │   └── CTASection.tsx       [UNUSED]
│   │
│   ├── trainer/
│   │   ├── TrainerSidebar.tsx   Left sidebar: session stats [PLACEHOLDER]
│   │   ├── TrainerTabs.tsx      Top tabs: F2L / WV / MW / OLL / PLL [NON-FUNCTIONAL]
│   │   ├── TrainerToolsSidebar.tsx Right sidebar: help & shortcuts [PLACEHOLDER]
│   │   ├── CubeViewer.tsx       [PLACEHOLDER - no 3D cube yet]
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

| Route | Component | Status |
|-------|-----------|--------|
| `/` | MainLayout → Home | ✓ Working |
| `/trainer/wv` | TrainerLayout → MWTrainer | ⚠️ BUG: should be WVTrainer |
| `/trainer/mw` | TrainerLayout → OLLTrainer | ⚠️ BUG: should be MWTrainer |
| `/trainer/oll` | TrainerLayout → OLLTrainer | ✓ Correct |
| `/trainer/pll` | TrainerLayout → PLLTrainer | ✓ Correct |
| `/trainer/f2l` | Not defined | ❌ Missing |
| `/algorithms` | Not defined | ❌ Missing |
| `/about` | Not defined | ❌ Missing |

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
