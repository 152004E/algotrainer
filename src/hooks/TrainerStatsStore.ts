import type { SessionStats } from "../types";

type Listener = (stats: SessionStats, recognitionTime: number, revealed: boolean) => void;

let currentStats: SessionStats = {
  totalCases: 0,
  casesPracticed: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalTime: 0,
  avgRecognitionTime: 0,
  avgExecutionTime: 0,
  attempts: 0,
  correct: 0,
  wrong: 0,
  helped: 0,
  caseHistory: [],
};
let currentRecognitionTime = 0;
let currentRevealed = false;
const listeners = new Set<Listener>();

export const trainerStatsStore = {
  get stats() { return currentStats; },
  get recognitionTime() { return currentRecognitionTime; },
  get revealed() { return currentRevealed; },

  set(stats: SessionStats, recognitionTime: number, revealed: boolean) {
    currentStats = stats;
    currentRecognitionTime = recognitionTime;
    currentRevealed = revealed;
    listeners.forEach((fn) => fn(stats, recognitionTime, revealed));
  },

  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
};
