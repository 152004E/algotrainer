import { useState, useCallback, useRef, useEffect } from "react";
import type { AlgoCase, SessionStats } from "../types";
import { trainerStatsStore } from "./TrainerStatsStore";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useTrainer(cases: AlgoCase[]) {
  const [shuffled] = useState(() => shuffle(cases));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const startRef = useRef(Date.now());
  const [stats, setStats] = useState<SessionStats>({
    totalCases: cases.length,
    casesPracticed: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTime: 0,
    avgRecognitionTime: 0,
    caseHistory: [],
  });
  const [recognitionTime, setRecognitionTime] = useState(0);

  useEffect(() => {
    startRef.current = Date.now();
    setRevealed(false);
  }, [index]);

  useEffect(() => {
    if (revealed && startRef.current) {
      const elapsed = Date.now() - startRef.current;
      setRecognitionTime(elapsed);
    }
  }, [revealed]);

  useEffect(() => {
    trainerStatsStore.set(stats, recognitionTime, revealed);
  }, [stats, recognitionTime, revealed]);

  const currentCase = shuffled[index] ?? shuffled[0];

  const nextCase = useCallback(() => {
    setStats((prev) => {
      const newStreak = prev.currentStreak + 1;
      return {
        ...prev,
        casesPracticed: prev.casesPracticed + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        totalTime: prev.totalTime + recognitionTime,
        avgRecognitionTime: prev.casesPracticed > 0
          ? (prev.totalTime + recognitionTime) / (prev.casesPracticed + 1)
          : recognitionTime,
        caseHistory: currentCase
          ? [
              ...prev.caseHistory,
              {
                caseId: currentCase.id,
                revealedAt: recognitionTime,
                timestamp: Date.now(),
              },
            ]
          : prev.caseHistory,
      };
    });
    setIndex((i) => (i + 1) % shuffled.length);
  }, [shuffled.length, recognitionTime, currentCase]);

  const prevCase = useCallback(() => {
    setIndex((i) => (i - 1 + shuffled.length) % shuffled.length);
  }, [shuffled.length]);

  const toggleReveal = useCallback(() => {
    setRevealed((r) => !r);
  }, []);

  const revealAlgorithm = useCallback(() => {
    setRevealed(true);
  }, []);

  return {
    currentCase,
    nextCase,
    prevCase,
    stats,
    revealed,
    toggleReveal,
    revealAlgorithm,
    recognitionTime,
  };
}
