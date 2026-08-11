import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "cubing/twisty";

export interface CubeViewerHandle {
  addMove: (move: string) => void;
  undo: () => void;
  clear: () => void;
  doubleLast: () => void;
  getAlg: () => Promise<string>;
}

interface Props {
  scramble?: string;
  loading?: boolean;
  interactive?: boolean;
  moves?: string;
  onAlgChange?: (alg: string) => void;
}

type TwistyPlayerElement = {
  experimentalSetupAlg: string;
  alg: string;
  jumpToEnd: () => void;
  experimentalGet: { alg: () => Promise<unknown> };
  experimentalModel: {
    experimentalAddMove: (move: string) => void;
    experimentalRemoveFinalChild: () => void;
  };
};

const CubeViewer = forwardRef<CubeViewerHandle, Props>(function CubeViewer(
  { scramble, loading, interactive, moves, onAlgChange },
  ref,
) {
  const playerRef = useRef<TwistyPlayerElement | null>(null);
  const lastReportedRef = useRef("");
  const interactiveRef = useRef(false);

  interactiveRef.current = !!interactive;

  useImperativeHandle(
    ref,
    () => ({
      addMove(move: string) {
        const el = playerRef.current;
        if (!el || !interactiveRef.current) return;
        el.experimentalModel.experimentalAddMove(move);
      },
      undo() {
        const el = playerRef.current;
        if (!el || !interactiveRef.current) return;
        if (lastReportedRef.current.trim() === "") return;
        el.experimentalModel.experimentalRemoveFinalChild();
      },
      clear() {
        const el = playerRef.current;
        if (!el) return;
        el.alg = "";
        el.jumpToEnd();
      },
      doubleLast() {
        const el = playerRef.current;
        if (!el || !interactiveRef.current) return;
        void (async () => {
          const raw = await el.experimentalGet.alg();
          const tokens = String(raw).split(/\s+/).filter(Boolean);
          const last = tokens[tokens.length - 1];
          if (!last || last.length !== 1) return;
          el.experimentalModel.experimentalRemoveFinalChild();
          el.experimentalModel.experimentalAddMove(`${last}2`);
        })();
      },
      getAlg() {
        const el = playerRef.current;
        if (!el) return Promise.resolve("");
        return el.experimentalGet.alg().then((raw) => String(raw));
      },
    }),
    [],
  );

  useEffect(() => {
    const el = playerRef.current;
    if (!el || !scramble) return;
    el.experimentalSetupAlg = scramble;
    el.alg = "";
    el.jumpToEnd();
    lastReportedRef.current = "";
  }, [scramble]);

  useEffect(() => {
    const el = playerRef.current;
    if (!el || !scramble) return;
    let cancelled = false;
    void (async () => {
      const playerAlg = String(await el.experimentalGet.alg());
      if (cancelled) return;
      if (playerAlg === (moves ?? "")) return;
      el.alg = moves ?? "";
      el.jumpToEnd();
    })();
    return () => {
      cancelled = true;
    };
  }, [scramble, moves]);

  useEffect(() => {
    if (!interactive) return;
    let active = true;
    const tick = async () => {
      if (!active) return;
      const el = playerRef.current;
      if (el && scramble) {
        try {
          const current = String(await el.experimentalGet.alg());
          if (current !== lastReportedRef.current) {
            lastReportedRef.current = current;
            onAlgChange?.(current);
          }
        } catch {
          // player not ready yet
        }
      }
      setTimeout(tick, 100);
    };
    tick();
    return () => {
      active = false;
    };
  }, [interactive, scramble, onAlgChange]);

  if (loading || !scramble) {
    return (
      <div className="relative w-80 h-80 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800" />
    );
  }

  return (
    <div className="relative w-80 h-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      <twisty-player
        key="free"
        ref={playerRef}
        puzzle="3x3x3"
        background="none"
        control-panel="none"
        viewer-link="none"
        hint-facelets="floating"
        experimental-setup-anchor="end"
        experimental-stickering="WVLS"
        experimental-move-press-input={interactive ? "basic" : "none"}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});

export default CubeViewer;
