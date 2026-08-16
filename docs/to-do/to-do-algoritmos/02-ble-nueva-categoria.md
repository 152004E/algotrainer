# 02 — Nueva categoría: BLE (Brooks' Last Edge)

- **Prioridad:** Alta
- **Estado:** pendiente (nombre confirmado)

> Nota del ticket original: *"hacer otra categoría que es algo como 'block last',
> el nombre [hay que] investigarlo"*.

## Contexto

La categoría nueva es **BLE = Brooks' Last Edge**:

> Insertar la **última arista del F2L** mientras **orientas las esquinas de la
> última capa**. Es un set de last-slot, pariente de WV/SV.

Se investigó el nombre y se confirmó con el usuario que es BLE (no OLS/VLS/ZBLS).

- No existe dataset ni categoría de BLE en la app todavía.
- `algorithmCategories` (`src/data/algorithmCatalog.ts`) no lo lista.

## Qué hay que hacer

- [ ] Investigar el set BLE y documentar:
      - Cantidad de casos (y si cuentan espejos).
      - Pareja separada/contexto ("insertar última arista" — cómo se monta el case).
      - Fuentes de algoritmos (alg.cubing.net, algdb.net, guías).
- [ ] Crear `src/data/BLECases.ts` siguiendo la forma `AlgoCase[]` y las
      convenciones de WV: casos canónicos **diestros**, `scramble: ""` + usar
      `invert(algorithm)` si aplica, `id: "ble-01"…`.
- [ ] Agregar la categoría al catálogo (`slug: "ble"` con icono, filtros, count).
- [ ] Registrar en `dataMap` de `src/pages/algorithms/AlgorithmCategory.tsx`.
- [ ] Validar con script de verificación (estilo `verifyWVCases.ts`).
- [ ] Espejos zurdos al final (ver `06-espejo-a-todos.md`).

## Criterios de aceptación

- [ ] El dataset BLE está completo y validado (scramble → caso, algoritmo → resolución).
- [ ] La categoría aparece en `/algorithms` y en el trainer (Tarea 1 de trainer).
- [ ] Casos canónicos diestros; zurdos derivados con `mirrorAlgorithm()`.