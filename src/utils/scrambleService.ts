import { cube3x3x3 } from "cubing/puzzles";
import { experimentalSolve3x3x3IgnoringCenters as solveMin2Phase } from "cubing/search";
import { Alg } from "cubing/alg";
import type { KPuzzle, KPattern } from "cubing/kpuzzle";
import type { AlgoCase } from "../types";

const FACES = ["U", "D", "R", "L", "F", "B"];
const MODIFIERS = ["", "'", "2"];

function normalize(s: string): string {
  return s.replace(/([UDFRLB])2'/g, "$12");
}

function randomMoves(count: number): string {
  const m: string[] = [];
  let last = "";
  for (let i = 0; i < count; i++) {
    let f: string;
    do {
      f = FACES[Math.floor(Math.random() * FACES.length)];
    } while (f === last);
    last = f;
    m.push(f + MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)]);
  }
  return m.join(" ");
}

function getEffectiveSetup(c: AlgoCase): string {
  return c.scramble || new Alg(c.algorithm).invert().toString();
}

/**
 * Detect the cube rotation from center permutation and return the
 * rotation alg that, when applied to the raw target, yields standard centers.
 *
 * The returned `correction` is used:
 *   correctedTarget = rawTarget.applyAlg(correction)
 *
 * The scramble suffix to go back from corrected → raw is invert(correction):
 *   scramble = prefix + solvedToTarget + invert(correction)
 *
 * Standard centers: U=0 L=1 F=2 R=3 B=4 D=5
 *   [0,4,1,2,3,5] = y rotation     → correction = "y"
 *   [0,2,3,4,1,5] = y' rotation    → correction = "y'"
 *   [0,3,4,1,2,5] = y2 rotation    → correction = "y2"
 */
function detectCenterCorrection(centers: number[]): string {
  if (centers[0] !== 0 || centers[5] !== 5) return "";
  const key = centers.slice(1, 5).join(",");
  const map: Record<string, string> = {
    "1,2,3,4": "",
    "4,1,2,3": "y",
    "2,3,4,1": "y'",
    "3,4,1,2": "y2",
  };
  return map[key] ?? "";
}

const INVERSE: Record<string, string> = { "y": "y'", "y'": "y", "y2": "y2" };

function hasStandardCenters(centers: number[]): boolean {
  return centers.every((c, i) => c === i);
}

export class ScrambleService {
  private kp: KPuzzle | null = null;
  private targetCache = new Map<string, { target: KPattern; correction: string }>();

  private async getKPuzzle(): Promise<KPuzzle> {
    if (!this.kp) {
      this.kp = await cube3x3x3.kpuzzle();
    }
    return this.kp;
  }

  private getCaseKey(c: AlgoCase): string {
    return c.id;
  }

  private async prepareTarget(c: AlgoCase): Promise<{
    target: KPattern;
    correction: string;
  }> {
    const key = this.getCaseKey(c);
    const cached = this.targetCache.get(key);
    if (cached) return cached;

    const kp = await this.getKPuzzle();
    const setup = getEffectiveSetup(c);
    const rawTarget = kp.defaultPattern().applyAlg(new Alg(setup));

    const centers = rawTarget.patternData["CENTERS"].pieces as number[];
    const correction = hasStandardCenters(centers) ? "" : detectCenterCorrection(centers);
    const target = correction ? rawTarget.applyAlg(new Alg(correction)) : rawTarget;

    const result = { target, correction };
    this.targetCache.set(key, result);
    return result;
  }

  async generateScramble(c: AlgoCase): Promise<string> {
    const kp = await this.getKPuzzle();
    const { target, correction } = await this.prepareTarget(c);

    const pertCount = 3 + Math.floor(Math.random() * 3);
    const pert = randomMoves(pertCount);
    const pertInverted = normalize(String(new Alg(pert).invert()));

    const targetToSolved = await solveMin2Phase(target);
    const solvedToTarget = normalize(String(targetToSolved.invert()));

    let scramble: string;
    if (correction) {
      scramble = `${pert} ${pertInverted} ${solvedToTarget} ${INVERSE[correction]}`;
    } else {
      scramble = `${pert} ${pertInverted} ${solvedToTarget}`;
    }

    return normalize(scramble.trim().replace(/  +/g, " "));
  }

  /** Pre-warm the cache for a list of cases (call once on load). */
  async prewarm(cases: AlgoCase[]): Promise<void> {
    for (const c of cases) {
      await this.prepareTarget(c);
    }
  }
}

export const scrambleService = new ScrambleService();
