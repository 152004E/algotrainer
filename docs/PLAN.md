# AlgoTrainer — Plan de Implementación

## Estado Actual
Rutas corregidas y datos poblados (5 datasets). Algoritmo de generación
dinámica de scrambles validado (564/564 clean). **WV trainer base implementado**:
los 27 casos diestros reales (algoritmos = strings originales de la página; el scramble
es `invert(algorithm)`), `useScrambledTrainer` integrado en modo pasivo y
`useExecutionTrainer` en modo virtual (135/135 verificación por estado), cubo
virtual con `<twisty-player>` (drag-input auto, hint facelets, guía de notaciones),
`SettingsModal` con tabs Cronómetro / Reconocimiento / Resolución persistido
con versionado, layout unificado (mismo scramble + cubo + columna derecha en ambos
modos, CTAs con `PrimaryButton`/`SpaceHint`/`SecondaryButton`). Pendiente: migrar
MW/OLL/PLL/F2L a la base nueva (`<TrainerPage cases={...} />`), entrenar
reconocimiento contra el cubo virtual en los demás subsets, tab Cronómetro funcional.

---

## Referencia de Benchmark: csTimer

Estamos construyendo AlgoTrainer comparándonos contra
[csTimer](https://github.com/cs0x7f/cstimer) (el cronómetro/speedcuber
trainer de facto de la comunidad) con el objetivo de **ser el mejor
trainer de algoritmos para 3x3**.

### Qué aprendimos del código de csTimer (auditoría 2026-08-08)

1. **csTimer NO tiene base de datos de algoritmos** — genera scrambles
   por "random state" con un solver (min2phase/Kociemba) y espera que el
   usuario ponga el algoritmo. Su WV/VLS solo generan *estados* para
   entrenar reconocimiento, no hojas de algoritmos.
2. **Nuestra ventaja**: AlgoTrainer sí tiene una base de algoritmos
   curada (188 casos) → es un *trainer* real, no un timer con scrambles.
3. **Nuestra técnica es la misma**: la composición Kociemba
   (`invert(algorithm)` como setup + perturbación + solver) equivale al
   enfoque de estado aleatorio de csTimer, pero garantizando que el
   scramble produce EXACTAMENTE el caso entrenado.
4. **Lo que sí hay que copiarle a csTimer**: persistencia local
   (localStorage/indexedDB), estadísticas reales (Ao5/Ao12, PBs),
   casos débiles (repite los que fallas) y PWA/offline.

### Objetivo
Superar a csTimer como **trainer 3x3**: con hojas de algoritmos
curadas, scrambles que generan el caso exacto, y un loop de feedback
(weak cases + stats) que csTimer no tiene por diseño.

---

## Prioridad 0 — Scramble Generation System (VALIDADO)

- [x] **`src/utils/scrambleService.ts`**: 188/188 pattern + 188/188 clean
  - Usa Kociemba (min2phase) composition: `pert + invert(pert) + solvedToTarget`
  - Para F2L con `y` en datos: centra centros, Kociemba, añade rotación al final
  - WV usa `invert(algorithm)` como effectiveSetup
  - Cachea KPuzzle + target patterns por caseId

- [x] **Crear `src/hooks/useScrambledTrainer.ts`** — implementado (wrapper sobre `scrambleService.generateScramble()`, estados `loading`/`scramble`/`currentCase`/`revealed`, `stats: SessionStats`).
- [x] **Integrar `useScrambledTrainer` en `WVTrainer.tsx`** — WV es el primer trainer con scrambles dinámicos (antes mostraba `scramble: ""` vacío).
- [x] **Variación PLL para WV** — el bloque genérico `c.id.startsWith("oll-")` en `scrambleService.ts` ahora cubre `oll- || wv-` (22 PLLs, máx 20 movimientos) y el botón "Nuevo Scramble" en `AlgorithmCategory.tsx` funciona para ambos.
- [x] **`scripts/verifyWVCases.ts`** (`pnpm run verify-wv`) — 165/165: 27 casos, únicos up to AUF, inverso resuelve, EO ✓, D-layer resuelta, DFR arriba, FR edge en slot, `corners` correcto.

- [x] **Reemplazar `Components/trainer/CubeViewer.tsx`**
  - Real `<twisty-player>` (`puzzle="3x3x3"`, `experimental-drag-input="auto"`, hint facelets imperativos).
  - Guía de caras (U/D/R/L/F/B) proyectada en 3D siguiendo `orbitCoordinates`.
  - Move-press + drag + scroll zoom. Keys: U/D/R/L/F/B, Shift, 2, Z.
  - Verificación: `pnpm run verify-interactive-solve` = 135/135.

- [x] **Actualizar `ScrambleBox.tsx`** — prop `loading: boolean` con skeleton mientras genera.

