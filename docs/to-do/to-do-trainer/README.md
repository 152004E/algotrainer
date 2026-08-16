# To-Do Trainer

Índice de tareas del trainer. Prioridad por orden de archivo.

- [ ] `01-introduccion.md` — Visión general: qué hay que hacer en el trainer
- [ ] `02-consumir-algoritmos.md` — Tarea 1: consumir los datos de la ruta `/algorithms`
- [ ] `03-modos-fisico-virtual.md` — Tarea 2: los 3 modos (pasivo, cubo físico, cubo virtual)
- [ ] `04-inspeccion-wca.md` — Tarea 3: inspección WCA configurable + voz + +2/DNF
- [ ] `05-modales-guia.md` — Tarea 4: modales guía para primeros usuarios
- [ ] `06-csv-import-export.md` — Tarea 5: carga masiva CSV (import/export de configuración)
- [ ] `07-sesiones.md` — Tarea 6: sesiones de entrenamiento + stats por sesión

## Referencias clave
- Hook actual del trainer interactivo: `src/hooks/useExecutionTrainer.ts`
- Trainer WV (único interactivo hoy): `src/pages/trainer/WVTrainer.tsx`
- Trainers pasivos (OLL/PLL/MW/F2L): `src/pages/trainer/*Trainer.tsx` con `useTrainer`
- Cátalogo de categorías: `src/data/algorithmCatalog.ts`
- Mapa de datos por slug: `src/pages/algorithms/AlgorithmCategory.tsx` (`dataMap`)
- Stats compartidas: `src/hooks/TrainerStatsStore.ts` (singleton)
- Regla de espejos: `src/utils/mirrorAlgorithm.ts`