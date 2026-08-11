# CLAUDE.md — AI Context

## For Claude AI Assistant

**Read first**: Establish full project context for any conversation.

### Quick Facts
- **Product**: Speedcubing algorithm trainer (WV, MW, OLL, PLL, F2L)
- **Stack**: React 19 + TS + Vite + Tailwind v4 + React Router v7
- **cubing.js v0.63.3**: `cubing/puzzles`, `cubing/kpuzzle`, `cubing/search`, `cubing/alg`
- **Scramble generation**: Dynamic via Kociemba composition (min2phase)
  - `solveMin2Phase(perturbedTarget)` + `invert(pert)` with full simplification via `simplifyMoves`
  - Only face moves: `U D R L F B` + `'` `2`
  - No rotations/wide/slice moves, **no dmove suffix**
  - `getEffectiveSetup` siempre usa `invert(algorithm)`, nunca `c.scramble`
  - Frente=Verde, Arriba=Blanco (WCA standard)
  - 564/564 validated (pattern + clean), 100/100 unique scrambles OLL 33
- **OLL/WV PLL variation**: ALL 57 OLLs + 27 WV cases have PLL variation active
  - `target = solved.applyAlg(pll).applyAlg(invert(case))` con 22 PLLs (skip + 21)
  - Sin AUF, sin rotaciones, sin M/E/S, sin wide moves
  - Max 20 moves, rejection guard, simplifyMoves
  - Single generic block `if (c.id.startsWith("oll-") || c.id.startsWith("wv-"))` in scrambleService.ts
  - 57/57 OLLs + 27/27 WV validated, botón "New Scramble" en ambos
- **WV cases**: 27 diestros reales (slot FR) — `src/data/WVCases.ts`. `algorithm` = strings originales de la página; `scramble: ""` es correcto (runtime usa `invert(algorithm)` = la resolución, confirmado por el usuario en cubo real). Verificado 27/27, EO ✓, DFR arriba, FR edge en slot, `corners` = LL orientados excluyendo la pieza DFR. Script: `pnpm run verify-wv` (165/165 checks). Zurdos → `mirrorAlgorithm()`, fase futura.
- **State**: Routes fixed, all 5 datasets populated, algorithm browser working, scramble service implemented + validated, OLL+WV PLL variation completed, WVTrainer uses `useExecutionTrainer` (ejecución interactiva en cubo virtual con verificación por estado)
- **Language**: Spanish UI + English code

### Critical Context
1. **Scramble generation system (IMPLEMENTED)**:
   - `src/utils/scrambleService.ts`: `ScrambleService` class con `generateScramble(case)`
   - Usa Kociemba composition: `solvedToPerturbed + pertInverted`
   - Full simplification via `simplifyMoves` (stack-based, cascadeo natural)
   - No dmove suffix
   - Rejection guard: si colapsa a base setup, regenera
   - Pre-warming cache por case
   - Ver `SCRAMBLE_GENERATION.md` para spec completa

2. **AlgorithmModal integration (ALL 57 OLLs + 27 WV)**:
   - Props: `dynamicScramble?` + `onNewScramble?`
   - Botón "🔄 Nuevo Scramble" genera scramble diferente sin cambiar caso
   - Fallback a `invert(algorithm)` si no hay dynamic scramble
   - Condición genérica: `isPLLVariation(id)` = `oll- || wv-`
   - 57/57 OLLs + 27/27 WV con botón "Nuevo Scramble" funcional

3. **Validation scripts**:
   - `scripts/validateCleanScrambles.ts`: 564/564 pattern + clean (todos los subsets)
   - `scripts/validateScrambleDiversity.ts`: 100% unique OLL 33, 0 D-equivalent, seam redundancy tracking
   - 500 scrambles × 6 OLLs nuevos: 100% orientation correct, 0 redundant pairs, 0 over 20

