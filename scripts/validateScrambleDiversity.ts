import { scrambleService } from "../src/utils/scrambleService";
import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";
import type { KPuzzle } from "cubing/kpuzzle";
import OLLCases from "../src/data/OLLCases";

function lastN(s: string, n: number): string {
  const parts = s.trim().split(/\s+/);
  return parts.slice(-n).join(" ");
}

function getEffectiveSetup(alg: string): string {
  return new Alg(alg).invert().toString();
}

function uLayerEquals(a: any, b: any): boolean {
  const aE = JSON.stringify(a.patternData["EDGES"].pieces.slice(0, 4));
  const bE = JSON.stringify(b.patternData["EDGES"].pieces.slice(0, 4));
  if (aE !== bE) return false;
  const aC = JSON.stringify(a.patternData["CORNERS"].pieces.slice(0, 4));
  const bC = JSON.stringify(b.patternData["CORNERS"].pieces.slice(0, 4));
  return aC === bC;
}

/** Find consecutive same-face pairs that are redundant (e.g. U' U, U U', U2 U2). */
function countSeamRedundancies(s: string): number {
  const parts = s.trim().split(/\s+/);
  let count = 0;
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i][0] === parts[i + 1][0]) count++;
  }
  return count;
}

/** Check if a scramble equals the base setup + optional D-layer moves. */
function isDEquivalent(scramble: string, base: string): boolean {
  const sParts = scramble.trim().split(/\s+/).filter(Boolean);
  const bParts = base.trim().split(/\s+/).filter(Boolean);
  if (sParts.length < bParts.length) return false;

  // Check if the scramble starts with the base setup,
  // and the extra moves are only D-layer ones.
  const prefix = sParts.slice(0, bParts.length).join(" ");
  if (prefix !== base) return false;

  const suffix = sParts.slice(bParts.length);
  return suffix.every(m => m[0] === "D");
}

