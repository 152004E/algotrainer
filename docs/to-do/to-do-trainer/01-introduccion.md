# 01 — Introducción: qué hay que hacer en el trainer

- **Prioridad:** Alta
- **Estado:** pendiente
- **Propósito:** documento de arranque. Explica la visión del trainer y las
  tareas principales para que Elian (y cualquiera) sepa qué se va a construir.

## Visión

El trainer de AlgoTrainer debe sentirse **profesional** y parecerse a
[csTimer](https://github.com/cs0x7f/cstimer) en lo único que csTimer hace bien:
el flujo de entrenamiento real con cronómetro, inspección y estadísticas.

Hoy el trainer es inconsistente:

- **WV** ya tiene el modo interactivo por fases (reconocer → ejecutar →
  feedback) con cubo virtual. Ver `src/pages/trainer/WVTrainer.tsx`.
- **OLL / PLL / MW / F2L** son pasivos: muestran scramble, revelan algoritmo,
  siguiente caso. Ver `src/hooks/useTrainer.ts`.

La meta es un trainer único, configurable y con **3 modos** (ver `03-modos-fisico-virtual.md`)
que consuma los mismos datos que la ruta `/algorithms`.

## Qué hay que hacer (resumen de tareas)

1. **Consumir los algoritmos de la ruta `/algorithms`** — que todo subset del
   catálogo (F2L, OLL, PLL, WV, MW, COLL, SV, BLE…) aparezca y se pueda entrenar.
   → `02-consumir-algoritmos.md`
2. **3 modos de entrenamiento** — pasivo/reconocimiento, cubo físico
   cronometrado y cubo virtual interactivo (teclado + cronómetro configurable).
   → `03-modos-fisico-virtual.md`
3. **Inspección estilo WCA** — sin inspección, 15s hacia abajo, 15s hacia
   arriba; voz configurable (aviso en 12 y 8, como csTimer); penalizaciones
   **+2** y **DNF** (didn't finish) para imagen profesional.
   → `04-inspeccion-wca.md`
4. **Modales guía** para primeros usuarios (onboarding).
   → `05-modales-guia.md`
5. **Carga masiva** — importar/exportar toda la configuración en un CSV.
   → `06-csv-import-export.md`
6. **Sesiones de entrenamiento** — varias sesiones nombradas (ej. "Sesión WV"),
   cada una con su configuración y stats.
   → `07-sesiones.md`

## Estado actual del código (base de trabajo)

| Archivo | Rol | Estado |
|---------|-----|--------|
| `src/hooks/useExecutionTrainer.ts` | Máquina de fases + verificación | ✓ Funcional (WV) |
| `src/hooks/useTrainer.ts` | Trainer pasivo | ✓ Funcional (OLL/PLL/MW/F2L) |
| `src/hooks/useScrambledTrainer.ts` | Trainer pasivo con scrambles dinámicos | ✓ Implementado, sin integrar |
| `src/hooks/TrainerStatsStore.ts` | Stats compartidas (singleton) | ⚠ Mezcla stats entre trainers |
| `src/Components/trainer/CubeViewer.tsx` | Cubo virtual (twisty-player) | ✓ Interactivo |
| `src/utils/verifySolve.ts` | Verificación por estado | ✓ 135/135 checks |
| `src/data/algorithmCatalog.ts` | Catálogo de subsets | ⚠ Counts desincronizados |

## Criterios de aceptación (globales)

- El trainer se siente constante: mismo flujo y mismas opciones en todos los subsets.
- Las stats son **por sesión** y no se mezclan entre trainers.
- No hay fricción para un usuario nuevo (modales guía).
- El flujo de inspección/cronómetro se comporta como csTimer.