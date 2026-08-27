import { useState, useCallback, useEffect, useRef } from "react";
import type { CubeViewerHandle } from "../Components/trainer/CubeViewer";
import type { AlgoCase, SessionStats } from "../types";
import { scrambleService } from "../utils/scrambleService";
import { verifySolve, type SolveVerification } from "../utils/verifySolve";
import { trainerStatsStore } from "./TrainerStatsStore";

export type TrainerPhase = "recognize" | "execute" | "feedback";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const FACES = ["U", "D", "R", "L", "F", "B"];

const INITIAL_STATS: SessionStats = {
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

/**
 * Trainer interactivo por fases: recognize → execute → feedback.
 * El usuario ejecuta el algoritmo de resolución en un cubo virtual
 * (paleta + teclado + click en cubo) y la app verifica por estado
 * comparando contra el algoritmo del caso (`verifySolve`).
 */
export function useExecutionTrainer(cases: AlgoCase[]) {
  const [shuffled] = useState(() => shuffle(cases));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<TrainerPhase>("recognize");
  const [loading, setLoading] = useState(true);
  const [scramble, setScramble] = useState("");
  const [solution, setSolution] = useState("");
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<SolveVerification | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [recognitionTime, setRecognitionTime] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const startRef = useRef(0);
  const execStartRef = useRef(0);
  const checkingRef = useRef(false);
  const mountedRef = useRef(true);
  const cubeRef = useRef<CubeViewerHandle | null>(null);

  const [stats, setStats] = useState<SessionStats>({
    ...INITIAL_STATS,
    totalCases: cases.length,
  });

  const currentCase = shuffled[index] ?? shuffled[0];

  const loadCase = useCallback(async (c: AlgoCase) => {
    setLoading(true);
    setPhase("recognize");
    setUserMoves([]);
    setVerdict(null);
    setExecutionTime(0);
    setRevealed(false);
    startRef.current = Date.now();
    const s = await scrambleService.generateTrainerCase(c);
    if (mountedRef.current) {
      setScramble(s.scramble);
      setSolution(s.solution);
      setLoading(false);
    }
  }, []);

  const reveal = useCallback(() => {
    setRevealed(true);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    scrambleService.prewarm(cases).then(() => {
      if (mountedRef.current) loadCase(currentCase);
    });
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "recognize" && startRef.current > 0) {
      setRecognitionTime(Date.now() - startRef.current);
      startRef.current = 0;
    }
  }, [phase]);

  useEffect(() => {
    trainerStatsStore.set(stats, recognitionTime, false);
  }, [stats, recognitionTime]);

  const startExecution = useCallback(() => {
    if (phase !== "recognize") return;
    execStartRef.current = Date.now();
    setPhase("execute");
  }, [phase]);

  const appendMove = useCallback(
    (move: string) => {
      if (phase !== "execute") return;
      cubeRef.current?.addMove(move);
    },
    [phase],
  );

  const undoMove = useCallback(() => {
    if (phase !== "execute") return;
    cubeRef.current?.undo();
  }, [phase]);

  const clearMoves = useCallback(() => {
    setUserMoves([]);
    cubeRef.current?.clear();
  }, []);

  const syncMoves = useCallback((alg: string) => {
    setUserMoves(alg ? alg.split(/\s+/).filter(Boolean) : []);
  }, []);

  const check = useCallback(async () => {
    if (phase !== "execute" || checkingRef.current) return;
    checkingRef.current = true;
    const execMs = Date.now() - execStartRef.current;
    setExecutionTime(execMs);
    const movesAlg = (await cubeRef.current?.getAlg()) || userMoves.join(" ");
    const result = await verifySolve(
      scramble,
      movesAlg,
      currentCase.algorithm,
    );
    setVerdict(result);
    setPhase("feedback");
    checkingRef.current = false;

    const solved = result.solved;
    setStats((prev) => {
      const newStreak = solved ? prev.currentStreak + 1 : 0;
      return {
        ...prev,
        attempts: prev.attempts + 1,
        correct: solved ? prev.correct + 1 : prev.correct,
        wrong: solved ? prev.wrong : prev.wrong + 1,
        helped: prev.helped,
        avgExecutionTime:
          (prev.avgExecutionTime * prev.attempts + execMs) /
          (prev.attempts + 1),
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        totalTime: prev.totalTime + execMs,
        caseHistory: [
          ...prev.caseHistory,
          {
            caseId: currentCase.id,
            revealedAt: recognitionTime,
            timestamp: Date.now(),
            executionTime: execMs,
            correct: result.solved,
            helped: false,
          },
        ],
      };
    });
  }, [phase, scramble, userMoves, currentCase, recognitionTime]);

  const nextCase = useCallback(() => {
    const nextIndex = (index + 1) % shuffled.length;
    setIndex(nextIndex);
    setStats((prev) => ({ ...prev, casesPracticed: prev.casesPracticed + 1 }));
    const next = shuffled[nextIndex] ?? shuffled[0];
    loadCase(next);
  }, [shuffled, index, loadCase]);

  const repeatCase = useCallback(() => {
    loadCase(currentCase);
  }, [loadCase, currentCase]);

  useEffect(() => {
    if (phase === "feedback") return;
    const handler = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      e.preventDefault();
      if (phase === "execute") check();
      else if (phase === "recognize") startExecution();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, check, startExecution]);

  useEffect(() => {
    if (phase !== "execute") return;
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

    const key = e.key;
    if (key === "2") {
      cubeRef.current?.doubleLast();
      return;
    }
    if (key.toLowerCase() === "z") {
      undoMove();
      return;
    }
    const face = key.toUpperCase();
    if (!FACES.includes(face)) return;
    if (e.shiftKey) appendMove(`${face}'`);
    else appendMove(face);
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [phase, appendMove, undoMove]);

  return {
    currentCase,
    scramble,
    solution,
    loading,
    phase,
    userMoves,
    cubeRef,
    appendMove,
    undoMove,
    clearMoves,
    syncMoves,
    startExecution,
    check,
    verdict,
    executionTime,
    recognitionTime,
    stats,
    nextCase,
    repeatCase,
    revealed,
    reveal,
  };
}
