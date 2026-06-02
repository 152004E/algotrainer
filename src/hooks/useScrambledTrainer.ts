import { useState, useCallback, useEffect, useRef } from "react";
import type { AlgoCase, SessionStats } from "../types";
import { scrambleService } from "../utils/scrambleService";
import { trainerStatsStore } from "./TrainerStatsStore";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useScrambledTrainer(cases: AlgoCase[]) {
  const [shuffled] = useState(() => shuffle(cases));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scramble, setScramble] = useState("");
  const startRef = useRef(Date.now());
  const mountedRef = useRef(true);

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

  const currentCase = shuffled[index] ?? shuffled[0];

  // Pre-warm service and generate initial scramble
  useEffect(() => {
    mountedRef.current = true;
    scrambleService.prewarm(cases).then(() => {
      if (mountedRef.current) {
        generateForCase(currentCase).then((s) => {
          if (mountedRef.current) {
            setScramble(s);
            setLoading(false);
          }
        });
      }
    });
    return () => { mountedRef.current = false; };
  }, []);

  const generateForCase = useCallback(async (c: AlgoCase): Promise<string> => {
    return scrambleService.generateScramble(c);
  }, []);

  const loadCase = useCallback(async (c: AlgoCase) => {
    setLoading(true);
    setRevealed(false);
    startRef.current = Date.now();
    const s = await generateForCase(c);
    if (mountedRef.current) {
      setScramble(s);
      setLoading(false);
    }
  }, [generateForCase]);

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
    const nextIndex = (index + 1) % shuffled.length;
    setIndex(nextIndex);
    startRef.current = Date.now();
    const next = shuffled[nextIndex] ?? shuffled[0];
    loadCase(next);
  }, [shuffled, index, recognitionTime, currentCase, loadCase]);

  const prevCase = useCallback(() => {
    const prevIndex = (index - 1 + shuffled.length) % shuffled.length;
    setIndex(prevIndex);
    startRef.current = Date.now();
    const prev = shuffled[prevIndex] ?? shuffled[0];
    loadCase(prev);
  }, [shuffled, index, loadCase]);

  const revealAlgorithm = useCallback(() => {
    setRevealed(true);
  }, []);

  return {
    currentCase,
    scramble,
    loading,
    nextCase,
    prevCase,
    stats,
    revealed,
    revealAlgorithm,
    recognitionTime,
  };
}