4. **Reglas fijas de scramble**:
   - Solo face moves (U D R L F B + ' 2)
   - No dmove al final (desalinea visualmente)
   - `getEffectiveSetup` = `invert(algorithm)` siempre
   - Full simplification via `simplifyMoves`: elimina cualquier par consecutivo en la misma cara, con cascadeo automático
   - Center correction: detecta y/y'/y2, aplica al target, añade inverse al final
   - AlgoCase type sin modificar

5. **OLL/WV PLL variation rules**:
   - `target = solved.applyAlg(pll).applyAlg(invert(case))` — misma estrategia OLL 33/45
   - 22 PLLs: skip, Ua, Ub, Aa, Ab, E, F, Ga, Gb, Gc, Gd, H, Ja, Jb, Na, Nb, Ra, Rb, T, V, Y, Z
   - Sin AUF, sin rotaciones, sin M/E/S, sin wide moves
   - Máximo 20 movimientos (regenera si excede)
   - Perturbación 3-5 movimientos, solver Kociemba, simplifyMoves
   - Rejection guard + correction handling intactos

6. **What exists but doesn't work**:
   - CubeViewer (trainer): twisty-player real + interactivo ✓ (click en cubo via `experimental-move-press-input="basic"`, sync por polling de `experimentalGet.alg()`), guía de notaciones (overlay + leyenda, bloquea rotación)
   - Real 3D cube viewer in trainer — pendiente (igual que arriba)
   - Scrambles dinámicos en trainers: `WVTrainer` usa `useExecutionTrainer` ✓ (fases recognize/execute/feedback, modos Aprender/Practicar); los trainers OLL/PLL/MW/F2L usan `useTrainer` (scrambles fijos del dataset) — pendiente integrar
   - Keyboard shortcuts: SPACE funciona (revelar / siguiente en TrainerLayout); shortcut `R` no implementado
   - (✓ resuelto) TrainerSidebar ya muestra stats reales (recognition time, avg, solved) vía `trainerStatsStore`
   - (✓ resuelto) TrainerTabs ya navega con `Link` + `useLocation` (estado activo por ruta)
   - (✓ resuelto) `pages/Trainer.tsx` fue eliminado del repo
   - (✓ resuelto) `useTrainer` es funcional y lo usan los 5 trainers

### Docs to Read
- **`SCRAMBLE_GENERATION.md`** — full spec: Kociemba composition, boundary-only, rules, validation
- **`ARCHITECTURE.md`** — project structure, routes, component hierarchy
- **`DATA_STRUCTURE.md`** — TypeScript types, AlgoCase shape, localStorage
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
| Algorithm Card/Modal | src/Components/algorithms/ | ✓ Working, scramble via service |
| Scramble validation | scripts/validateCleanScrambles.ts | ✓ 564/564 pass |
| Scramble service | src/utils/scrambleService.ts | ✓ Implemented |
| Scramble diversity | scripts/validateScrambleDiversity.ts | ✓ Implemented |
| OLL PLL variation | src/utils/scrambleService.ts | ✓ 57/57 OLLs, all 22 PLLs |
| New Scramble button | src/pages/algorithms/AlgorithmCategory.tsx | ✓ All 57 OLLs |
| Dynamic trainer hook | src/hooks/useScrambledTrainer.ts | ✓ Implementado (sin integrar) |
| Interactive trainer hook | src/hooks/useExecutionTrainer.ts | ✓ Implementado + integrado en WVTrainer (verificación: `src/utils/verifySolve.ts`, `pnpm run verify-interactive-solve` = 135/135) |

### Code Quality Standards
- Functional components only
- Tailwind only (no CSS modules)
- Props > Context
- No comments unless WHY is non-obvious
- Validate at boundaries only
- Trust internal guarantees
- One commit per feature — pero **solo el usuario hace commits**; el agente avisa "listo para commitear"

### Before You Start
1. Run `pnpm install` (already done)
2. Run `pnpm run dev` to start dev server
3. Check PLAN.md Priority 1 tasks
4. Read ARCHITECTURE.md for file layout
5. Read DATA_STRUCTURE.md for type shapes
6. Read SCRAMBLE_GENERATION.md for scramble system rules (imprescindible)
