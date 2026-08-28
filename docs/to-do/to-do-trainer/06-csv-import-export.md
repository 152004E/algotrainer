# 06 — Carga masiva: importar/exportar configuración en CSV

- **Prioridad:** Media
- **Estado:** pendiente

> Nota del ticket original: *"hacer carga masiva para importar o exportar toda
> la configuración en un archivo CSV como en csTimer"*.

## Contexto

Toda la configuración del usuario (sesiones, ajustes, preferencias) debe poder
**exportarse e importarse** en un archivo CSV. Así se puede respaldar, migrar
de dispositivo o compartir configuraciones. Sirve como "no guardar todo en
cache" (ver `07-sesiones.md`).

csTimer tiene un export/import de ajustes en texto; nuestra versión será CSV,
que es editable a mano (Excel/Sheets).

## Qué hay que hacer

- [ ] **Exportar**: botón que descarga un `.csv` con toda la configuración.
- [ ] **Importar**: botón que lee un `.csv` y restaura la configuración.
- [ ] Definir el **formato del CSV** (columnas) y documentarlo en `docs/`.
- [ ] Cubrir al menos:
      - Sesiones (nombre, modo, subset/casos, inspección, voz).
      - Ajustes de UI (tema, guías vistas).
      - Stats de sesión (tiempos, +2/DNF) — decidir si se exportan.
- [ ] Validación al importar: archivo inválido → error claro sin romper la app.
- [ ] `escaped CSV` (valores con comas/espacios) — no parsear a mano.

## Cómo / Diseño

- Nuevo utilitario: `src/utils/csvConfig.ts` con `exportConfig()` / `importConfig()`.
- Columnas propuestas (a refinar): `seccion`, `clave`, `valor` (formato de 3
  columnas, fácil de leer y expandir sin romper versiones viejas).
- Integración: botones en "Settings" (`TrainerSidebar` footer) y/o por sesión.

## Criterios de aceptación

- [ ] Exportar → importar en otro navegador/PC reproduce la configuración.
- [ ] El CSV se puede editar en Excel/Sheets y volver a importar.
- [ ] Un archivo corrupto genera un error claro, no una app rota.