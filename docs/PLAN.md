# AlgoTrainer — Plan de Implementación

## Estado Actual
Rutas y datos funcionales. OLL/PLL/MW/WV/F2L poblados. Algoritmo de
generación dinámica de scrambles validado (120/120 tests).
Pendiente: integrar el servicio en el trainer y reemplazar
CubeViewer mockup.

---

## Prioridad 0 — Scramble Generation System (VALIDADO)

- [x] **`src/utils/scrambleService.ts`**: 188/188 pattern + 188/188 clean
  - Usa Kociemba (min2phase) composition: `pert + invert(pert) + solvedToTarget`
  - Para F2L con `y` en datos: centra centros, Kociemba, añade rotación al final
  - WV usa `invert(algorithm)` como effectiveSetup
  - Cachea KPuzzle + target patterns por caseId

- [ ] **Crear `src/hooks/useScrambledTrainer.ts`**
  - Wrapper sobre `scrambleService.generateScramble()`
  - Estados: `loading`, `scramble`, `currentCase`, `revealed`
  - `nextCase()` → trigger nueva generación asíncrona + loading skeleton
  - Expone `stats: SessionStats`

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

- [ ] **Corregir rutas en App.tsx**
  - `/trainer/wv` → `WVTrainer` (actualmente apunta a MWTrainer)
  - `/trainer/mw` → `MWTrainer` (actualmente apunta a OLLTrainer)
  - Agregar `/trainer/f2l` → `F2LTrainer`

- [ ] **Poblar archivos de datos**
  - `WVCases.ts` — 27 casos Winter Variation
  - `MWCases.ts` — 41 casos Magic Wonderful
  - `f2lCases.ts` — casos F2L
  - Crear `OLLCases.ts` — 57 casos OLL
  - Crear `PLLCases.ts` — 21 casos PLL
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

- [ ] **CTASection en Home** — conectar el componente que ya existe pero no se usa
- [ ] **Página /algorithms** — lista completa de todos los algoritmos por set (el Link en Navbar apunta ahí pero no existe)
- [ ] **Página /about** — el Link en Navbar apunta ahí pero no existe
- [ ] **Filtrado por subconjunto** — practicar solo ciertos casos del set
- [ ] **Progreso persistente** — localStorage para guardar casos dominados
- [ ] **Modo "weak cases"** — mostrar más frecuentemente los casos fallidos

---

## Deuda Técnica

| Archivo | Problema |
|---|---|
| `pages/Trainer.tsx` | Dead file, no está en el router. Eliminar o conectar. |
| `Components/Home/CTASection.tsx` | Componente sin uso. Conectar o eliminar. |
| `TrainerSidebar.tsx` | Stats hardcodeados como texto placeholder |
| `TrainerTabs.tsx` | Botones sin navegación ni estado activo |
| `TrainerToolsSidebar.tsx` | Botones ? y ⌨ sin funcionalidad |

---

## Orden Sugerido de Implementación

```
1. Fix routes (App.tsx)           ← 10 min
2. Datos WV + OLL + PLL           ← 1-2 hrs (copiar de alg.cubing.net)
3. Hook useTrainer + lógica next  ← 1 hr
4. AlgorithmBox reveal + SPACE    ← 30 min
5. CubeViewer con cubing.js       ← 2-3 hrs
6. Session stats + timer          ← 1 hr
7. TrainerTabs funcional          ← 30 min
8. Páginas faltantes (/algorithms, /about) ← variable
```