- [ ] **Migrar trainers restantes** (OLL/PLL/MW/F2L) a `TrainerPage`
  - Reemplazar cuerpo del trainer por `<TrainerPage cases={...} />`.
  - Habilita modos pasivo/virtual + settings en todos los subsets.

- [ ] **Migrar AlgorithmCard + AlgorithmModal**
  - Usar scramble generado en lugar de invertir algorithm
  - Mantener datos actuales sin cambios

---

## Prioridad 1 — Bugs Críticos (hacer YA)

- [x] **Corregir rutas en App.tsx**
  - `/trainer/wv` → `WVTrainer` ✓
  - `/trainer/mw` → `MWTrainer` ✓
  - Agregar `/trainer/f2l` → `F2LTrainer` ✓

- [x] **Poblar archivos de datos**
  - `WVCases.ts` — 27 casos Winter Variation ✓
  - `MWCases.ts` — 41 casos Magic Wonderful ✓
  - `f2lCases.ts` — 42 casos F2L ✓
  - `OLLCases.ts` — 57 casos OLL ✓
  - `PLLCases.ts` — 21 casos PLL ✓
  - Shape: `{ id, name, scramble, algorithm }`

---

## Prioridad 2 — Lógica del Trainer

- [x] **Generador de casos aleatorios**
  - `useTrainer(cases)` y `useScrambledTrainer(cases)` — ambos funcionales.

- [x] **ScrambleBox funcional**
  - Muestra scramble (con skeleton `loading` mientras Kociemba genera).

- [x] **AlgorithmBox con reveal**
  - Oculta por defecto; click o SPACE revela.
  - `AlgorithmReveal` soporta `forceReveal` (Modo aprender).

- [x] **Keyboard shortcuts (modo pasivo)**
  - SPACE en `TrainerLayout`: si algoritmo no revelado → revela; si sí → siguiente caso.
  - `useExecutionTrainer` añade: U/D/R/L/F/B, Shift=inverso, 2=doble, Z=retroceder.

- [x] **WV trainer con cubo 3D real**
  - `<twisty-player>` interactivo, drag orbital, move-press, hint facelets, guía 3D.

- [x] **Mode toggle (pasivo ↔ virtual)**
  - `TrainerModeToggle` persistido en `localStorage["algotrainer:trainerMode"]`.

- [x] **Settings persistentes por modo**
  - `useTrainerSettings.ts` + `SettingsModal.tsx` + `ToggleSwitch.tsx`.
  - Reconocimiento: `hiddenFaces`, `hideFaces` (Ocultar cubo).
  - Resolución: `guide`, `controls`, `learnMode`.
  - Cronómetro: placeholder (sin funcionalidad).
  - Persistido con versionado (`SETTINGS_VERSION`) → reset automático en mismatch.

- [x] **Layout unificado entre modos**
  - `PrimaryButton` (h-14, w-64 en CTAs), `SecondaryButton`, `SpaceHint`, `AlgorithmReveal`, `difficulty.ts`.
  - Ambos modos comparten scramble + cubo + columna derecha → cambio de modo no es brusco.

---

## Prioridad 3 — CubeViewer Real

- [x] **Integrar visualizador 3D**
  - `cubing.js` `<twisty-player>` en `Components/trainer/CubeViewer.tsx`.
  - Drag orbital + move-press (`experimental-drag-input="auto"`).
  - Guía de caras (overlay) que sigue la cámara (`orbitCoordinates` → face normals @ ±0.55).
  - Hint facelets (ghost) controlado por `settings.recognition.hiddenFaces`.
  - Move-press input + scroll zoom. Atajos teclado: U/D/R/L/F/B, Shift, 2, Z.

---

## Prioridad 4 — Session Stats (TrainerSidebar)

- [ ] **Contadores de sesión**
  - Casos practicados
  - Streak actual
  - Tiempo promedio de reconocimiento (opcional, necesita timer)
  - Pasarlos como props desde TrainerLayout o Context

- [ ] **Timer de reconocimiento**
  - Empieza cuando aparece nuevo caso
  - Para cuando se revela el algoritmo
  - Muestra tiempo en ms/s en sidebar

---

## Prioridad 5 — TrainerTabs Funcional

- [ ] **Tabs navegables**
  - Actualmente hardcoded y sin funcionalidad
  - Usar `useLocation` para detectar ruta activa
  - `Link` components en lugar de buttons
  - Tabs: F2L / WV / MW / OLL / PLL

---

## Prioridad 6 — Features Extra

- [x] **CTASection en Home** — resuelto: componente eliminado del repo
- [x] **Página /algorithms** — existe: `AlgorithmsHome.tsx` en `/algorithms`
- [x] **Página /about** — existe: `About.tsx` en `/about`
- [ ] **Filtrado por subconjunto** — practicar solo ciertos casos del set
- [ ] **Progreso persistente** — localStorage para guardar casos dominados
- [ ] **Modo "weak cases"** — mostrar más frecuentemente los casos fallidos

