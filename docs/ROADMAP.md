# Roadmap & Release Strategy

## Product Vision
Speedcubing algorithm trainer. Users select a set (WV, MW, OLL, PLL, F2L), practice recognizing and executing algorithms, track progress.

## Benchmark: csTimer
Este proyecto se compara activamente contra
[csTimer](https://github.com/cs0x7f/cstimer) — el estándar de facto de la
comunidad speedcuber — con el objetivo de **convertirse en el mejor
trainer de algoritmos para 3x3**.

- **Ventaja estructural**: csTimer no tiene base de datos de algoritmos
  (solo genera estados con Kociemba/min2phase); AlgoTrainer sí tiene
  hojas curadas (188 casos) y scrambles que generan el caso exacto.
- **Qué copiamos de csTimer**: persistencia local, stats reales
  (Ao5/Ao12, PBs), casos débiles, y su técnica de scrambles por estado.
- **Dónde lo superamos**: entrenamiento enfocado con feedback
  (recognition timer, weak cases, filtros) — algo que csTimer no hace.

Ver `PLAN.md` → "Referencia de Benchmark: csTimer" para la auditoría
completa del código de csTimer y las fases A/B/C post-auditoría.

## Release Phases

### Phase 1: MVP Core (Foundation) — Week 1
**Goal**: Working trainer with real data, no UI placeholders, keyboard support.

- ✓ Fix route mapping (WV→WV, MW→MW, add F2L)
- ✓ Populate all 5 algorithm datasets
- ✓ Implement `useTrainer` hook (random case selection, next/prev)
- ✓ Implement algorithm reveal (hide/show on SPACE)
- ✓ Keyboard shortcuts (SPACE→next, R→reveal)
- ✓ Session stats (cases done, current streak)
- ✓ Remove placeholder text from sidebars
- ✓ Remove dead files (pages/Trainer.tsx, CTASection unused reference)

**Metrics**: Trainer is fully usable with keyboard, no hardcoded data.

---

### Phase 2: Visual Polish — Week 2
**Goal**: Professional-looking trainer with real cube visualization.

- ✓ 3D Cube Viewer (cubing.js `<twisty-player>`) — drag orbital, move-press, hint facelets, guía 3D.
- ✓ TrainerTabs funcionales (`Link` + `useLocation` con estado activo por ruta).
- ✓ AlgorithmBox / NextCaseButton con estilos consistentes.
- ✓ Dark mode en trainer.
- ✓ WV trainer con dos modos (reconocimiento / resolución en cubo virtual).
- ✓ Settings persistentes por modo (Cronómetro / Reconocimiento / Resolución).
- ✓ Layout unificado entre modos (CTAs `PrimaryButton`/`SecondaryButton`/`SpaceHint`).
- [ ] Timer de reconocimiento visible en sidebar (ya se mide en `useExecutionTrainer.recognitionTime`, falta mostrar)
- [ ] Mejorar display de stats (progress bar, Ao5/Ao12/PB con valores reales)
- [ ] Stats de ejecución visibles (executionTime ya capturado, falta UI)

**Metrics**: Trainer looks polished, cube visualizer working, modo virtual verificable por estado.

---

### Phase 3: Features — Week 3+
**Goal**: Extended functionality and personalization.

- [x] Settings page (por modo: Cronómetro / Reconocimiento / Resolución) — persistido
- [ ] Algorithm search / filter (practice only certain cases)
- [ ] Weak cases mode (show failures more often)
- [ ] Time attack mode (30 sec to solve multiple cases)
- [ ] Statistics dashboard (success rate, avg recognition time)
- [ ] Persistencia en localStorage (progreso, stats por trainer, casos dominados) — como csTimer
- [ ] Keyboard shortcut config page
- [ ] Custom algorithm lists
- [ ] Migrar MW/OLL/PLL/F2L a `TrainerPage` (modos + settings + cubo virtual)
- [ ] Tab Cronómetro funcional (timer con stats Ao5/Ao12, splits)

**Metrics**: Users can personalize their training.

---

### Phase 4: Social / Advanced (Future)
- [ ] Progress persistence (localStorage → backend)
- [ ] Leaderboards (if multiplayer planned)
- [ ] Algorithm video tutorials
- [ ] Community algorithm contributions
- [ ] Mobile app (React Native)

---

## Critical Path (What Blocks Other Work)

```
Fix routes → Populate data → useTrainer hook → Keyboard support
     ↓             ↓              ↓                  ↓
   5m            2h             1h                30m
                                ↓
                          Trainer usable
                                ↓
                         CubeViewer (optional but nice)
                                ↓
                         Phase 2 polish
```

---

## Known Issues Blocking MVP

| Issue | Impact | Priority |
|-------|--------|----------|
| Route mapping wrong (WV→MW) | ✓ Resuelto en Phase 1 | — |
| Data files empty | ✓ Resuelto en Phase 1 (5 datasets poblados) | — |
| F2LTrainer not routable | ✓ Resuelto en Phase 1 (`/trainer/f2l`) | — |
| CubeViewer is placeholder | ✓ Resuelto en Phase 2 (twisty-player real con guía + hint facelets) | — |
| Keyboard shortcuts not implemented | ✓ Resuelto en Phase 2 (SPACE: revelar/siguiente en pasivo; U/D/R/L/F/B, Shift, 2, Z en virtual) | — |
| TrainerTabs non-functional | ✓ Resuelto en Phase 1 (Link + useLocation) | — |
| WV scrambles vacíos (`scramble: ""`) | ✓ Resuelto: WVTrainer usa `useScrambledTrainer` con variación PLL (como OLL) | — |
| MW/OLL/PLL/F2L sin modos ni cubo virtual | Migrar a `<TrainerPage cases={...} />` | **HIGH** |
| `trainerStatsStore` singleton global | Stats se mezclan entre trainers | **MEDIUM** |
| `TrainerContext.tsx` muerto | Código muerto — reemplazar | **LOW** |
| Sin validación automática de los 188 casos | Solo OLL + WV (27) validados; MW/PLL/F2L sin chequeo | **MEDIUM** |
| Sin persistencia de progreso en localStorage | Progreso perdido al recargar (csTimer sí persiste) | **MEDIUM** |
| Settings: tab Cronómetro sin funcionalidad | Placeholder | **MEDIUM** |

---

## Success Criteria per Phase

### Phase 1 Done When:
- [ ] User can pick a trainer (WV/MW/OLL/PLL/F2L) from home
- [ ] Trainer shows different scramble + algorithm each time
- [ ] SPACE reveals algorithm
- [ ] SPACE or button advances to next case
- [ ] Sidebar shows "X cases practiced, Y streak"
- [ ] All 5 datasets have at least 5 real cases each
- [ ] No console errors or hardcoded data on screen

### Phase 2 Done When:
- [ ] User sees a 3D cube visualization
- [ ] Timer shows recognition time
- [ ] Tabs accurately reflect current trainer
- [ ] Stats update in real-time as user practices
- [ ] Dark mode works throughout

### Phase 3 Done When:
- [ ] User can filter by difficulty/subset
- [ ] User can view personal stats (time, success rate)
- [ ] Settings page exists and persists choices
- [ ] Custom lists can be created and saved
