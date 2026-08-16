# 07 — Sesiones de entrenamiento (como csTimer)

- **Prioridad:** Alta
- **Estado:** pendiente

> Nota del ticket original: *"hacer sesiones de entrenamiento, como csTimer,
> para tener diferentes sesiones en donde se pueda entrenar, ejemplo una sesión
> llamada 'sesión WV' que se practique solo esa, y que todas las configuraciones
> se guarden en el archivo CSV para no guardarlo en cache"*.

## Contexto

Hoy las stats son globales y se mezclan: `trainerStatsStore` es un **singleton**
(`src/hooks/TrainerStatsStore.ts`) y `TrainerSidebar` muestra lo que se publicó
en último lugar. Si entrenás WV y después OLL, los números se mezclan.

Una **sesión** es el contenedor natural: cada sesión tiene nombre, qué
casos/subset practica, su modo, su configuración de inspección/voz y sus
**stats propias** (tiempos, +2/DNF, aciertos).

## Qué hay que hacer

- [ ] Modelo de **sesión**: `{ id, nombre, caso: slug | lista de caseIds, modo,
      configInspeccion, configVoz, stats }`.
- [ ] Crear / seleccionar / duplicar / borrar sesiones.
- [ ] Sesión por subset (ej. "Sesión WV" practica solo WV) **y** sesiones mixtas
      con casos sueltos de varias categorías (ver `to-do-general/02-favoritos.md`).
- [ ] Cada sesión mantiene **sus stats** (resolver el singleton de
      `trainerStatsStore` → estado por sesión).
- [ ] Persistir sesiones + configuración en el **CSV** (ver `06-csv-import-export.md`)
      para respaldo; en localStorage solo lo mínimo para no perder nada al recargar.
- [ ] UI: selector de sesión (dropdown o pestaña) + botón "Nueva sesión".

## Cómo / Diseño

- Refactor mínimo de stats:
  - `trainerStatsStore` pasa a recibir un **id de sesión** (o el sidebar se
    suscribe a la sesión activa en lugar del singleton global).
- Detección de sesión activa: pareja `useSession` + estado en un contexto
  (hay `TrainerContext.tsx` muerto que podría reactivarse con este propósito).
- Sesiones "mixtas": el trainer debe aceptar un `AlgoCase[]` arbitrario
  (arranca de la Tarea 1: consumir del catálogo).

## Criterios de aceptación

- [ ] Creo "Sesión WV", entreno, y las stats no afectan a la "Sesión OLL".
- [ ] Una sesión mixta (casos de OLL+WV+PLL) se practica como una lista.
- [ ] Todas las sesiones aparecen en el CSV de export/import.
- [ ] Recargar la página conserva la sesión activa y sus stats.