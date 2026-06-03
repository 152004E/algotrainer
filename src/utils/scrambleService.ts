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

/** Combine two moves on the same face; returns "" if they cancel. */
function combineMoves(a: string, b: string): string {
  function power(suffix: string): number {
    if (suffix === "'") return 3;
    if (suffix === "2") return 2;
    return 1;
  }
  const face = a[0];
  const p = (power(a.slice(1)) + power(b.slice(1))) % 4;
  if (p === 0) return "";
  if (p === 1) return face;
  if (p === 2) return face + "2";
  return face + "'";
}

/**
 * Full simplification of a move string: removes/cancels any consecutive
 * moves on the same face, cascading until no redundant pairs remain.
 */
function simplifyMoves(algStr: string): string {
  const parts = algStr.trim().split(/\s+/).filter(Boolean);
  const result: string[] = [];
  for (const move of parts) {
    if (result.length > 0 && result[result.length - 1][0] === move[0]) {
      const combined = combineMoves(result.pop()!, move);
      if (combined) result.push(combined);
    } else {
      result.push(move);
    }
  }
  return result.join(" ");
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
  return new Alg(c.algorithm).invert().toString();
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
    const { target, correction } = await this.prepareTarget(c);

    // --- OLL 33 PLL variation: pick random PLL, build target ---
    let scrambleTarget = target;
    if (c.id === "oll-33") {
      const pllAlgs: { name: string; alg: string }[] = [
        { name: "skip", alg: "" },
        { name: "Ua",   alg: "R U' R U R U R U' R' U' R2" },
        { name: "Ub",   alg: "R2 U R U R' U' R' U' R' U R'" },
        { name: "Aa",   alg: "R' F R' B2 R F' R' B2 R2" },
        { name: "Ab",   alg: "R B' R F2 R' B R F2 R2" },
        { name: "E",    alg: "R' U' R U D' R2 U R' U R U' R U' R2 D" },
        { name: "F",    alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R" },
        { name: "Ga",   alg: "R2 U R' U R' U' R U' R2 U' D R' U R D'" },
        { name: "Gb",   alg: "R' U' R U D' R2 U R' U R U' R U' R2 D'" },
        { name: "Gc",   alg: "R2 U' R U' R U R' U R2 D' U R U' R' D" },
        { name: "Gd",   alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'" },
        { name: "H",    alg: "R2 U2 R U2 R2 U2 R2 U2 R U2 R2" },
        { name: "Ja",   alg: "R U R' F' R U R' U' R' F R2 U' R'" },
        { name: "Jb",   alg: "R' U2 R U R' U2 L U' R U L'" },
        { name: "Na",   alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" },
        { name: "Nb",   alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R" },
        { name: "Ra",   alg: "R U R' F' R U2 R' U2 R' F R U R U2 R'" },
        { name: "Rb",   alg: "R' U2 R U2 R' F R U R' U' R' F' R2 U'" },
        { name: "T",    alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
        { name: "V",    alg: "R' U R' U' B' R' B2 U' B' U B' R B R" },
        { name: "Y",    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
        { name: "Z",    alg: "R' U' R U' R U R U' R' U R U R2 U' R'" },
      ];
      const pll = pllAlgs[Math.floor(Math.random() * pllAlgs.length)];
      if (pll.alg) {
        const kp = await this.getKPuzzle();
        const setup = getEffectiveSetup(c);
        scrambleTarget = kp.defaultPattern()
          .applyAlg(new Alg(pll.alg))
          .applyAlg(new Alg(setup));
        if (correction) {
          scrambleTarget = scrambleTarget.applyAlg(new Alg(correction));
        }
      }
    }
    // -------------------------------------------

    const pertCount = 3 + Math.floor(Math.random() * 3);
    const pert = randomMoves(pertCount);
    const pertAlg = new Alg(pert);

    const perturbedTarget = scrambleTarget.applyAlg(pertAlg);
    const perturbedToSolved = await solveMin2Phase(perturbedTarget);
    const solvedToPerturbed = normalize(String(perturbedToSolved.invert()));
    const pertInverted = normalize(String(pertAlg.invert()));

    const scramble = simplifyMoves(
      [solvedToPerturbed, pertInverted, correction ? INVERSE[correction] : ""].join(" ")
    );

    // Rejection: if scramble collapsed to base setup, regenerate
    const base = normalize(getEffectiveSetup(c));
    if (scramble === base) {
      return this.generateScramble(c);
    }

    // Length constraint: max 20 moves (OLL 33 only — controlled test)
    if (c.id === "oll-33") {
      const len = scramble.trim().split(/\s+/).filter(Boolean).length;
      if (len > 20) {
        return this.generateScramble(c);
      }
    }

    return scramble;
  }

  /** Pre-warm the cache for a list of cases (call once on load). */
  async prewarm(cases: AlgoCase[]): Promise<void> {
    for (const c of cases) {
      await this.prepareTarget(c);
    }
  }
}

export const scrambleService = new ScrambleService();
