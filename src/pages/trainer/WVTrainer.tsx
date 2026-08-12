import { useState } from "react";
import ScrambleBox from "../../Components/trainer/ScrambleBox";
import CubeViewer from "../../Components/trainer/CubeViewer";
import FeedbackPanel from "../../Components/trainer/FeedbackPanel";
import AlgorithmBox from "../../Components/trainer/AlgorithmBox";
import { useExecutionTrainer } from "../../hooks/useExecutionTrainer";
import WVCases from "../../data/WVCases";

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-rose-500",
};

function AlgorithmReveal({ algorithm }: { algorithm: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <AlgorithmBox
      algorithm={algorithm}
      revealed={revealed}
      onReveal={() => setRevealed(true)}
    />
  );
}

export default function WVTrainer() {
  const {
    currentCase,
    scramble,
    solution,
    loading,
    phase,
    userMoves,
    cubeRef,
    undoMove,
    clearMoves,
    syncMoves,
    startExecution,
    check,
    verdict,
    executionTime,
    recognitionTime,
    nextCase,
    repeatCase,
  } = useExecutionTrainer(WVCases);

  return (
    <div data-exec-trainer className="w-full flex flex-col items-center gap-6">
      <ScrambleBox scramble={scramble} loading={loading} />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full justify-center">
        <div className="flex flex-col items-center gap-3">
          <CubeViewer
            ref={cubeRef}
            scramble={scramble}
            loading={loading}
            interactive={phase === "execute"}
            onAlgChange={syncMoves}
          />
        </div>

        <div className="w-full md:w-80 flex flex-col gap-4">
          {phase === "recognize" && (
            <>
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

              <div className="flex flex-col gap-2">
                <button
                  data-start-exec
                  type="button"
                  onClick={startExecution}
                  className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Lo sé — Ejecutar
                </button>
                <span className="text-center text-xs text-slate-500 dark:text-slate-500">
                  <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs border border-slate-300 dark:border-slate-700">
                    Space
                  </kbd>{" "}
                  para ejecutar
                </span>
              </div>
            </>
          )}

          {phase === "execute" && (
            <>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-center gap-1 mb-1.5">
                  {["R", "L", "U", "D", "F", "B"].map((f) => (
                    <kbd
                      key={f}
                      className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                    >
                      {f}
                    </kbd>
                  ))}
                </div>
                <div className="flex justify-center gap-x-3 gap-y-0.5 flex-wrap">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono border border-slate-300 dark:border-slate-600">
                      Shift
                    </kbd>{" "}
                    inversa
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono border border-slate-300 dark:border-slate-600">
                      2
                    </kbd>{" "}
                    doble
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono border border-slate-300 dark:border-slate-600">
                      Space
                    </kbd>{" "}
                    comprobar
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 min-h-8">
                {userMoves.map((m, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-primary/10 text-primary font-mono text-sm rounded"
                  >
                    {m}
                  </span>
                ))}
                {userMoves.length === 0 && (
                  <span className="text-slate-400 dark:text-slate-500 text-sm">
                    Ejecutá el algoritmo en el cubo…
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={undoMove}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
                >
                  Deshacer
                </button>
                <button
                  type="button"
                  onClick={clearMoves}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
                >
                  Limpiar
                </button>
              </div>

              <button
                data-check
                type="button"
                onClick={check}
                className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Comprobar{" "}
                <kbd className="ml-1 px-2 py-0.5 bg-white/20 rounded font-mono text-sm">
                  Space
                </kbd>
              </button>
            </>
          )}

          {phase === "feedback" && (
            <>
              <FeedbackPanel
                verdict={verdict}
                userMoves={userMoves}
                recognitionTime={recognitionTime}
                executionTime={executionTime}
                onRepeat={repeatCase}
                onNext={nextCase}
              />
              <AlgorithmReveal key={currentCase.id} algorithm={solution} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}