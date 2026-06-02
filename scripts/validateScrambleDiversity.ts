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

async function main() {
  console.log("\n" + "=".repeat(64));
  console.log("  SCRAMBLE DIVERSITY VALIDATION — OLL 33");
  console.log("=".repeat(64));

  const oll33 = OLLCases.find((c) => c.id === "oll-33");
  if (!oll33) {
    console.log("\n  ✗ OLL 33 not found in data\n");
    process.exit(1);
  }

  console.log(`\n  Scramble (from invert algorithm): ${getEffectiveSetup(oll33.algorithm)}`);
  console.log(`  Algorithm:                        ${oll33.algorithm}`);
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
  const expected = kp.defaultPattern().applyAlg(new Alg(getEffectiveSetup(oll33.algorithm)));
  let patternOk = 0, patternFail = 0;
  for (const s of scrambles) {
    const actual = kp.defaultPattern().applyAlg(new Alg(s));
    if (expected.isIdentical(actual)) patternOk++;
    else patternFail++;
  }
  console.log(`  1. Pattern correct:  ${patternOk}/${scrambles.length} (${(patternOk / scrambles.length * 100).toFixed(1)}%)`);
  if (patternFail > 0) console.log(`     ✗ ${patternFail} scrambles produced wrong state`);

  // --- 2. Unique scrambles ---
  const unique = new Set(scrambles);
  console.log(`  2. Unique scrambles: ${unique.size}/${scrambles.length} (${(unique.size / scrambles.length * 100).toFixed(1)}%)`);

  // --- 3. Duplicates if any ---
  if (unique.size < scrambles.length) {
    const counts = new Map<string, number>();
    for (const s of scrambles) counts.set(s, (counts.get(s) ?? 0) + 1);
    const dups = [...counts.entries()].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]);
    console.log(`     Duplicates:`);
    for (const [s, c] of dups.slice(0, 5)) {
      console.log(`       ${c}x: ${s.substring(0, 50)}...`);
    }
  }

  // --- 4. Last-10-move suffixes ---
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

  // --- 5. Last-5-move frequency ---
  const suffixes5 = scrambles.map((s) => lastN(s, 5));
  const counts5 = new Map<string, number>();
  for (const sfx of suffixes5) counts5.set(sfx, (counts5.get(sfx) ?? 0) + 1);
  const sorted5 = [...counts5.entries()].sort((a, b) => b[1] - a[1]);
  const uniq5 = new Set(suffixes5);
  console.log(`  4. Unique last-5 suffixes: ${uniq5.size}/${scrambles.length} (${(uniq5.size / scrambles.length * 100).toFixed(1)}%)`);
  console.log(`     Frequency of last-5 endings:`);
  for (const [sfx, c] of sorted5.slice(0, 15)) {
    const pct = (c / scrambles.length * 100).toFixed(1);
    const bar = "█".repeat(Math.round(c / scrambles.length * 50));
    console.log(`     ${pct}% ${bar}  ${sfx}`);
  }

  // --- 6. Sample scrambles ---
  console.log(`\n  5. Sample scrambles (first 5):`);
  for (let i = 0; i < Math.min(5, scrambles.length); i++) {
    console.log(`     [${i + 1}] ${scrambles[i]}`);
  }

  // --- 7. Final verdict ---
  const diversityOk = uniq10.size > 10;
  console.log(`\n  ${"=".repeat(64)}`);
  if (patternOk === scrambles.length && diversityOk) {
    console.log(`  ✅ ALL CHECKS PASSED — ${unique.size} unique scrambles, ${uniq10.size} unique suffixes`);
  } else if (patternOk < scrambles.length) {
    console.log(`  ✗ FAILED — ${patternFail} scrambles with wrong pattern`);
  } else {
    console.log(`  ⚠ WARNING — Only ${uniq10.size} unique last-10 suffixes (low diversity)`);
  }
  console.log(`  ${"=".repeat(64)}\n`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