---

## Deuda Técnica

| Archivo | Problema |
|---|---|
| `pages/Trainer.tsx` | ✓ Eliminado del repo |
| `Components/Home/CTASection.tsx` | ✓ Eliminado del repo |
| `TrainerSidebar.tsx` | ✓ Funcional — stats reales vía `trainerStatsStore` (pero Ao5/Ao12/PB con "--") |
| `TrainerTabs.tsx` | ✓ Funcional — `Link` + `useLocation` con estado activo |
| `TrainerToolsSidebar.tsx` | ✓ Abre `SettingsModal` |
| `hooks/TrainerContext.tsx` | ✗ Código muerto — no lo usa nadie (el estado vive en `TrainerLayout` Outlet context) |
| `hooks/TrainerStatsStore.ts` | ✗ Singleton global — las stats se mezclan entre trainers |
| `pages/trainer/{MW,OLL,PLL,F2L}Trainer.tsx` | ✗ Estructura vieja — pendiente migrar a `<TrainerPage cases={...} />` para habilitar modos + settings + cubo virtual en todos los subsets |
| `data/WVCases.ts` | ✓ 27 casos diestros reales (algoritmos = strings de la página, verificados 27/27); `scramble: ""` es correcto porque el runtime usa `invert(algorithm)` = la resolución |
| `data/PLLCases.ts` etc. | ⚠ `scramble === algorithm` en varios casos → aplicar el scramble 2x no resuelve; usar `invert(algorithm)` o scrambles dinámicos |
| `useScrambledTrainer.ts` | ✓ Integrado en `PassiveTrainerView` (WV) |
| `SettingsModal` (tab Cronómetro) | ✗ Placeholder — sin ajustes ni funcionalidad |
| `CubeViewer` (Algorithms) vs (Trainer) | Hay dos componentes: `Components/algorithms/CubeViewer.tsx` (browser) y `Components/trainer/CubeViewer.tsx` (trainer, real). Refactor futuro: unificar en uno reutilizable. |

---

## Orden Sugerido de Implementación

```
1. Fix routes (App.tsx)           ✓ hecho
2. Datos WV + OLL + PLL           ✓ hecho
3. Hook useTrainer + lógica next  ✓ hecho
4. AlgorithmBox reveal + SPACE    ← 30 min (SPACE ya en TrainerLayout; falta R)
5. CubeViewer con cubing.js       ← 2-3 hrs
6. Session stats + timer          ✓ en gran parte (recognitionTime + trainerStatsStore)
7. TrainerTabs funcional          ✓ hecho
8. Páginas faltantes (/algorithms, /about) ✓ hechas
```

---

## Roadmap de Implementación (post-auditoría vs csTimer)

Prioridades ordenadas por valor/esfuerzo, rumbo a ser el mejor trainer 3x3:

### Fase A — Integración (desbloquea todo) — ~1-2 hrs
- [x] `WVTrainer` → `useScrambledTrainer` (scramble dinámico + variación PLL, como OLL).
- [ ] Reemplazar `useTrainer` → `useScrambledTrainer` en los trainers restantes
      (MW/OLL/PLL/F2L). Arregla: `scramble === algorithm` en OLL/PLL.
- [ ] Reusar `Components/algorithms/CubeViewer.tsx` (twisty-player real)
      en el trainer; borrar el mockup.
- [x] `ScrambleBox` con prop `loading` (skeleton mientras Kociemba genera).
- [ ] Resetear stats por trainer (eliminar el singleton global o
      parametrizarlo por trainer).
- [ ] Borrar código muerto: `hooks/TrainerContext.tsx`, botones ? y ⌨.

### Fase B — Automatizar validación de datos — ~2-3 hrs
- [ ] Script que valide los **188 casos** (hoy solo OLL): el scramble
      genera el estado correcto del caso y el algoritmo lo resuelve.
- [ ] Script de consistencia de **parejas ergonómicas**:
      `mirrorAlgorithm(OLL47) === OLL48`, etc.
- [ ] Script de limpieza: algs parsean, sin pares redundantes.

### Fase C — Loop de entrenamiento — ~4-6 hrs
- [ ] **Persistencia en localStorage** (progreso, stats por trainer,
      casos dominados) — como csTimer.
- [ ] **Modo weak cases**: ponderar con `caseHistory` los casos que más
      cuestan reconocer.
- [ ] **Stats reales Ao5/Ao12 + timer de ejecución** (no solo
      reconocimiento).
- [ ] **Filtro por dificultad/subset** en los trainers.
- [ ] Stats dashboard con gráficas de progreso (estilo csTimer).
