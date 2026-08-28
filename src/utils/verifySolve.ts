import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";
import type { KPuzzle, KPattern } from "cubing/kpuzzle";

const AUF = ["", "U", "U'", "U2"];

let kp: KPuzzle | null = null;

async function getKPuzzle(): Promise<KPuzzle> {
  if (!kp) kp = await cube3x3x3.kpuzzle();
  return kp;
}

export interface SolveVerification {
  /** True si los movimientos del usuario resuelven el caso (o el cubo completo). */
  solved: boolean;
  /** True si el estado final coincide exactamente con el del algoritmo de resolución (tolerando AUF). */
  exact: boolean;
}

/**
 * Compara el efecto de los movimientos del usuario contra el efecto del
 * algoritmo de resolución, ambos aplicados sobre el estado del scramble.
 *
 * Comparación por efecto (no por string): dos secuencias distintas pero
 * equivalentes cuentan como correctas. Se tolera AUF (rotaciones de la capa
 * superior) y también se acepta un cubo totalmente resuelto (ejecutar el
 * algoritmo + resolver el PLL residual de la variación PLL).
 */
export async function verifySolve(
  scramble: string,
  userMoves: string,
  solution: string,
): Promise<SolveVerification> {
  const kpuzzle = await getKPuzzle();
  const start = kpuzzle.defaultPattern();
  const expected = start.applyAlg(new Alg(scramble)).applyAlg(new Alg(solution));

  let actual: KPattern;
  try {
    actual = start.applyAlg(new Alg(scramble)).applyAlg(new Alg(userMoves || ""));
  } catch {
    return { solved: false, exact: false };
  }

  const solved = kpuzzle.defaultPattern();

  for (const auf of AUF) {
    if (actual.applyAlg(new Alg(auf)).isIdentical(expected)) {
      return { solved: true, exact: true };
    }
    if (actual.applyAlg(new Alg(auf)).isIdentical(solved)) {
      return { solved: true, exact: false };
    }
  }

  return { solved: false, exact: false };
}
