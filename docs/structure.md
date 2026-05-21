# Estructura del Proyecto

## Árbol de Archivos

```
algotrainer/
├── docs/
│   ├── CLAUDE.md          — reglas y contexto para IA
│   ├── PLAN.md            — qué falta implementar
│   └── structure.md       — este archivo
│
├── src/
│   ├── App.tsx            — definición de rutas
│   ├── main.tsx           — entry point
│   ├── index.css          — estilos globales + Tailwind
│   │
│   ├── assets/
│   │   ├── Rubik's_cube.svg
│   │   └── fongoImg.png
│   │
│   ├── Layouts/
│   │   ├── MainLayout.tsx    — Navbar + Outlet + Footer + TrainerModal
│   │   └── TrainerLayout.tsx — TrainerSidebar + Tabs + Outlet + ToolsSidebar
│   │
│   ├── pages/
│   │   ├── Home.tsx          — /
│   │   ├── Trainer.tsx       — ⚠ archivo muerto, no tiene ruta
│   │   └── trainer/
│   │       ├── WVTrainer.tsx  — /trainer/wv
│   │       ├── MWTrainer.tsx  — /trainer/mw
│   │       ├── OLLTrainer.tsx — /trainer/oll
│   │       ├── PLLTrainer.tsx — /trainer/pll
│   │       └── F2LTrainer.tsx — ⚠ sin ruta aún
│   │
│   ├── Components/
│   │   ├── GlobalComponents/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   ├── Home/
│   │   │   ├── Hero.tsx
│   │   │   ├── AlgorithmSection.tsx  — grid de cards con links a trainers
│   │   │   ├── AlgorithmCard.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── CTASection.tsx        — ⚠ sin uso en Home.tsx
│   │   │
│   │   ├── trainer/
│   │   │   ├── TrainerSidebar.tsx    — sidebar izquierda (stats placeholder)
│   │   │   ├── TrainerTabs.tsx       — tabs de navegación (no funcionales)
│   │   │   ├── TrainerToolsSidebar.tsx — sidebar derecha (placeholder)
│   │   │   ├── CubeViewer.tsx        — ⚠ PLACEHOLDER, sin cubo real
│   │   │   ├── ScrambleBox.tsx       — muestra string de scramble
│   │   │   ├── AlgorithmBox.tsx      — muestra string de algoritmo
│   │   │   └── NextCaseButton.tsx    — botón "Next Case"
│   │   │
│   │   └── Modals/
│   │       └── TrainerModal.tsx      — modal con AlgorithmSection
│   │
│   └── data/
│       ├── WVCases.ts   — ⚠ vacío
│       ├── MWCases.ts   — ⚠ vacío
│       └── f2lCases.ts  — ⚠ vacío
│       (faltan OLLCases.ts y PLLCases.ts)
│
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
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
