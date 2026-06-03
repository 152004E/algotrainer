import { scrambleService } from "../src/utils/scrambleService";
import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";
import type { KPuzzle } from "cubing/kpuzzle";
import OLLCases from "../src/data/OLLCases";

const FACES_RE = /^[UDFRLBy'2 ]+$/;
const isClean = (s: string) => FACES_RE.test(s);

const PLL_DEFS = [
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

function pllSignature(p: any): string {
  return JSON.stringify(p.patternData["EDGES"].pieces.slice(0, 4))
       + JSON.stringify(p.patternData["CORNERS"].pieces.slice(0, 4));
}

function showDistribution(lengths: number[]): void {
  const total = lengths.length;
  const maxLen = Math.max(...lengths);
  const minLen = Math.min(...lengths);
  const avg = lengths.reduce((a, b) => a + b, 0) / total;

  const counts: Record<number, number> = {};
  for (const l of lengths) counts[l] = (counts[l] ?? 0) + 1;

  console.log(`  Length stats:  avg=${avg.toFixed(1)}  min=${minLen}  max=${maxLen}\n`);
  console.log("  Distribution:");

  for (let l = minLen; l <= maxLen; l++) {
    const c = counts[l] ?? 0;
    const pct = ((c / total) * 100).toFixed(0);
    const bar = "█".repeat(Math.min(c, 60));
    const flag = l > 20 ? " ✗ NOT OK" : "";
    console.log(`    ${String(l).padStart(2)} moves: ${String(pct).padStart(3)}%  ${bar}${flag}`);
  }
}

async function main() {
  console.log("\n" + "=".repeat(64));
  console.log("  OLL 33 PLL VARIATION TEST");
  console.log("=".repeat(64));

  const oll33 = OLLCases.find((c: any) => c.id === "oll-33");
  if (!oll33) {
    console.log("\n  ✗ OLL 33 not found in data\n");
    process.exit(1);
  }

  const OLL33_ALG = oll33.algorithm;
  const INV_OLL33 = new Alg(OLL33_ALG).invert().toString();
  console.log(`\n  Algorithm:     ${OLL33_ALG}`);
  console.log(`  Invert:        ${INV_OLL33}\n`);

  const kp: KPuzzle = await cube3x3x3.kpuzzle();
  await scrambleService.prewarm([oll33]);

  // Precompute PLL → signature map for named distribution reporting
  const pllSigMap = new Map<string, string>();
  const pllInvMap = new Map<string, string>();
  for (const pll of PLL_DEFS) {
    const state = pll.alg
      ? kp.defaultPattern().applyAlg(new Alg(pll.alg)).applyAlg(new Alg(INV_OLL33))
      : kp.defaultPattern().applyAlg(new Alg(INV_OLL33));
    const afterOll = state.applyAlg(new Alg(OLL33_ALG));
    const sig = pllSignature(afterOll);
    pllSigMap.set(pll.name, sig);
    pllInvMap.set(sig, pll.name);
  }

  // Compute the reference OLL33 orientation pattern (from base target)
  const baseTarget = kp.defaultPattern().applyAlg(new Alg(INV_OLL33));
  const refEdgeOrient = baseTarget.patternData["EDGES"].orientation.slice(0, 4);
  const refCornerOrient = baseTarget.patternData["CORNERS"].orientation.slice(0, 4);
  console.log(`  Reference OLL33 orientation pattern:`);
  console.log(`    Edges:   [${refEdgeOrient.join(", ")}]`);
  console.log(`    Corners: [${refCornerOrient.join(", ")}]\n`);

  function isOLL33State(p: any): boolean {
    const eO = p.patternData["EDGES"].orientation.slice(0, 4);
    const cO = p.patternData["CORNERS"].orientation.slice(0, 4);
    for (let i = 0; i < 4; i++) {
      if (eO[i] !== refEdgeOrient[i]) return false;
      if (cO[i] !== refCornerOrient[i]) return false;
    }
    return true;
  }

  const count = 500;
  console.log(`  Generating ${count} scrambles...\n`);

  let pass = 0, fail = 0;
  let redundantPairs = 0;
  let over20 = 0;
  const lengths: number[] = [];
  const scrambles: string[] = [];
  const pllSigs: string[] = [];
  const failures: { s: string; err: string }[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const scramble = await scrambleService.generateScramble(oll33);
      scrambles.push(scramble);

      const state = kp.defaultPattern().applyAlg(new Alg(scramble));
      const oll33Ok = isOLL33State(state);
      const cleanOk = isClean(scramble);

      // After OLL33: capture PLL
      const afterOll = state.applyAlg(new Alg(OLL33_ALG));
      pllSigs.push(pllSignature(afterOll));

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

      if (oll33Ok && cleanOk && !hasRedundant) {
        pass++;
      } else {
        fail++;
        let err = "";
        if (!oll33Ok) err += "not-oll33 ";
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

  // Results
  console.log(`  OLL 33 orientation correct:  ${pass}/${count}`);
  console.log(`  Redundant pairs:             ${redundantPairs}`);
  console.log(`  Over 20 moves:               ${over20}/${count}`);
  console.log(`  Failures:                    ${fail}/${count}\n`);

  showDistribution(lengths);

  // PLL variation
  const uniquePlls = new Set(pllSigs);
  const uniqueScrambles = new Set(scrambles);

  const pllCounts = new Map<string, number>();
  for (const sig of pllSigs) pllCounts.set(sig, (pllCounts.get(sig) ?? 0) + 1);

  console.log(`\n  Distinct PLLs detected:      ${uniquePlls.size}/22 (${uniquePlls.size === 22 ? "✓ expected" : uniquePlls.size >= 20 ? "~ expected (E/Gb collision)" : "✗ low"})`);
  console.log(`  Unique scrambles:            ${uniqueScrambles.size}/${count}\n`);

  if (uniquePlls.size > 1) {
    console.log("  Per-PLL distribution:");
    for (const [sig, cnt] of [...pllCounts.entries()].sort((a, b) => b[1] - a[1])) {
      const name = pllInvMap.get(sig) ?? "?";
      const pct = ((cnt / count) * 100).toFixed(1);
      const bar = "█".repeat(Math.min(Math.round(cnt / 2), 50));
      console.log(`    ${name.padEnd(4)}: ${String(cnt).padStart(4)}/${count} (${pct}%) ${bar}`);
    }
  }

  if (failures.length > 0) {
    console.log(`\n  Detail (first 5 failures):`);
    for (const f of failures.slice(0, 5)) {
      console.log(`    ✗ [${f.err}] ${f.s.substring(0, 70)}`);
    }
  }

  const expectedUnique = uniquePlls.size >= 20; // E/Gb share U-layer sig
  const ok = fail === 0 && redundantPairs === 0 && expectedUnique;
  console.log("\n" + "=".repeat(64));
  if (ok) {
    console.log("  ✅ ALL CHECKS PASSED\n");
  } else {
    console.log("  ✗ FAILED — see errors above\n");
    process.exit(1);
  }
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
