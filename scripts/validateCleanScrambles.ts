import { scrambleService } from "../src/utils/scrambleService";
import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";
import type { KPuzzle } from "cubing/kpuzzle";
import OLLCases from "../src/data/OLLCases";

const FACES_RE = /^[UDFRLBy'2 ]+$/;
const isClean = (s: string) => FACES_RE.test(s);

function getEffectiveSetup(c: any): string {
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

function showDistribution(lengths: number[]): void {
  const total = lengths.length;
  const maxLen = Math.max(...lengths);
  const minLen = Math.min(...lengths);
  const avg = lengths.reduce((a, b) => a + b, 0) / total;

  const counts: Record<number, number> = {};
  for (const l of lengths) counts[l] = (counts[l] ?? 0) + 1;

  console.log(`  Length stats:  avg=${avg.toFixed(1)}  min=${minLen}  max=${maxLen}  (target 15-19, max 20)\n`);
  console.log("  Distribution:");

  for (let l = minLen; l <= maxLen; l++) {
    const c = counts[l] ?? 0;
    const pct = ((c / total) * 100).toFixed(0);
    const bar = "█".repeat(c);
    const flag = l > 20 ? " ✗ NOT OK" : l >= 15 ? "" : " (short)";
    console.log(`    ${String(l).padStart(2)} moves: ${String(pct).padStart(3)}%  ${bar}${flag}`);
  }

  const over20 = lengths.filter(l => l > 20).length;
  if (over20 > 0) {
    console.log(`\n  ⚠ ${over20}/${total} scrambles exceed 20 moves`);
  }
}

async function main() {
  console.log("\n" + "=".repeat(64));
  console.log("  CLEAN SCRAMBLE VALIDATION — OLL 33 only");
  console.log("=".repeat(64));

  const oll33 = OLLCases.find((c: any) => c.id === "oll-33");
  if (!oll33) {
    console.log("\n  ✗ OLL 33 not found in data\n");
    process.exit(1);
  }

  const kp: KPuzzle = await cube3x3x3.kpuzzle();
  await scrambleService.prewarm([oll33]);

  const count = 100;
  console.log(`\n  Generating ${count} scrambles for OLL 33...\n`);

  let pass = 0, fail = 0;
  let redundantPairs = 0;
  let over20 = 0;
  const lengths: number[] = [];
  const failures: { s: string; err: string }[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const scramble = await scrambleService.generateScramble(oll33);

      const expected = kp.defaultPattern().applyAlg(new Alg(getEffectiveSetup(oll33)));
      const actual = kp.defaultPattern().applyAlg(new Alg(scramble));
      const patternOk = uLayerEquals(expected, actual);
      const cleanOk = isClean(scramble);

      const parts = scramble.trim().split(/\s+/);
      lengths.push(parts.length);

      if (parts.length > 20) over20++;

      let hasRedundant = false;
      for (let j = 0; j < parts.length - 1; j++) {
        if (parts[j][0] === parts[j + 1][0]) {
          redundantPairs++;
          hasRedundant = true;
        }
      }

      if (patternOk && cleanOk && !hasRedundant) {
        pass++;
      } else {
        fail++;
        let err = "";
        if (!patternOk) err += "pattern ";
        if (!cleanOk) err += "dirty ";
        if (hasRedundant) err += "redundant ";
        failures.push({ s: scramble, err });
      }
    } catch (e) {
      fail++;
      const msg = (e as Error)?.message ?? String(e);
      failures.push({ s: "", err: msg.substring(0, 60) });
    }
  }

  console.log(`  Pattern correct:  ${pass + fail === 0 ? 0 : pass}/${pass + fail}`);
  console.log(`  Redundant pairs:  ${redundantPairs}`);
  console.log(`  Failures:         ${fail}/${pass + fail}\n`);

  showDistribution(lengths);

  if (failures.length > 0) {
    console.log(`\n  Failures:`);
    for (const f of failures.slice(0, 5)) {
      console.log(`    ✗ [${f.err}] ${f.s.substring(0, 60)}`);
    }
  }

  console.log("\n" + "=".repeat(64));
  if (fail > 0 || redundantPairs > 0) {
    console.log("  ✗ FAILED — redundant pairs or pattern errors found\n");
    process.exit(1);
  }
  console.log("  ✅ ALL PASSED — 0 redundant pairs, 0 pattern errors\n");
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
