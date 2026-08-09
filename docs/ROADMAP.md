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

- [ ] 3D Cube Viewer (integrate cubing.js or equivalent) — **reusar el twisty-player ya existente en `Components/algorithms/CubeViewer.tsx`**
- [ ] Timer for case recognition
- [ ] Better TrainerTabs (functional navigation, visual active state)
- [ ] Improve TrainerSidebar stats display (progress bar, streak counter)
- [ ] Better AlgorithmBox styling (larger font, clearer reveal state)
- [ ] Dark mode refinements
- [ ] Stats reales Ao5/Ao12 + timer de ejecución (no solo reconocimiento)

**Metrics**: Trainer looks polished, cube visualizer working.

---

### Phase 3: Features — Week 3+
**Goal**: Extended functionality and personalization.

- [ ] Algorithm search / filter (practice only certain cases)
- [ ] Weak cases mode (show failures more often)
- [ ] Time attack mode (30 sec to solve multiple cases)
- [ ] Statistics dashboard (success rate, avg recognition time)
- [ ] Persistencia en localStorage (progreso, stats por trainer, casos dominados) — como csTimer
- [ ] Keyboard shortcut config page
- [ ] Settings page (dark mode, language, etc.)
- [ ] Custom algorithm lists
- [ ] Integrar `useScrambledTrainer` en los 5 trainers (scrambles dinámicos de Kociemba)

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
| CubeViewer is placeholder | No visualization | **MEDIUM** |
| Keyboard shortcuts not implemented | Solo SPACE implementado (revelar/siguiente); R no | **MEDIUM** |
| TrainerTabs non-functional | ✓ Resuelto en Phase 1 (Link + useLocation) | — |
| WV scrambles vacíos (`scramble: ""`) | ✓ Resuelto: WVTrainer usa `useScrambledTrainer` con variación PLL (como OLL) | — |
| Trainers usan scrambles estáticos (no `useScrambledTrainer`) | `scramble === algorithm` en OLL/PLL; no aprovecha Kociemba. Restan OLL/PLL/MW/F2L | **HIGH** |
| `trainerStatsStore` singleton global | Stats se mezclan entre trainers | **MEDIUM** |
| `TrainerContext.tsx` muerto + botones ?/⌨ sin función | Código muerto | **LOW** |
| Sin validación automática de los 188 casos | Solo OLL + WV (27) validados; MW/PLL/F2L sin chequeo | **MEDIUM** |
| Sin persistencia en localStorage | Progreso perdido al recargar (csTimer sí persiste) | **MEDIUM** |

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
