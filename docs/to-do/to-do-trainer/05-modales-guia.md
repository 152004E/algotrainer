# 05 — Modales guía (onboarding para primeros usuarios)

- **Prioridad:** Media
- **Estado:** pendiente

## Contexto

Un usuario nuevo no conoce los 3 modos, la inspección WCA, las teclas del cubo
virtual ni las sesiones. Hoy la app no explica nada: el trainer arranca directo.

## Qué hay que hacer

- [ ] **Modal de bienvenida** (primer uso por sesión de navegador):
      - Cómo elegir un subset.
      - Los 3 modos (pasivo / físico / virtual) en 1 pantalla simple.
- [ ] **Guía del modo virtual**: teclas (`U D R L F B`, `Shift` inversa,
      `2` doble, `Space` comprobar) + cómo funciona el feedback.
- [ ] **Guía del cronómetro/inspección**: qué es la inspección, +2 y DNF.
- [ ] Acceso a las guías **en cualquier momento** (botón "?" / "Ayuda") — hoy
      `TrainerToolsSidebar` tiene botones `?` y `⌨` sin función.
- [ ] Botón "No mostrar más" + opción de reactivar desde ajustes.
- [ ] No bloquear el flujo: el modal puede cerrarse y el trainer queda usable.

## Cómo / Diseño

- Reusar componentes modales existentes (ver `src/Components/algorithms/AlgorithmModal.tsx`
  y `src/Components/Modals/TrainerModal.tsx` como referencia de estilos).
- Nuevo directorio sugerido: `src/Components/trainer/Guides/`.
- Persistencia simple: `localStorage` con clave `algotrainer:onboarding:v1`.

## Criterios de aceptación

- [ ] Un usuario nuevo llega al trainer y en <30s sabe qué hace cada modo.
- [ ] Las guías son accesibles y reactivables.
- [ ] No interrumpen el entrenamiento si se cierran.