# Reglas & Guías

## Comunicación
- Modo cavernícola: técnico, sin relleno, una palabra si basta
- Código/commits: claridad normal

## Código
- Componentes funcionales solamente
- Tailwind solamente (no CSS modules, no styled-components)
- Props > Context (excepto anidamiento muy profundo)
- State local para concerns del componente
- No comentarios salvo que el WHY no sea obvio
- Sin abstracciones más allá del scope de la tarea
- Confiar en garantías internas, validar solo en boundaries
- Default: sin manejo de errores para estados imposibles
- 3 líneas similares > abstracción prematura

## Scramble Generation (reglas fijas)

### RESTRICCIONES DE MOVIMIENTOS
- Solo `U D R L F B + ' 2` — NADA más
- Prohibido: `x y z` (rotaciones), u d r l f b Uw Rw (wide), M E S (slice)
- Prohibido: sufijo `D`/`D2`/`D'` al final del scramble (desalinea visual)

### ORIENTACIÓN
- Frente = Verde, Arriba = Blanco (centers standard: U=0 L=1 F=2 R=3 B=4 D=5)

### GET EFFECTIVE SETUP
- Siempre `invert(algorithm)`, NUNCA `c.scramble`
- Bug OLL 33: `scramble === algorithm` (ambos `R U R' U' R' F R F'`)
- `invert(algorithm)` es la única fuente de verdad

### ALGORITMO DE SCRAMBLE
- Kociemba composition: `solvedToPerturbed + pertInverted`
- Perturbación: `randomMoves(3-5)` con caras alternadas
- Simplificación: boundary-only entre segmentos, SIN cascade
- Center correction: si centers tienen y/y'/y2, aplicar y deshacer
- Rejection guard: si scramble === base setup, regenerar

### NO HACER
- No modificar `AlgoCase` type
- No migrar datos existentes
- No añadir comentarios de código a menos que sea necesario
- No usar `solveTwips` (reemplazado por `experimentalSolve3x3x3IgnoringCenters`)
- No aplicar `simplifyMoves` completo al scramble (mata diversidad)

## Testing & Review
- La validación tipográfica verifica corrección
- UI changes need browser test before done
- Golden path + edge cases
- Monitor for regressions

## Commits
- **El agente nunca hace commits. Solo el usuario.** Cuando el trabajo esté listo, avisar con "listo para commitear"
- Clear purpose: what + why
- One fix per commit (unless bundled refactor makes sense)
- No "used by X" comments (belongs in PR, not commit)

## Performance
- Editar archivos existentes, no crear nuevos
- Tool calls paralelos cuando sean independientes
- Comprimir conversaciones largas con subagents
