import ScrambleBox from "./ScrambleBox";
import CubeViewer from "./CubeViewer";
import AlgorithmBox from "./AlgorithmBox";
import NextCaseButton from "./NextCaseButton";
import { useScrambledTrainer } from "../../hooks/useScrambledTrainer";
import type { AlgoCase } from "../../types";
import type { TrainerSettings } from "../../hooks/useTrainerSettings";

export default function PassiveTrainerView({
  cases,
  settings,
}: {
  cases: AlgoCase[];
  settings: TrainerSettings;
}) {
  const { currentCase, scramble, loading, nextCase, revealed, revealAlgorithm } =
    useScrambledTrainer(cases);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <ScrambleBox scramble={scramble} loading={loading} />
      {!settings.recognition.hideFaces && (
        <CubeViewer scramble={scramble} loading={loading} />
      )}
      <AlgorithmBox
        algorithm={currentCase.algorithm}
        revealed={revealed}
        onReveal={revealAlgorithm}
      />
      <NextCaseButton onNext={nextCase} />
    </div>
  );
}
