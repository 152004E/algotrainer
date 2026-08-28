# 01 — Deuda técnica conocida

- **Prioridad:** Media
- **Estado:** pendiente

## Contexto

Deudas ya identificadas en la base actual (fuente: `docs/ROADMAP.md` y el
código). No necesitan investigación, son retoques/refactors concretos.

## Items

- [ ] **`trainerStatsStore` singleton global** (`src/hooks/TrainerStatsStore.ts`):
      las stats se comparten/mezclan entre trainers. Con sesiones (Tarea 6 de
      trainer) esto se resuelve — ver `to-do-trainer/07-sesiones.md`.
- [ ] **`TrainerContext.tsx` muerto** (`src/hooks/TrainerContext.tsx`): nadie lo
      usa. Reactivar para sesiones o borrarlo.
- [ ] **Botones `?` y `⌨` sin función** en `TrainerToolsSidebar.tsx`: conectar
      a las guías (Tarea 4 de trainer) o eliminarlos.
- [ ] **Ao5/Ao12/PB en `--`**: `TrainerSidebar` muestra placeholders. Implementar
      stats reales (media, mejores).
- [ ] **Sin persistencia en localStorage**: el progreso se pierde al recargar.
      Con sesiones + CSV (Tareas 5 y 6 de trainer) se resuelve.
- [ ] **Weak cases (casos débiles)**: repetir los casos que más cuestan. Se
      desbloquea con las stats por sesión.
- [ ] **Sin validación automática de los 188 casos**: solo OLL + WV validados.
      Ver `to-do-algoritmos/**`.

## Criterios de aceptación

- [ ] No quedan archivos muertos ni botones fantasma.
- [ ] Stats correctas por sesión (Ao5/Ao12/PB reales).