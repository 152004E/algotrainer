import { useState } from "react";
import ScrambleBox from "./ScrambleBox";
import CubeViewer from "./CubeViewer";
import FeedbackPanel from "./FeedbackPanel";
import AlgorithmBox from "./AlgorithmBox";
import { useExecutionTrainer } from "../../hooks/useExecutionTrainer";
import type { AlgoCase } from "../../types";

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-rose-500",
};

const FACE_MEANINGS = [
  { key: "R", en: "Right" },
  { key: "L", en: "Left" },
  { key: "U", en: "Up" },
  { key: "D", en: "Down" },
  { key: "F", en: "Front" },
  { key: "B", en: "Back" },
];

function AlgorithmReveal({
  algorithm,
  forceReveal,
}: {
  algorithm: string;
  forceReveal?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const isRevealed = forceReveal || revealed;
  return (
    <AlgorithmBox
      algorithm={algorithm}
      revealed={isRevealed}
      onReveal={() => setRevealed(true)}
    />
  );
}

function ControlsCard() {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="text-sm font-semibold">Controles del cubo</span>
        <span className="text-xs text-slate-400">
          {open ? "Ocultar" : "Mostrar"}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap gap-1.5">
            {FACE_MEANINGS.map((f) => (
              <span
                key={f.key}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              >
                <b className="text-primary">{f.key}</b> {f.en}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">
                Shift
              </kbd>{" "}
              + tecla = inversa
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">
                2
              </kbd>{" "}
              = doble
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">
                Z
              </kbd>{" "}
              = retroceder
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">
                Space
              </kbd>{" "}
              = comprobar
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-500">
            Estas teclas mueven el cubo; el algoritmo se revela en el feedback.
          </p>
          <p className="text-slate-400 dark:text-slate-500">
            Arrastrá el cubo para rotarlo (vista libre) y ver las caras desde
            cualquier ángulo.
          </p>
        </div>
      )}
    </div>
  );
}

export default function VirtualTrainerView({
  cases,
  learnMode,
}: {
  cases: AlgoCase[];
  learnMode: boolean;
}) {
  const [showGuide, setShowGuide] = useState(false);
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
  } = useExecutionTrainer(cases);

  return (
    <div data-exec-trainer className="w-full flex flex-col items-center gap-6">
      <ScrambleBox scramble={scramble} loading={loading} />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full justify-center">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShowGuide((g) => !g)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {showGuide ? "Ocultar guía" : "Mostrar guía"}
          </button>
          <CubeViewer
            ref={cubeRef}
            scramble={scramble}
            loading={loading}
            interactive={phase === "execute"}
            onAlgChange={syncMoves}
            guide={showGuide}
          />
          {showGuide && (
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              U Up · D Down · R Right · L Left · F Front · B Back
            </div>
          )}
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

              {learnMode && <AlgorithmReveal algorithm={solution} forceReveal />}

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
              <ControlsCard />

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
