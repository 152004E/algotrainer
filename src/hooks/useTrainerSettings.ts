export interface TrainerSettings {
  resolution: {
    guide: boolean;
    hiddenFaces: boolean;
    controls: boolean;
    learnMode: boolean;
  };
  recognition: {
    hideFaces: boolean;
  };
  timer: Record<string, never>;
}

const STORAGE_KEY = "algotrainer:trainerSettings";
const SETTINGS_VERSION = 2;

export const DEFAULT_TRAINER_SETTINGS: TrainerSettings = {
  resolution: {
    guide: true,
    hiddenFaces: true,
    controls: true,
    learnMode: false,
  },
  recognition: {
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
        hiddenFaces: Boolean(parsed.resolution?.hiddenFaces ?? true),
        controls: Boolean(parsed.resolution?.controls ?? true),
        learnMode: Boolean(parsed.resolution?.learnMode ?? false),
      },
      recognition: {
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
