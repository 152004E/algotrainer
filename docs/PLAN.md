# AlgoTrainer — Plan de Implementación

## Estado Actual
Rutas corregidas y datos poblados (5 datasets). Algoritmo de generación
dinámica de scrambles validado (564/564 clean) y `useScrambledTrainer`
implementado. Pendiente: integrar el hook en los trainers y reemplazar
CubeViewer mockup.

---

## Prioridad 0 — Scramble Generation System (VALIDADO)

- [x] **`src/utils/scrambleService.ts`**: 188/188 pattern + 188/188 clean
  - Usa Kociemba (min2phase) composition: `pert + invert(pert) + solvedToTarget`
  - Para F2L con `y` en datos: centra centros, Kociemba, añade rotación al final
  - WV usa `invert(algorithm)` como effectiveSetup
  - Cachea KPuzzle + target patterns por caseId

- [x] **Crear `src/hooks/useScrambledTrainer.ts`** — implementado (wrapper sobre `scrambleService.generateScramble()`, estados `loading`/`scramble`/`currentCase`/`revealed`, `stats: SessionStats`). Sin integrar todavía en los trainers.

- [ ] **Reemplazar `Components/trainer/CubeViewer.tsx`**
  - Mockup div → twisty-player real
  - Props: `scramble: string`, `algorithm?: string`
  - `experimentalSetupAlg = scramble`, `experimentalSetupAnchor = "start"`

- [ ] **Actualizar `ScrambleBox.tsx`**
  - Aceptar prop `loading: boolean`
  - Mostrar skeleton animation mientras genera

- [ ] **Actualizar trainers** (OLL/PLL/MW/WV/F2L)
  - Usar `useScrambledTrainer` en lugar de `useTrainer`
  - Pasar `scramble` + `loading` a `ScrambleBox` y `CubeViewer`

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

- [ ] **Generador de casos aleatorios**
  - Hook `useTrainer(cases: AlgoCase[])` que devuelve:
    - `currentCase`, `nextCase()`, `sessionStats`
  - Usar en cada trainer page

- [ ] **ScrambleBox funcional**
  - Mostrar scramble del caso actual (del array de datos, no hardcoded)

- [ ] **AlgorithmBox con reveal**
  - Ocultar algoritmo por defecto
  - Click o SPACE para revelar
  - Estado: `hidden | revealed`

- [ ] **Keyboard shortcut: SPACE → Next Case**
  - `useEffect` con `keydown` listener en TrainerLayout o cada trainer page
  - Cuando algoritmo no revelado: revelar
  - Cuando ya revelado: siguiente caso

---

## Prioridad 3 — CubeViewer Real

- [ ] **Integrar visualizador 3D**
  - Opción A: [`cubing.js`](https://js.cubing.net/) — biblioteca oficial, soporta twisty + diagramas
  - Opción B: imagen estática SVG por caso (más simple, sin deps)
  - **Recomendación: Opción A** — `cubing.js` tiene `<twisty-player>` web component, fácil integración
  - Wrapper React: `CubeViewer.tsx` recibe `scramble: string` y renderiza el estado del cubo

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
| `TrainerSidebar.tsx` | ✓ Funcional — stats reales vía `trainerStatsStore` |
| `TrainerTabs.tsx` | ✓ Funcional — `Link` + `useLocation` con estado activo |
| `TrainerToolsSidebar.tsx` | Botones ? y ⌨ sin funcionalidad |

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
