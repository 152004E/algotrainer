import { cube3x3x3 } from "cubing/puzzles";
import { experimentalSolveTwips } from "cubing/search";
import { KPattern } from "cubing/kpuzzle";
import { Alg } from "cubing/alg";
import type { KPuzzle } from "cubing/kpuzzle";

// ── Configuration ───────────────────────────────────────────────

interface TestCase {
  name: string;
  scramble: string;
  algorithm: string;
}

const TEST_CASES: TestCase[] = [
  {
    name: "OLL 1 (scramble ≠ algorithm)",
    scramble: "R U2 R2 F R F' U2 R' F R F'",
    algorithm: "R U2' R2' F R F' U2 R' F R F'",
  },
  {
    name: "OLL 33 (scramble == algorithm)",
    scramble: "R U R' U' R' F R F'",
    algorithm: "R U R' U' R' F R F'",
  },
  {
    name: "PLL H (slice moves M2')",
    scramble: "M2' U M2' U2 M2' U M2'",
    algorithm: "M2' U M2' U2 M2' U M2'",
  },
  {
    name: "MW 1 (scramble ≠ algorithm)",
    scramble: "R U R' U R U' R'",
    algorithm: "R U' R' U' R U R'",
  },
  {
    name: "F2L 1 (scramble == algorithm)",
    scramble: "R U R' U'",
    algorithm: "R U R' U'",
  },
  {
    name: "WV (empty scramble — uses invert(algorithm))",
    scramble: "",
    algorithm: "R U R'",
  },
];

const NUM_ITERATIONS = 20;
const PERTURBATION_MOVES = [3, 4, 5];

// ── Random Move Generator ──────────────────────────────────────

const FACES = ["U", "D", "R", "L", "F", "B"];
const MODIFIERS = ["", "'", "2"];

function randomMoves(count: number): string {
  const moves: string[] = [];
  let lastFace = "";
  for (let i = 0; i < count; i++) {
    let face: string;
    do {
      face = FACES[Math.floor(Math.random() * FACES.length)];
    } while (face === lastFace);
    lastFace = face;
    const mod = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    moves.push(face + mod);
  }
  return moves.join(" ");
}

// ── Scramble Generation Logic ──────────────────────────────────

function getEffectiveSetup(testCase: TestCase): string {
  if (testCase.scramble) {
    return testCase.scramble;
  }
  // For empty scramble (WV), derive from algorithm inverse
  return new Alg(testCase.algorithm).invert().toString();
}

async function generateScramble(
  kp: KPuzzle,
  casePattern: KPattern,
  effectiveSetup: string
): Promise<string> {
  // Apply a random perturbation to the case pattern
  const numMoves =
    PERTURBATION_MOVES[Math.floor(Math.random() * PERTURBATION_MOVES.length)];
  const r = randomMoves(numMoves);
  const perturbed = casePattern.applyAlg(new Alg(r));

  // Solve from perturbed pattern back to the case pattern.
  // Without generatorMoves (causes Rust panic in solver), we let the
  // solver use all moves including wide moves.
  const solution = await experimentalSolveTwips(kp, perturbed, {
    targetPattern: casePattern,
    minDepth: 6,
    maxDepth: 12,
  });

  // The full scramble: setup + perturbation + solution.
  // From solved: apply setup → reach case, apply R → perturb, apply solution → back to case.
  // Note: The solution may contain wide moves (u, r, x, etc.) because the
  // solver generatorMoves option causes a Rust panic in the WASM solver.
  return `${effectiveSetup}  ${r}  ${solution}`;
}

// ── Per-case Validation ────────────────────────────────────────

interface CaseResult {
  pass: number;
  fail: number;
  totalTimeMs: number;
  failures: { index: number; scramble: string; error: string }[];
}

