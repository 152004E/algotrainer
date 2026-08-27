export interface TrainerSettings {
  resolution: {
    guide: boolean;
    hiddenFaces: boolean;
    controls: boolean;
    learnMode: boolean;
  };
  recognition: Record<string, never>;
  timer: Record<string, never>;
}

const STORAGE_KEY = "algotrainer:trainerSettings";

export const DEFAULT_TRAINER_SETTINGS: TrainerSettings = {
  resolution: {
    guide: true,
    hiddenFaces: true,
    controls: true,
    learnMode: true,
  },
  recognition: {},
  timer: {},
};

export function loadTrainerSettings(): TrainerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRAINER_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      resolution: {
        guide: Boolean(parsed.resolution?.guide ?? true),
        hiddenFaces: Boolean(parsed.resolution?.hiddenFaces ?? true),
        controls: Boolean(parsed.resolution?.controls ?? true),
        learnMode: Boolean(parsed.resolution?.learnMode ?? true),
      },
      recognition: {},
      timer: {},
    };
  } catch {
    return { ...DEFAULT_TRAINER_SETTINGS };
  }
}

export function saveTrainerSettings(settings: TrainerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}
