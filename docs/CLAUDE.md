# CLAUDE.md — AI Context

## For Claude AI Assistant

**Read first**: Establish full project context for any conversation.

### Quick Facts
- **Product**: Speedcubing algorithm trainer (WV, MW, OLL, PLL, F2L)
- **Stack**: React 19 + TS + Vite + Tailwind v4 + React Router v7
- **cubing.js v0.63.3**: `cubing/puzzles`, `cubing/kpuzzle`, `cubing/search`, `cubing/alg`
- **Scramble generation**: Dynamic via `solveTwips` with `generatorMoves`
  - Only face moves: `U D R L F B` + `'` `2`
  - No rotations/wide/slice moves
  - 120/120 validated (math correct + clean)
- **State**: Routes fixed, all 5 datasets populated, algorithm browser working
- **Language**: Spanish UI + English code

### Critical Context
1. **Fixed bugs**:
   - Routes corrected: `/trainer/wv` → WVTrainer, `/trainer/mw` → MWTrainer
   - F2LTrainer route added
   - All 5 datasets populated (OLL 57, PLL 21, F2L 41, WV 27, MW 32)
   - Algorithm browse pages working (OLL/PLL/MW/WV/F2L)
   - AlgorithmCard + AlgorithmModal with cube viewer working

2. **What exists but doesn't work**:
   - CubeViewer (trainer): placeholder `<div>` only
   - TrainerSidebar: hardcoded text, no real stats
   - TrainerTabs: not functional, hardcoded active state
   - pages/Trainer.tsx: dead file, no route
   - AlgorithmCard + AlgorithmModal: derive mezcla by inverting algorithm
     (should use `scramble` or generated scramble directly)

3. **Scramble Generation System (in progress)**:
   - Dynamic scrambles via cubing.js `solveTwips` with `generatorMoves`
   - Only face moves: `U D R L F B` + `'` `2`
   - No rotations, wide moves, or slice moves
   - 120/120 validation passed (math correct + clean)
   - See `SCRAMBLE_GENERATION.md` for full spec

4. **What's missing**:
   - `useTrainer` hook (partially done — in useScrambledTrainer.ts)
   - Timer logic
   - Keyboard shortcuts (SPACE, R)
   - Real 3D cube viewer in trainer (cubing.js twisty-player)

### Docs to Read
- **`ARCHITECTURE.md`** — project structure, routes, component hierarchy
- **`DATA_STRUCTURE.md`** — TypeScript types, AlgoCase shape, localStorage
- **`SCRAMBLE_GENERATION.md`** — dynamic scramble system spec & validation
- **`PLAN.md`** — prioritized task list (do this order)
- **`ROADMAP.md`** — release phases & success criteria
- **`AI_RULES.md`** — code style & patterns for this codebase
- **`CONTRIBUTING.md`** — PR checklist & dev workflow

### Key Files
| What | Where | Status |
|------|-------|--------|
| Routes | App.tsx | ✓ Fixed |
| Data | src/data/*.ts | ✓ All 5 populated |
| Trainer pages | src/pages/trainer/ | ✓ UI done, need dynamic scrambles |
| Trainer components | src/Components/trainer/ | ✓ UI done, CubeViewer mockup |
| Algorithm browse | src/pages/algorithms/ | ✓ Working |
| Algorithm Card/Modal | src/Components/algorithms/ | ✓ Working, uses inverted alg |
| Scramble validation | scripts/validateScrambleGeneration.ts | ✓ 120/120 pass |
| Scramble service | src/utils/scrambleService.ts | ⏳ Planned |
| Dynamic trainer hook | src/hooks/useScrambledTrainer.ts | ⏳ Planned |

### Code Quality Standards
- Functional components only
- Tailwind only (no CSS modules)
- Props > Context
- No comments unless WHY is non-obvious
- Validate at boundaries only
- Trust internal guarantees
- One commit per feature

### Before You Start
1. Run `npm install` (already done)
2. Run `npm run dev` to start dev server
3. Check PLAN.md Priority 1 tasks
4. Read ARCHITECTURE.md for file layout
5. Read DATA_STRUCTURE.md for type shapes
