import { useState } from "react";
import ScrambleBox from "../../Components/trainer/ScrambleBox";
import CubeViewer from "../../Components/trainer/CubeViewer";
import AlgorithmBox from "../../Components/trainer/AlgorithmBox";
import MovePad from "../../Components/trainer/MovePad";
import FeedbackPanel from "../../Components/trainer/FeedbackPanel";
import { NotationLegend } from "../../Components/trainer/NotationGuide";
import { useExecutionTrainer } from "../../hooks/useExecutionTrainer";
import WVCases from "../../data/WVCases";

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-rose-500",
};

const toggleClass = {
  base: "px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
  active: "bg-primary text-white",
  inactive:
    "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700",
};

export default function WVTrainer() {
  const {
    currentCase,
    scramble,
    loading,
    mode,
    toggleMode,
    phase,
    showAlgorithm,
    helped,
    userMoves,
    appendMove,
    undoMove,
    clearMoves,
    startExecution,
    askHelp,
    check,
    verdict,
    executionTime,
    recognitionTime,
    nextCase,
    repeatCase,
  } = useExecutionTrainer(WVCases);

  const [guide, setGuide] = useState(false);

  return (
    <div data-exec-trainer className="w-full flex flex-col items-center gap-6">
      {/* Toggles */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
          {(["practice", "learn"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => mode !== m && toggleMode()}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${
                mode === m ? "bg-primary text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {m === "practice" ? "Practicar" : "Aprender"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setGuide((g) => !g)}
          className={`${toggleClass.base} ${
            guide ? toggleClass.active : toggleClass.inactive
          }`}
        >
          Guía
        </button>
      </div>

      <ScrambleBox scramble={scramble} loading={loading} />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full justify-center">
        <div className="flex flex-col items-center gap-3">
          <CubeViewer
            scramble={scramble}
            loading={loading}
            interactive={phase === "execute"}
            moves={phase === "recognize" ? "" : userMoves.join(" ")}
            onUserMove={appendMove}
            guide={guide}
          />
          {guide && <NotationLegend />}
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

              <AlgorithmBox
                algorithm={currentCase.algorithm}
                revealed={showAlgorithm}
                onReveal={askHelp}
              />

              <div className="flex flex-col gap-2">
                <button
                  data-start-exec
                  type="button"
                  onClick={startExecution}
                  className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Lo sé — Ejecutar
                </button>
                {!showAlgorithm && (
                  <button
                    type="button"
                    onClick={askHelp}
                    className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    No lo sé
                  </button>
                )}
              </div>
            </>
          )}

          {phase === "execute" && (
            <>
              <MovePad onMove={appendMove} />

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
                  <span className="text-slate-300 dark:text-slate-600 text-sm">
                    Ejecutá el algoritmo en el cubo…
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={undoMove}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Deshacer
                </button>
                <button
                  type="button"
                  onClick={clearMoves}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Limpiar
                </button>
              </div>

              {showAlgorithm && (
                <AlgorithmBox
                  algorithm={currentCase.algorithm}
                  revealed
                  onReveal={() => {}}
                />
              )}

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
            <FeedbackPanel
              verdict={verdict}
              userMoves={userMoves}
              algorithm={currentCase.algorithm}
              helped={helped}
              recognitionTime={recognitionTime}
              executionTime={executionTime}
              onRepeat={repeatCase}
              onNext={nextCase}
            />
          )}
        </div>
      </div>
    </div>
  );
}
