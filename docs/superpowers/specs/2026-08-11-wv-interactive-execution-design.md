# WV Trainer — Ejecución Interactiva del Algoritmo

Fecha: 2026-08-11
Estado: aprobado por el usuario
Alcance: **piloto en `WVTrainer`** (el diseño es genérico para replicar a MW/OLL/PLL/F2L después)

## Objetivo

Reemplazar el flujo pasivo (ver scramble → revelar algoritmo → siguiente) por una
práctica interactiva: el usuario **ejecuta el algoritmo de WV en un cubo virtual**
y la app **compara sus movimientos contra el algoritmo de resolución** para
determinar si es correcto.

## Contexto técnico clave

- El scramble de WV aplica una **variación PLL aleatoria** + perturbación, por lo
  que ejecutar el algoritmo del caso correctamente **no deja el cubo resuelto**:
  deja la última capa orientada con un PLL residual (`solved.applyAlg(pll)`).
  La verificación no puede ser "¿quedó resuelto?".
- cubing.js v0.63.3 disponible: `KPattern#isIdentical`, `kpuzzle`, `Alg`,
  `twisty-player` con `experimentalMovePressInput="basic"` (click en cubo),
  `cameraLatitude/Longitude/Distance`.

## Flujo por caso (máquina de estados)

1. **Reconocimiento** (`recognize`): scramble + cubo, algoritmo oculto, cronómetro
   de reconocimiento corriendo. El usuario elige:
   - **"Lo sé"** → fase `execute`.
   - **"No lo sé"** → se revela el algoritmo (se marca `helped`, cuenta como
     no-resuelto).
   - En modo **Aprender** el algoritmo ya es visible desde el inicio.
2. **Ejecución** (`execute`): arranca el cronómetro de ejecución. El usuario
   ejecuta el algoritmo en el cubo virtual (paleta + teclado + click en cubo).
   Puede deshacer. El cubo se actualiza en vivo.
3. **Verificación/Feedback** (`feedback`): el usuario presiona **"Comprobar"** (o
   SPACE). La app compara y muestra ✓/✗, movimientos del usuario vs algoritmo
   esperado, tiempos. Botones **Siguiente** / **Repetir**.

## Entrada de movimientos

Tres vías que apendizan a un array `userMoves` controlado por la app:

1. **MovePad**: botones `U U' U2 D D' D2 R R' R2 L L' L2 F F' F2 B B' B2` con
   flecha de sentido (↻/↺). Solo caras (WV no usa M/E/S).
2. **Teclado**: `U/D/R/L/F/B` normal, `Shift+letra` inverso, `2` doble. SPACE
   queda reservado como "Comprobar" en fase `execute`.
3. **Click en el cubo** (`experimentalMovePressInput="basic"`): el usuario gira
   tocando un sticker. Sync: se compara `el.experimentalGet.alg()` con el alg que
   enviamos y se incorpora el movimiento nuevo a `userMoves`.

## Guía visual de notaciones y sentidos

- Toggle **"Guía"** junto al cubo. Al activarse fija la cámara a la vista estándar
  (U arriba, F al frente) y **bloquea la rotación libre** mientras esté activa.
- **Overlay de letras** sobre el contenedor del cubo: `U D R L F B` en las caras
  visibles con flecha de sentido horario (regla de la mano derecha).
- **Leyenda estática** debajo del cubo (independiente de la cámara): esquema de
  colores estándar + diagrama de giros con sentidos.

## Verificación (comparación con algoritmo de resolución)

Comparación **por efecto**, no por string (dos strings distintos pueden ser el
mismo algoritmo):

- `estadoEsperado` = estado del scramble `.applyAlg(case.algorithm)`.
- `estadoUsuario` = estado del scramble `.applyAlg(userMoves)`.
- **Éxito** si `estadoUsuario` ≡ `estadoEsperado` tolerando **AUF** (comparación
  contra las 4 rotaciones U), **o** si el cubo quedó totalmente resuelto
  (WV + PLL residual resuelto = bonus).
- Util nuevo `src/utils/verifySolve.ts` (reutiliza `KPattern#isIdentical`).
- En feedback se muestran lado a lado movimientos del usuario y algoritmo esperado.

## Stats

- `SessionStats` gana: `attempts`, `correct`, `wrong`, `helped`, `avgExecutionTime`.
- `CaseAttempt` gana: `correct?: boolean`, `executionTime?: number`, `helped?: boolean`.
- `trainerStatsStore` extiende la firma; `TrainerSidebar` muestra tasa de éxito y
  tiempo medio de ejecución. Desbloquea "weak cases".

## Arquitectura

- Hook nuevo `src/hooks/useExecutionTrainer.ts`: máquina de estados, `userMoves`,
  timers, verificación. Reutiliza `scrambleService` + `verifySolve`. Genérico.
- Componentes nuevos: `MovePad.tsx`, `NotationGuide.tsx`, `FeedbackPanel.tsx`.
- `CubeViewer` (trainer) gana props `interactive`, `guide` y expone estado vía ref.
- `AlgorithmBox` gana awareness de modo (mostrar/ocultar, botón "No lo sé").
- `TrainerLayout`: el handler global de SPACE debe gatear por fase.

## Fuera de alcance (piloto)

- Aplicar a MW/OLL/PLL/F2L.
- Modo débil (weak cases), persistencia, modo tiempo.
- Variantes zurdas (mirror) como casos de práctica.
