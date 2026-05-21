import { createContext, useContext } from "react";
import type { SessionStats } from "../types";

interface TrainerContextValue {
  stats: SessionStats;
  recognitionTime: number;
  revealed: boolean;
}

const defaultStats: SessionStats = {
  totalCases: 0,
  casesPracticed: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalTime: 0,
  avgRecognitionTime: 0,
  caseHistory: [],
};

const TrainerContext = createContext<TrainerContextValue>({
  stats: defaultStats,
  recognitionTime: 0,
  revealed: false,
});

export const TrainerProvider = TrainerContext.Provider;
export const useTrainerContext = () => useContext(TrainerContext);
