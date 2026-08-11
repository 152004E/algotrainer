import { useEffect, useRef } from "react";
import "cubing/twisty";

interface Props {
  scramble?: string;
  loading?: boolean;
}

type TwistyPlayerElement = {
  experimentalSetupAlg: string;
  alg: string;
  jumpToStart: () => void;
};

export default function CubeViewer({ scramble, loading }: Props) {
  const playerRef = useRef<TwistyPlayerElement | null>(null);

  useEffect(() => {
    const el = playerRef.current;
    if (!el || !scramble) return;
    el.experimentalSetupAlg = scramble;
    el.alg = "";
    el.jumpToStart();
  }, [scramble]);

  if (loading || !scramble) {
    return (
      <div className="relative w-80 h-80 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800" />
    );
  }

  return (
    <div className="relative w-80 h-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      <twisty-player
        ref={playerRef}
        puzzle="3x3x3"
        background="none"
        control-panel="none"
        viewer-link="none"
        hint-facelets="none"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
