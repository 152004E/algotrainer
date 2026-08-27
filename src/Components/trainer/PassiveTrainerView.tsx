import ScrambleBox from "./ScrambleBox";
import CubeViewer from "./CubeViewer";
import AlgorithmBox from "./AlgorithmBox";
import NextCaseButton from "./NextCaseButton";
import { useScrambledTrainer } from "../../hooks/useScrambledTrainer";
import type { AlgoCase } from "../../types";

export default function PassiveTrainerView({ cases }: { cases: AlgoCase[] }) {
  const { currentCase, scramble, loading, nextCase, revealed, revealAlgorithm } =
    useScrambledTrainer(cases);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <ScrambleBox scramble={scramble} loading={loading} />
      <CubeViewer scramble={scramble} loading={loading} />
      <AlgorithmBox
        algorithm={currentCase.algorithm}
        revealed={revealed}
        onReveal={revealAlgorithm}
      />
      <NextCaseButton onNext={nextCase} />
    </div>
  );
}
