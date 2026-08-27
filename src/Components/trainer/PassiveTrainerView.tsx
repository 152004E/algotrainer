import ScrambleBox from "./ScrambleBox";
import CubeViewer from "./CubeViewer";
import AlgorithmReveal from "./AlgorithmReveal";
import NextCaseButton from "./NextCaseButton";
import { difficultyColors } from "./difficulty";
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

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full justify-center">
        <div className="flex flex-col items-center gap-3">
          {!settings.recognition.hideFaces && (
            <CubeViewer
              scramble={scramble}
              loading={loading}
              hintFacelets={settings.resolution.hiddenFaces ? "floating" : "none"}
            />
          )}
          <div className="h-5" />
        </div>

        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                difficultyColors[currentCase.difficulty] ?? "bg-slate-400"
              }`}
            />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
              {currentCase.name}
            </h3>
          </div>

          <NextCaseButton onNext={nextCase} />

          <AlgorithmReveal
            algorithm={currentCase.algorithm}
            revealed={revealed}
            onReveal={revealAlgorithm}
          />
        </div>
      </div>
    </div>
  );
}