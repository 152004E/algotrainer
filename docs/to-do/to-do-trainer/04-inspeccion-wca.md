# 04 — Inspección estilo WCA + voz configurable + penalizaciones (+2 / DNF)

- **Prioridad:** Alta
- **Estado:** pendiente

> Nota del ticket original: *"seguir configuraciones y tomar como ejemplo
> csTimer con respecto a la inspección de la WCA, al +2 y al DNF (didn't finish)
> para tener una imagen más profesional"*.

## Contexto

csTimer es el estándar de facto para cronómetro de speedcubing. Su flujo clave:

1. Aparece el scramble.
2. **Inspección** (opcional): cuenta regresiva con avisos de voz.
3. El usuario resuelve y **detiene el cronómetro** (espacio o botón).
4. El resultado se guarda y se puede marcar +2 / DNF.

Para AlgoTrainer esto da la imagen profesional que buscamos.

## Qué hay que hacer

### Opciones de inspección

- [ ] **Tres modalidades**:
      1. **Sin inspección** (cronómetro arranca directo cuando el usuario quiera).
      2. **15s hacia abajo**: rango menor pasado a 15s (ej. 5 / 10 / 12 / 15).
      3. **15s hacia arriba**: rango de 15s en adelante (ej. 15 / 17 / 20 / 25).
      Es decir: el usuario configura la duración de la inspección, con 15s
      como el estándar WCA por defecto.
- [ ] La inspección arranca al aparecer el caso y **bloquea el cronómetro de
      resolución** hasta que termine el countdown.

### Voz configurable

- [ ] Avisos de voz configurables (encendido/apagado, umbrales editables).
- [ ] Ejemplo base como csTimer: avisar en **12s** y **8s** restantes
      ("12 segundos", "8 segundos"). Umbrales editables por el usuario.
- [ ] Usar la Web Speech API (`speechSynthesis`) o un beep; decidir si la voz
      es en español (UI de la app está en español).

### Penalizaciones (+2 y DNF)

- [ ] Después de parar el cronómetro, opciones **OK / +2 / DNF**.
- [ ] **+2**: se suma 2 segundos al tiempo.
- [ ] **DNF (Did Not Finish)**: el intento no cuenta como tiempo válido (pero sí
      queda registrado en stats como fallo).
- [ ] Reglas WCA como referencia documentada en la UI (tooltip).
- [ ] Al menos las reglas básicas:
      - +2: sobrepasó 45° de una capa, etc. (para el MVP: marcado manual).
      - DNF: se detuvo el cronómetro sin terminar, se marcó mal un resultado.

## Cómo / Diseño

- Nuevo componente cronómetro/inspección (p. ej. `src/Components/trainer/Timer/`):
  - estados: `idle | inspecting | solving | stopped`.
  - callbacks de inbounda para `onFinishInspection`, `onStop`.
- Compartido entre el **modo físico** y el **modo virtual** (el modo virtual ya
  mide `executionTime` en `useExecutionTrainer`, hay que integrarlo con el timer).
- Guardar `+2`/`DNF` en `CaseAttempt` / `SessionStats` (ver `07-sesiones.md`).

## Criterios de aceptación

- [ ] Inspección con 3 modalidades y duración configurable (15s default).
- [ ] Voz avisa en los umbrales configurados (ej. 12 y 8) igual que csTimer.
- [ ] El cronómetro puede marcar OK / +2 / DNF y las stats lo reflejan.
- [ ] Funciona igual en modo físico y virtual.