async function main() {
  console.log("\n" + "=".repeat(64));
  console.log("  SCRAMBLE DIVERSITY VALIDATION — OLL 33");
  console.log("  (boundary-only simplification, no dmove)");
  console.log("=".repeat(64));

  const oll33 = OLLCases.find((c) => c.id === "oll-33");
  if (!oll33) {
    console.log("\n  ✗ OLL 33 not found in data\n");
    process.exit(1);
  }

  const baseSetup = getEffectiveSetup(oll33.algorithm);
  console.log(`\n  Base setup (invert algorithm): ${baseSetup}`);
  console.log(`  Algorithm:                      ${oll33.algorithm}`);
  console.log(`\n  Generating ${100} scrambles...\n`);

  const kp: KPuzzle = await cube3x3x3.kpuzzle();
  await scrambleService.prewarm([oll33]);

  const scrambles: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < 100; i++) {
    try {
      const s = await scrambleService.generateScramble(oll33);
      scrambles.push(s);
    } catch (e) {
      errors.push(`#${i}: ${(e as Error)?.message ?? String(e)}`);
    }
  }

  if (errors.length > 0) {
    console.log(`  ✗ ${errors.length} generation errors:\n`);
    for (const e of errors.slice(0, 5)) console.log(`    ${e}`);
  }

  // --- 1. Pattern validation ---
  const expected = kp.defaultPattern().applyAlg(new Alg(baseSetup));
  let patternOk = 0, patternFail = 0;
  for (const s of scrambles) {
    const actual = kp.defaultPattern().applyAlg(new Alg(s));
    if (uLayerEquals(expected, actual)) patternOk++;
    else patternFail++;
  }
  console.log(`  1. U-layer correct: ${patternOk}/${scrambles.length} (${(patternOk / scrambles.length * 100).toFixed(1)}%)`);
  if (patternFail > 0) console.log(`     ✗ ${patternFail} scrambles produced wrong U-layer`);

  // --- 2. Unique scrambles ---
  const unique = new Set(scrambles);
  console.log(`  2. Unique scrambles: ${unique.size}/${scrambles.length} (${(unique.size / scrambles.length * 100).toFixed(1)}%)`);

  if (unique.size < scrambles.length) {
    const counts = new Map<string, number>();
    for (const s of scrambles) counts.set(s, (counts.get(s) ?? 0) + 1);
    const dups = [...counts.entries()].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]);
    console.log(`     Duplicates:`);
    for (const [s, c] of dups.slice(0, 5)) {
      console.log(`       ${c}x: ${s.substring(0, 50)}...`);
    }
  }

  // --- 3. Last-N suffix diversity ---
  const suffixes10 = scrambles.map((s) => lastN(s, 10));
  const uniq10 = new Set(suffixes10);
  console.log(`  3. Unique last-10 suffixes: ${uniq10.size}/${scrambles.length} (${(uniq10.size / scrambles.length * 100).toFixed(1)}%)`);

  if (uniq10.size <= 5) {
    console.log(`     ⚠ Very low diversity in last-10 suffixes`);
    const counts = new Map<string, number>();
    for (const sfx of suffixes10) counts.set(sfx, (counts.get(sfx) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    console.log(`     Top repetitions:`);
    for (const [sfx, c] of sorted.slice(0, 10)) {
      console.log(`       ${c}x: ${sfx}`);
    }
  }

  // --- 4. Last-5-move frequency ---
  const suffixes5 = scrambles.map((s) => lastN(s, 5));
  const uniq5 = new Set(suffixes5);
  console.log(`  4. Unique last-5 suffixes: ${uniq5.size}/${scrambles.length} (${(uniq5.size / scrambles.length * 100).toFixed(1)}%)`);

  // --- 5. Seam redundancy (expected from boundary-only) ---
  const redundancies = scrambles.map(countSeamRedundancies);
  const totalRedundantPairs = redundancies.reduce((a, b) => a + b, 0);
  const avgRedundant = (totalRedundantPairs / scrambles.length).toFixed(1);
  const maxRedundant = Math.max(...redundancies);
  const minRedundant = Math.min(...redundancies);
  console.log(`  5. Seam-redundant pairs (same-face adjacent): avg=${avgRedundant}, min=${minRedundant}, max=${maxRedundant}`);
  console.log(`     (expected: ~1 pair from pert/invert boundary; not a failure)`);

  // --- 6. Scramble length stats ---
  const lengths = scrambles.map(s => s.trim().split(/\s+/).length);
  const avgLen = (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1);
  const baseLen = baseSetup.trim().split(/\s+/).length;
  console.log(`  6. Base setup length: ${baseLen} moves`);
  console.log(`     Scramble length: avg=${avgLen}, min=${Math.min(...lengths)}, max=${Math.max(...lengths)}`);

  // --- 7. D-equivalence check ---
  let dEqCount = 0;
  for (const s of scrambles) {
    if (isDEquivalent(s, baseSetup)) dEqCount++;
  }
  console.log(`  7. D-equivalent scrambles (base + D-move): ${dEqCount}/${scrambles.length}`);
  console.log(`     (should be 0 without dmove suffix)`);

  // --- 8. Sample scrambles ---
  console.log(`\n  8. Sample scrambles (first 5):`);
  for (let i = 0; i < Math.min(5, scrambles.length); i++) {
    console.log(`     [${i + 1}] ${scrambles[i]}`);
  }

  // --- 9. Final verdict ---
  const diversityOk = uniq10.size > 10;
  console.log(`\n  ${"=".repeat(64)}`);
  if (patternOk === scrambles.length && diversityOk && dEqCount === 0) {
    console.log(`  ✅ ALL CHECKS PASSED — ${unique.size} unique, ${uniq10.size} unique last-10, 0 D-equivalent`);
  } else if (patternOk < scrambles.length) {
    console.log(`  ✗ FAILED — ${patternFail} scrambles with wrong U-layer`);
  } else if (dEqCount > 0) {
    console.log(`  ⚠ WARNING — ${dEqCount} scrambles D-equivalent to base`);
  } else {
    console.log(`  ⚠ WARNING — Only ${uniq10.size} unique last-10 suffixes (low diversity)`);
  }
  console.log(`  ${"=".repeat(64)}\n`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
