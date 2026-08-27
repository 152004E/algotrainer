export interface TrainerSettings {
  resolution: {
    guide: boolean;
    controls: boolean;
    learnMode: boolean;
  };
  recognition: {
    hiddenFaces: boolean;
    hideFaces: boolean;
  };
  timer: Record<string, never>;
}

const STORAGE_KEY = "algotrainer:trainerSettings";
const SETTINGS_VERSION = 3;

export const DEFAULT_TRAINER_SETTINGS: TrainerSettings = {
  resolution: {
    guide: true,
    controls: true,
    learnMode: false,
  },
  recognition: {
    hiddenFaces: true,
    hideFaces: false,
  },
  timer: {},
};

export function loadTrainerSettings(): TrainerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRAINER_SETTINGS };
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== SETTINGS_VERSION) {
      return { ...DEFAULT_TRAINER_SETTINGS };
    }
    return {
      resolution: {
        guide: Boolean(parsed.resolution?.guide ?? true),
        controls: Boolean(parsed.resolution?.controls ?? true),
        learnMode: Boolean(parsed.resolution?.learnMode ?? false),
      },
      recognition: {
        hiddenFaces: Boolean(parsed.recognition?.hiddenFaces ?? true),
        hideFaces: Boolean(parsed.recognition?.hideFaces ?? false),
      },
      timer: {},
    };
  } catch {
    return { ...DEFAULT_TRAINER_SETTINGS };
  }
}

export function saveTrainerSettings(settings: TrainerSettings): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...settings, version: SETTINGS_VERSION }),
    );
  } catch {
    // ignore storage errors
  }
}
