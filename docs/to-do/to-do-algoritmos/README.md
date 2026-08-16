# To-Do Algoritmos

Índice de tareas de la base de algoritmos. Prioridad por orden de archivo.

- [ ] `01-mw.md` — Terminar Magic Wonderful (MW)
- [ ] `02-ble-nueva-categoria.md` — Nueva categoría: BLE (Brooks' Last Edge)
- [ ] `03-summer-variation.md` — Summer Variation (SV)
- [ ] `04-coll.md` — COLL (categoría existe, falta el dataset)
- [ ] `05-f2l.md` — Terminar/verificar F2L
- [ ] `06-espejo-a-todos.md` — Espejo zurdo para todos + consumo en el trainer

## Regla de dominio (NO re-explicar en cada chat)

- Todo subset (WV, MW, OLL, PLL) tiene casos a la derecha y a la izquierda.
  Los datos guardan el caso canónico (diestro); la variante zurda se deriva con
  `mirrorAlgorithm()` (`src/utils/mirrorAlgorithm.ts`).
- La doc de `docs/*.md` tiende a desactualizarse: fuente de verdad = regla + código.

## Datasets actuales (`src/data/`)

| Subset | Archivo | Casos | Estado |
|--------|---------|-------|--------|
| F2L | `f2lCases.ts` | 42 | ✓ poblado (validar) |
| WV | `WVCases.ts` | 27 | ✓ validado (165/165) |
| MW | `MWCases.ts` | 41 | ⚠ terminar/validar |
| OLL | `OLLCases.ts` | 57 | ✓ poblado |
| PLL | `PLLCases.ts` | 21 | ✓ poblado |
| COLL | — | — | ✗ falta dataset (catálogo ya existe) |
| SV | — | — | ✗ falta crear |
| BLE | — | — | ✗ falta crear (investigar) |