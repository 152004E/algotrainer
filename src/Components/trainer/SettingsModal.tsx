import { useState, useEffect } from "react";
import type { TrainerSettings } from "../../hooks/useTrainerSettings";
import { DEFAULT_TRAINER_SETTINGS } from "../../hooks/useTrainerSettings";
import ToggleSwitch from "./ToggleSwitch";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: TrainerSettings;
  onSave: (settings: TrainerSettings) => void;
}

type TabKey = "timer" | "recognition" | "resolution";

const TABS: { key: TabKey; label: string }[] = [
  { key: "timer", label: "Cronómetro" },
  { key: "recognition", label: "Modo reconocimiento" },
  { key: "resolution", label: "Modo resolución" },
];

const RESOLUTION_TOGGLES: {
  key: keyof TrainerSettings["resolution"];
  label: string;
  description: string;
}[] = [
  {
    key: "guide",
    label: "Guía de caras",
    description:
      "Muestra las letras de cada cara (U, D, R, L, F, B) proyectadas en 3D sobre el cubo, siguiendo la rotación de la cámara.",
  },
  {
    key: "controls",
    label: "Controles del cubo",
    description:
      "Muestra la tarjeta con los significados de las teclas (U/D/R/L/F/B, Shift, 2, Z, Space) durante la fase de ejecución.",
  },
  {
    key: "learnMode",
    label: "Modo aprender",
    description:
      "Muestra siempre el algoritmo recomendado para cada caso, sin necesidad de revelarlo manualmente.",
  },
];

const RECOGNITION_TOGGLES: {
  key: keyof TrainerSettings["recognition"];
  label: string;
  description: string;
}[] = [
  {
    key: "hiddenFaces",
    label: "Caras ocultas",
    description:
      "Dibuja las caras no visibles del cubo como un fantasma translúcido en el mismo cubo (hint facelets de cubing.js).",
  },
  {
    key: "hideFaces",
    label: "Ocultar caras",
    description:
      "Oculta el cubo virtual durante el modo reconocimiento. Solo se ve el scramble, el algoritmo se revela manualmente.",
  },
];

export default function SettingsModal({
  open,
  onClose,
  settings,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<TrainerSettings>(() => ({
    ...DEFAULT_TRAINER_SETTINGS,
    ...settings,
    resolution: { ...DEFAULT_TRAINER_SETTINGS.resolution, ...settings.resolution },
    recognition: { ...DEFAULT_TRAINER_SETTINGS.recognition, ...settings.recognition },
  }));
  const [activeTab, setActiveTab] = useState<TabKey>("resolution");
  const [showConfirmToast, setShowConfirmToast] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft({
        ...DEFAULT_TRAINER_SETTINGS,
        ...settings,
        resolution: {
          ...DEFAULT_TRAINER_SETTINGS.resolution,
          ...settings.resolution,
        },
        recognition: {
          ...DEFAULT_TRAINER_SETTINGS.recognition,
          ...settings.recognition,
        },
      });
      setActiveTab("resolution");
      setShowConfirmToast(false);
    }
  }, [open, settings]);

  if (!open) return null;

  const update = (tab: TabKey, key: string, value: boolean) => {
    setDraft((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [key]: value },
    }));
  };

  const handleSaveClick = () => {
    setShowConfirmToast(true);
  };

  const handleConfirmSave = () => {
    onSave(draft);
    setShowConfirmToast(false);
    onClose();
  };

  const handleCancelSave = () => {
    setShowConfirmToast(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Ajustes
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[120px]">
          {activeTab === "timer" && (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
              Sin ajustes por ahora.
            </p>
          )}
          {activeTab === "recognition" && (
            <div className="flex flex-col gap-5">
              {RECOGNITION_TOGGLES.map((toggle) => (
                <div key={toggle.key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {toggle.label}
                    </span>
                    <ToggleSwitch
                      checked={Boolean(draft.recognition[toggle.key])}
                      onChange={(checked) =>
                        update("recognition", toggle.key, checked)
                      }
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                    {toggle.description}
                  </p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "resolution" && (
            <div className="flex flex-col gap-5">
              {RESOLUTION_TOGGLES.map((toggle) => (
                <div key={toggle.key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {toggle.label}
                    </span>
                    <ToggleSwitch
                      checked={Boolean(draft.resolution[toggle.key])}
                      onChange={(checked) =>
                        update("resolution", toggle.key, checked)
                      }
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                    {toggle.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Confirmation Toast */}
      {showConfirmToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-slate-800 dark:bg-slate-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="text-sm">¿Guardar cambios?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancelSave}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary hover:bg-blue-600 text-white transition-colors"
              >
                Sí, guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
