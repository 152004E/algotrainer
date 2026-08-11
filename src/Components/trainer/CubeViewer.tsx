import { useEffect, useRef } from "react";
import "cubing/twisty";
import { NotationGuideOverlay } from "./NotationGuide";

interface Props {
  scramble?: string;
  loading?: boolean;
  interactive?: boolean;
  moves?: string;
  onUserMove?: (move: string) => void;
  guide?: boolean;
}

type TwistyPlayerElement = {
  experimentalSetupAlg: string;
  alg: string;
  jumpToStart: () => void;
  jumpToEnd: () => void;
  experimentalGet: { alg: () => Promise<unknown> };
};

export default function CubeViewer({
  scramble,
  loading,
  interactive,
  moves,
  onUserMove,
  guide,
}: Props) {
  const playerRef = useRef<TwistyPlayerElement | null>(null);
  const lastReportedRef = useRef("");

  useEffect(() => {
    const el = playerRef.current;
    if (!el || !scramble) return;
    el.experimentalSetupAlg = scramble;
    el.alg = moves ?? "";
    el.jumpToEnd();
    lastReportedRef.current = moves ?? "";
  }, [scramble, moves, guide]);

  useEffect(() => {
    if (!interactive) return;
    let active = true;
    const tick = async () => {
      if (!active) return;
      const el = playerRef.current;
      if (el && scramble) {
        try {
          const raw = await el.experimentalGet.alg();
          const current = String(raw);
          const base = lastReportedRef.current;
          if (current.startsWith(base) && current.length > base.length) {
            lastReportedRef.current = current;
            const extra = current.slice(base.length).trim();
            for (const m of extra.split(/\s+/).filter(Boolean)) {
              onUserMove?.(m);
            }
          } else if (current !== base) {
            lastReportedRef.current = current;
          }
        } catch {
          // player not ready yet
        }
      }
      setTimeout(tick, 150);
    };
    tick();
    return () => {
      active = false;
    };
  }, [interactive, scramble, onUserMove]);

  if (loading || !scramble) {
    return (
      <div className="relative w-80 h-80 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800" />
    );
  }

  return (
    <div className="relative w-80 h-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      <twisty-player
        key={guide ? "guide" : "free"}
        ref={playerRef}
        puzzle="3x3x3"
        background="none"
        control-panel="none"
        viewer-link="none"
        hint-facelets="none"
        experimental-move-press-input={interactive ? "basic" : "none"}
        experimental-drag-input={guide ? "none" : "auto"}
        style={{ width: "100%", height: "100%" }}
      />
      {guide && <NotationGuideOverlay />}
    </div>
  );
}
