import { scrambleService } from "../src/utils/scrambleService";
import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";
import type { KPuzzle } from "cubing/kpuzzle";
import type { AlgoCase } from "../src/types";
import OLLCases from "../src/data/OLLCases";
import PLLCases from "../src/data/PLLCases";
import MWCases from "../src/data/MWCases";
import f2lCases from "../src/data/f2lCases";
import WVCases from "../src/data/WVCases";

const FACES_RE = /^[UDFRLBy'2 ]+$/;
const isClean = (s: string) => FACES_RE.test(s);

function getEffectiveSetup(c: AlgoCase): string {
  return new Alg(c.algorithm).invert().toString();
}

function uLayerEquals(a: any, b: any): boolean {
  const aE = JSON.stringify(a.patternData["EDGES"].pieces.slice(0, 4));
  const bE = JSON.stringify(b.patternData["EDGES"].pieces.slice(0, 4));
  if (aE !== bE) return false;
  const aC = JSON.stringify(a.patternData["CORNERS"].pieces.slice(0, 4));
  const bC = JSON.stringify(b.patternData["CORNERS"].pieces.slice(0, 4));
  return aC === bC;
}

async function main() {
  console.log("\n" + "=".repeat(64));
  console.log("  CLEAN SCRAMBLE VALIDATION — Kociemba composition");
  console.log("=".repeat(64));

  const subsets: [string, AlgoCase[]][] = [
    ["OLL", OLLCases],
    ["PLL", PLLCases],
    ["MW", MWCases],
    ["F2L", f2lCases],
    ["WV", WVCases],
  ];

  const totalCases = subsets.reduce((s, [, cs]) => s + cs.length, 0);
  console.log(`\n  Cases: ${totalCases}, 3 scrambles each = ${totalCases * 3}`);

  const kp: KPuzzle = await cube3x3x3.kpuzzle();
  await scrambleService.prewarm(subsets.flatMap(([, cs]) => cs));

  let grandPass = 0, grandFail = 0, grandClean = 0, grandDirty = 0, grandTime = 0, grandTotal = 0;
  let grandRedundantPairs = 0;

  for (const [name, cases] of subsets) {
    let pass = 0, fail = 0, clean = 0, dirty = 0, time = 0, redundantPairs = 0;
    const failures: { id: string; s: string; err: string }[] = [];
    const samples: string[] = [];

    for (const c of cases) {
      for (let i = 0; i < 3; i++) {
        const t0 = performance.now();
        try {
          const scramble = await scrambleService.generateScramble(c);
          const elapsed = performance.now() - t0;
          time += elapsed;
          grandTotal++;

          const expected = kp.defaultPattern().applyAlg(new Alg(getEffectiveSetup(c)));
          const actual = kp.defaultPattern().applyAlg(new Alg(scramble));
          const patternOk = uLayerEquals(expected, actual);
          const cleanOk = isClean(scramble);

          if (patternOk) pass++; else { fail++; failures.push({ id: c.id, s: scramble, err: "pattern" }); }
          if (cleanOk) clean++; else { dirty++; failures.push({ id: c.id, s: scramble, err: "dirty" }); }

          // Track seam redundancies (same-face adjacent pairs from boundary-only)
          const parts = scramble.trim().split(/\s+/);
          for (let j = 0; j < parts.length - 1; j++) {
            if (parts[j][0] === parts[j + 1][0]) redundantPairs++;
          }

          if (patternOk && cleanOk && samples.length < 10) samples.push(scramble);
        } catch (e) {
          fail++;
          const msg = (e as Error)?.message ?? String(e);
          failures.push({ id: c.id, s: "", err: msg.substring(0, 60) });
        }
      }
    }

    grandPass += pass; grandFail += fail; grandClean += clean; grandDirty += dirty; grandTime += time; grandRedundantPairs += redundantPairs;
    const avg = time / (pass + fail);
    const rpt = (redundantPairs / (pass + fail)).toFixed(1);
    console.log(`\n  ${name}: ${pass}/${pass + fail} pattern, ${clean}/${clean + dirty} clean, ${avg.toFixed(0)}ms avg, ${rpt} redundant/scramble`);
    if (failures.length > 0) {
      for (const f of failures.slice(0, 3)) process.stdout.write(`    ✗ ${f.id}: ${f.err} ${f.s.substring(0, 40)}\n`);
      if (failures.length > 3) process.stdout.write(`    ... +${failures.length - 3}\n`);
    }
    if (samples.length > 0) {
      process.stdout.write("    Samples:\n");
      for (const s of samples.slice(0, 3)) process.stdout.write(`      ${s.substring(0, 50)}...\n`);
    }
  }

  const avgMs = grandTime / grandTotal;
  const avgRpt = (grandRedundantPairs / grandTotal).toFixed(2);
  console.log("\n" + "=".repeat(64));
  console.log(`  FINAL: ${grandPass}/${grandTotal} pattern (${(grandPass / grandTotal * 100).toFixed(1)}%)`);
  console.log(`         ${grandClean}/${grandTotal} clean  (${(grandClean / grandTotal * 100).toFixed(1)}%)`);
  console.log(`         avg ${avgMs.toFixed(0)}ms, seam redundancy: ${avgRpt} pairs/scramble`);
  console.log("=".repeat(64));

  if (grandFail > 0 || grandDirty > 0) {
    process.exit(1);
  }
  console.log("\n  ✅ ALL PASSED\n");
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
