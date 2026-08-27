import { useState } from "react";
import ScrambleBox from "./ScrambleBox";
import CubeViewer from "./CubeViewer";
import FeedbackPanel from "./FeedbackPanel";
import AlgorithmReveal from "./AlgorithmReveal";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import SpaceHint from "./SpaceHint";
import { difficultyColors } from "./difficulty";
import { useExecutionTrainer } from "../../hooks/useExecutionTrainer";
import type { AlgoCase } from "../../types";
import type { TrainerSettings } from "../../hooks/useTrainerSettings";

const FACE_MEANINGS = [
  { key: "R", en: "Right" },
  { key: "L", en: "Left" },
  { key: "U", en: "Up" },
  { key: "D", en: "Down" },
  { key: "F", en: "Front" },
  { key: "B", en: "Back" },
];

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
  settings,
}: {
  cases: AlgoCase[];
  settings: TrainerSettings;
}) {
  const { resolution } = settings;
  const learnMode = resolution.learnMode;

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
    revealed,
    reveal,
  } = useExecutionTrainer(cases);

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
            guide={resolution.guide}
            hintFacelets={settings.recognition.hiddenFaces ? "floating" : "none"}
          />
          <div className="flex h-5 items-center justify-center">
            {resolution.guide && (
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
                U Up · D Down · R Right · L Left · F Front · B Back
              </span>
            )}
          </div>
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

              <div className="flex flex-col items-center gap-2">
                <PrimaryButton
                  data-start-exec
                  onClick={startExecution}
                  className="w-64"
                >
                  Lo sé — Ejecutar
                </PrimaryButton>
                <SpaceHint>para ejecutar</SpaceHint>
              </div>
            </>
          )}

          {phase === "execute" && (
            <>
              {resolution.controls && <ControlsCard />}

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
                <SecondaryButton onClick={undoMove}>Deshacer</SecondaryButton>
                <SecondaryButton onClick={clearMoves}>Limpiar</SecondaryButton>
              </div>

              <PrimaryButton data-check onClick={check} shortcut="Space" className="w-64">
                Comprobar
              </PrimaryButton>
            </>
          )}

          {phase === "feedback" && (
            <FeedbackPanel
              verdict={verdict}
              userMoves={userMoves}
              recognitionTime={recognitionTime}
              executionTime={executionTime}
              onRepeat={repeatCase}
              onNext={nextCase}
            />
          )}

          {/* Unified algorithm reveal */}
          <AlgorithmReveal
            algorithm={solution}
            forceReveal={learnMode}
            revealed={revealed}
            onReveal={reveal}
          />
        </div>
      </div>
    </div>
  );
}
