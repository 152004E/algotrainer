# CLAUDE.md — AI Context

## For Claude AI Assistant

**Read first**: Establish full project context for any conversation.

### Quick Facts
- **Product**: Speedcubing algorithm trainer (WV, MW, OLL, PLL, F2L)
- **Stack**: React 19 + TS + Vite + Tailwind v4 + React Router v7
- **State**: MVP skeleton (routes, layouts, hardcoded data, no 3D cube yet)
- **Language**: Spanish UI + English code

### Critical Context
1. **Bugs blocking everything**:
   - App.tsx routes wrong: `/trainer/wv` → MWTrainer (should be WVTrainer)
   - `/trainer/mw` → OLLTrainer (should be MWTrainer)
   - F2LTrainer has no route
   - All data files empty

2. **What exists but doesn't work**:
   - CubeViewer: placeholder `<div>` only
   - TrainerSidebar: hardcoded text, no real stats
   - TrainerTabs: not functional, hardcoded active state
   - pages/Trainer.tsx: dead file, no route

3. **What's missing**:
   - All 5 algorithm datasets (WV/MW/OLL/PLL/F2L)
   - useTrainer hook (randomize, next/prev, stats)
   - Timer logic
   - Keyboard shortcuts (SPACE, R)
   - Real 3D cube viewer (cubing.js integration)

### Docs to Read
- **`ARCHITECTURE.md`** — project structure, routes, component hierarchy
- **`DATA_STRUCTURE.md`** — TypeScript types, AlgoCase shape, localStorage
- **`PLAN.md`** — prioritized task list (do this order)
- **`ROADMAP.md`** — release phases & success criteria
- **`AI_RULES.md`** — code style & patterns for this codebase
- **`CONTRIBUTING.md`** — PR checklist & dev workflow

### Key Files
| What | Where | Status |
|------|-------|--------|
| Routes | App.tsx | ⚠️ Broken |
| Data | src/data/*.ts | ⚠️ Empty |
| Trainer pages | src/pages/trainer/ | ✓ UI done, no logic |
| Trainer components | src/Components/trainer/ | ✓ UI done, placeholders |

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