async function validateCase(
  kp: KPuzzle,
  testCase: TestCase,
  iterations: number
): Promise<CaseResult> {
  const effectiveSetup = getEffectiveSetup(testCase);
  const originalPattern = kp.defaultPattern().applyAlg(new Alg(effectiveSetup));

  let pass = 0;
  let fail = 0;
  let totalTimeMs = 0;
  const failures: CaseResult["failures"] = [];

  process.stdout.write(`\n  ── ${testCase.name} ──\n`);
  process.stdout.write(`  Setup: ${effectiveSetup}\n`);
  process.stdout.write(`  Iterations: ${iterations}\n\n`);

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      const scramble = await generateScramble(kp, originalPattern, effectiveSetup);
      const elapsed = performance.now() - start;
      totalTimeMs += elapsed;

      const generatedPattern = kp.defaultPattern().applyAlg(new Alg(scramble));
      const equal = originalPattern.isIdentical(generatedPattern);

      if (equal) {
        pass++;
        process.stdout.write(`  \u2713 #${String(i + 1).padStart(2, " ")}: PASS  (${elapsed.toFixed(0)}ms)\n`);
      } else {
        fail++;
        process.stdout.write(`  \u2717 #${String(i + 1).padStart(2)}: FAIL  (${elapsed.toFixed(0)}ms)\n`);
        process.stdout.write(`    Scramble: ${scramble}\n`);
        failures.push({ index: i + 1, scramble, error: "Pattern mismatch after applying full scramble" });
      }
    } catch (err) {
      fail++;
      const msg = err instanceof Error ? err.message : String(err);
      process.stdout.write(`  \u2717 #${String(i + 1).padStart(2)}: ERROR (${msg})\n`);
      failures.push({ index: i + 1, scramble: "", error: msg });
    }
  }

  const avgTime = totalTimeMs / iterations;
  process.stdout.write(`  \u2192 ${pass}/${iterations} passed  (avg ${avgTime.toFixed(0)}ms)\n`);

  return { pass, fail, totalTimeMs, failures };
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("");
  console.log("=".repeat(64));
  console.log("  SCRAMBLE GENERATION VALIDATION");
  console.log("=".repeat(64));
  console.log(`\n  Cases:      ${TEST_CASES.length}`);
  console.log(`  Iterations: ${NUM_ITERATIONS} per case`);
  console.log(`  Perturb:    ${PERTURBATION_MOVES.join("-")} random moves\n`);

  const kp = await cube3x3x3.kpuzzle();

  let grandPass = 0;
  let grandFail = 0;
  let grandTimeMs = 0;
  const allFailures: { caseName: string; failures: CaseResult["failures"] }[] = [];

  for (const testCase of TEST_CASES) {
    const result = await validateCase(kp, testCase, NUM_ITERATIONS);
    grandPass += result.pass;
    grandFail += result.fail;
    grandTimeMs += result.totalTimeMs;
    if (result.failures.length > 0) {
      allFailures.push({ caseName: testCase.name, failures: result.failures });
    }
  }

  const total = grandPass + grandFail;
  const overallAvg = grandTimeMs / total;
  const passRate = total > 0 ? (grandPass / total) * 100 : 0;

  console.log("\n" + "=".repeat(64));
  console.log("  FINAL RESULTS");
  console.log("=".repeat(64));
  console.log(`  Total scrambles: ${total}`);
  console.log(`  Passed:          ${grandPass}`);
  console.log(`  Failed:          ${grandFail}`);
  console.log(`  Pass rate:       ${passRate.toFixed(1)}%`);
  console.log(`  Avg time:        ${overallAvg.toFixed(0)}ms per scramble`);
  console.log("=".repeat(64));

  if (allFailures.length > 0) {
    console.log("\n  \u2717 FAILURES BY CASE:\n");
    for (const { caseName, failures } of allFailures) {
      console.log(`  [${caseName}]`);
      for (const f of failures) {
        console.log(`    #${f.index}: ${f.error}`);
        if (f.scramble) console.log(`    Scramble: ${f.scramble}`);
        console.log("");
      }
    }
    process.exit(1);
  } else {
    console.log("\n  \u2705 ALL TESTS PASSED\n");
  }
}

main().catch((err) => {
  console.error("\n  FATAL:", err);
  process.exit(1);
});
