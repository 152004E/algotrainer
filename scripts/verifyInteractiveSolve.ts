import { scrambleService } from "../src/utils/scrambleService";
import { verifySolve } from "../src/utils/verifySolve";
import WVCases from "../src/data/WVCases";

const SCRAMBLES_PER_CASE = 5;
const FACES = ["U", "D", "R", "L", "F", "B"];

function randomMoves(count: number): string {
  const m: string[] = [];
  for (let i = 0; i < count; i++) {
    const f = FACES[Math.floor(Math.random() * FACES.length)];
    const mod = ["", "", "'", "2"][Math.floor(Math.random() * 4)];
    m.push(f + mod);
  }
  return m.join(" ");
}

async function main() {
  let total = 0;
  let failures = 0;

  for (const c of WVCases) {
    await scrambleService.prewarm([c]);
    for (let i = 0; i < SCRAMBLES_PER_CASE; i++) {
      const scramble = await scrambleService.generateScramble(c);
      total++;

      const exact = await verifySolve(scramble, c.algorithm, c.algorithm);
      if (!exact.solved || !exact.exact) {
        failures++;
        console.error(`FAIL ${c.id} exacto: ${JSON.stringify(exact)}`);
        continue;
      }

      const wrong = await verifySolve(scramble, randomMoves(3), c.algorithm);
      if (wrong.solved) {
        failures++;
        console.error(`FAIL ${c.id} random resuelto: ${JSON.stringify(wrong)}`);
      }
    }
  }

  console.log(`${total} checks, ${failures} failures`);
  if (failures > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
