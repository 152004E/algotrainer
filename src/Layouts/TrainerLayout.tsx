import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TrainerSidebar from "../Components/trainer/TrainerSidebar";
import TrainerTabs from "../Components/trainer/TrainerTabs";
import TrainerToolsSidebar from "../Components/trainer/TrainerToolsSidebar";
import TrainerModeToggle, { type TrainerMode } from "../Components/trainer/TrainerModeToggle";
import SettingsModal from "../Components/trainer/SettingsModal";
import {
  loadTrainerSettings,
  saveTrainerSettings,
  type TrainerSettings,
} from "../hooks/useTrainerSettings";

const STORAGE_KEY = "algotrainer:trainerMode";

function readStoredMode(): TrainerMode | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "passive" || v === "virtual" ? v : null;
  } catch {
    return null;
  }
}

export default function TrainerLayout() {
  const location = useLocation();
  const [mode, setMode] = useState<TrainerMode | null>(readStoredMode);
  const [settings, setSettings] = useState<TrainerSettings>(loadTrainerSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const choose = (m: TrainerMode) => {
    setMode(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore storage errors
    }
  };

  const updateSettings = (s: TrainerSettings) => {
    setSettings(s);
    saveTrainerSettings(s);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        if (document.querySelector("[data-exec-trainer]")) return;
        e.preventDefault();
        const btn = document.querySelector<HTMLButtonElement>("[data-next-case]");
        const revealBtn = document.querySelector<HTMLButtonElement>(
          "[data-reveal-algo]",
        );

        const revealed = document.getElementById("algo-display") !== null;

        if (revealed) {
          btn?.click();
        } else {
          revealBtn?.click();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* LEFT SIDEBAR */}
      <TrainerSidebar onOpenSettings={() => setSettingsOpen(true)} />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center p-8 bg-white dark:bg-background-dark">
        {/* TABS: selector de sets de algoritmos */}
        <TrainerTabs />

        {/* MODE: selector de entrenamiento, debajo de las tabs */}
        <div className="w-full flex justify-center mt-4">
          {mode === null ? (
            <ModePicker onChoose={choose} />
          ) : (
            <TrainerModeToggle
              mode={mode}
              onModeChange={choose}
            />
          )}
        </div>

        {/* TRAINER CONTENT */}
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-8">
          <Outlet context={{ mode, settings, onSettingsChange: updateSettings }} />
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <TrainerToolsSidebar />

      {/* SETTINGS MODAL */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </div>
  );
}

function ModePicker({ onChoose }: { onChoose: (m: TrainerMode) => void }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <ModeCard
        title="Reconocimiento"
        description="Mirá el cubo y reconocé el caso. Revelá el algoritmo cuando quieras."
        onClick={() => onChoose("passive")}
      />
      <ModeCard
        title="Resolución en cubo virtual"
        description="Ejecutá el algoritmo en el cubo y verificá la resolución por estado."
        onClick={() => onChoose("virtual")}
      />
    </div>
  );
}

function ModeCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-64 text-left p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </button>
  );
}
