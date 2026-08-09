import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";
import type { KPuzzle, KPattern } from "cubing/kpuzzle";
import WVCases from "../src/data/WVCases";

// ── Checks for the 27 canonical WV cases (right-handed) ────────────
// 1. 27 cases, unique ids
// 2. All states distinct up to AUF (y rotations) → real 27 cases
// 3. Invert solves: setup = invert(algorithm) → apply algorithm → solved
// 4. Edge orientation done (EO ✓): all 12 edges oriented
// 5. F2L-1: DFL/DBL/DBR corners solved, DFR corner "up" (par arriba), FR edge in slot
// 6. corners field matches number of oriented LL corners in the U layer

// cubing.js 3x3 indexing
// CORNERS: [UFL, UFR, UBR, UBL, DFR, DFL, DBL, DBR]
// EDGES:   [UF, UR, UB, UL, FR, FL, BL, BR, DF, DR, DB, DL]
const U_CORNERS = [0, 1, 2, 3];

function patternKey(p: KPattern): string {
  return JSON.stringify({
    co: p.patternData["CORNERS"].orientation.join(","),
    cp: p.patternData["CORNERS"].pieces.join(","),
    eo: p.patternData["EDGES"].orientation.join(","),
    ep: p.patternData["EDGES"].pieces.join(","),
  });
}

function aufVariants(p: KPattern): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i < 4; i++) {
    out.add(patternKey(i === 0 ? p : p.applyAlg(new Alg(["U", "U2", "U'"][i - 1]))));
  }
  return out;
}

async function main() {
  const kp: KPuzzle = await cube3x3x3.kpuzzle();
  const solved = kp.defaultPattern();

  const failures: string[] = [];
  let pass = 0;

  const report = (ok: boolean, msg: string) => {
    if (ok) {
      pass++;
      process.stdout.write(`  \u2713 ${msg}\n`);
    } else {
      failures.push(msg);
      process.stdout.write(`  \u2717 ${msg}\n`);
    }
  };

  console.log("=".repeat(64));
  console.log("  WV CASES VERIFICATION (27 right-handed)");
  console.log("=".repeat(64));

  const ids = new Set<string>();
  report(WVCases.length === 27, `27 cases (got ${WVCases.length})`);
  for (const c of WVCases) {
    if (ids.has(c.id)) failures.push(`duplicate id: ${c.id}`);
    ids.add(c.id);
    if (!c.algorithm || !c.algorithm.trim()) failures.push(`empty algorithm: ${c.id}`);
  }
  report(ids.size === WVCases.length, `unique ids (${ids.size})`);

  const states = new Map<string, { key: Set<string>; c: (typeof WVCases)[number] }>();
  const stateList: { key: Set<string>; c: (typeof WVCases)[number] }[] = [];

  for (const c of WVCases) {
    if (!c.algorithm) continue;
    const setup = new Alg(c.algorithm).invert().toString();
    const state = solved.applyAlg(new Alg(setup));
    const key = patternKey(state);
    const entry = { key: aufVariants(state), c };
    states.set(key, entry);
    stateList.push(entry);

    process.stdout.write(`\n  ${c.id} ${c.name} (${c.shape}, ${c.corners}c)\n`);

    // 3. Inverse solves
    report(state.applyAlg(new Alg(c.algorithm)).isIdentical(solved), "inverse solves");

    // 4. EO done
    const eo = state.patternData["EDGES"].orientation as number[];
    report(eo.every((o) => o === 0), `EO done (${eo.filter((o) => o !== 0).length} bad)`);

    // 5. F2L-1: D corners solved, DFR corner up, FR edge in slot
    const cp = state.patternData["CORNERS"].pieces as number[];
    const co = state.patternData["CORNERS"].orientation as number[];
    const ep = state.patternData["EDGES"].pieces as number[];
    const dflOk = cp[5] === 5 && co[5] === 0;
    const dblOk = cp[6] === 6 && co[6] === 0;
    const dbrOk = cp[7] === 7 && co[7] === 0;
    const dfrUp = U_CORNERS.includes(cp[4]) && U_CORNERS.includes(cp.indexOf(4));
    const frEdgeInSlot = ep[4] === 4;
    report(dflOk && dblOk && dbrOk, "D-layer corners solved (DFL/DBL/DBR)");
    report(dfrUp, `DFR corner up (par arriba)`);
    report(frEdgeInSlot, "FR edge in slot");

    // 6. corners field: oriented LL corners in U layer, excluding the DFR piece (par arriba)
    const orientedLL = U_CORNERS.filter((pos) => co[pos] === 0 && cp[pos] !== 4).length;
    report(c.corners === orientedLL, `corners=${c.corners} (oriented LL corners=${orientedLL})`);
  }

  // 2. Distinctness up to AUF
  let distinct = true;
  for (let i = 0; i < stateList.length; i++) {
    for (let j = i + 1; j < stateList.length; j++) {
      const [a, b] = [stateList[i], stateList[j]];
      let same = false;
      for (const k of a.key) if (b.key.has(k)) { same = true; break; }
      if (same) {
        distinct = false;
        failures.push(`cases ${a.c.id} and ${b.c.id} coincide up to AUF`);
      }
    }
  }
  report(distinct, "27/27 distinct up to AUF");

  console.log("\n" + "=".repeat(64));
  console.log(`  ${pass}/${pass + failures.length} checks passed`);
  if (failures.length > 0) {
    console.log("\n  \u2717 FAILURES:");
    for (const f of failures) console.log(`    - ${f}`);
    process.exit(1);
  } else {
    console.log("\n  \u2705 ALL WV CASES VERIFIED\n");
  }
}

main().catch((err) => {
  console.error("\n  FATAL:", err);
  process.exit(1);
});
