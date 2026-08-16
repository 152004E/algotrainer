# 03 — Los 3 modos del trainer (pasivo, cubo físico, cubo virtual)

- **Prioridad:** Alta
- **Estado:** pendiente

## Contexto

Decisión acordada: el trainer tiene **3 modos**:

1. **Modo pasivo / reconocimiento**: ves el scramble, reconocés el caso, se
   puede revelar el algoritmo (el flujo actual de `useTrainer`).
2. **Modo cubo físico**: como un cronómetro normal de speedcubing (estilo
   csTimer) — el entrenamiento es con un **cubo real**. Inspección opcional,
   cronómetro configurable, y al terminar se marca el resultado.
3. **Modo cubo virtual (digital)**: se entrena **sin cubo físico** usando el
   **cubo virtual** de la app. Mismo cronómetro configurable, pero la entrada es
   con las letras del **teclado** (y click en el cubo). Es el modo que ya existe
   en WV (`useExecutionTrainer`).

## Qué hay que hacer

- [ ] Unificar los 3 modos en un **mismo entrenador** seleccionable por
      configuración/sesión.
- [ ] Modo pasivo: mantener/reutilizar `useTrainer` (o `useScrambledTrainer`).
- [ ] Modo cubo físico: nuevo flujo de cronómetro (ver `04-inspeccion-wca.md`).
- [ ] Modo cubo virtual: generalizar `useExecutionTrainer.ts` a cualquier
      subset (hoy solo WV), manteniendo el cronómetro configurable.
- [ ] Entrada por teclado que ya existe: `U D R L F B`, `Shift` = inversa,
      `2` = doble, `Space` = comprobar (`src/hooks/useExecutionTrainer.ts`).
- [ ] El selector de subset **por sesión** elige casos de un subset (ver
      `07-sesiones.md` y `to-do-general/02-favoritos.md` para mezclas).

## Cómo / Diseño

- **Selector de modo** por sesión (pequeño switch: Pasivo / Físico / Virtual).
- Esquema propuesto del comportamiento por modo:

| Modo | Cubo | Entrada | Cronómetro | Verificación |
|------|------|---------|-----------|--------------|
| Pasivo | virtual opcional | revelar algs | recon. (opcional) | manual |
| Físico | real | cronómetro | ✓ inspección + tiempo | OK / +2 / DNF |
| Virtual | virtual | teclado / click | ✓ inspección + tiempo | `verifySolve` |

- Reusar `verifySolve.ts` y `scrambleService.ts` (ya generan scramble +
  solución completa por caso).

## Criterios de aceptación

- [ ] Los 3 modos funcionan para cualquier subset del catálogo.
- [ ] Cambiar de modo no rompe las estadísticas de la sesión activa.
- [ ] El modo virtual permite entrenar sin levantar el cubo físico, con
      cronómetro y feedback (como hoy en WV).