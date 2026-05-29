import { useEffect, useRef, useState, useCallback } from "react";
import "cubing/twisty";

interface Props {
  alg: string;
  scramble?: string;
  className?: string;
  height?: string;
  controls?: boolean;
}

const SPEEDS = [0.25, 0.5, 1, 2];

const CubeViewer = ({ alg, scramble, className = "", height = "240px", controls = false }: Props) => {
  const playerRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const tsRef = useRef(0);
  const durRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);

  // Diagnostic: inspect twisty-player internal state after mount
  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;

    const inspect = async () => {
      const info: string[] = [];
      try {
        const canvases = await el.experimentalCurrentCanvases();
        info.push(`canvases: ${canvases.length}`);
        for (let i = 0; i < canvases.length; i++) {
          const c = canvases[i] as HTMLCanvasElement;
          info.push(`canvas#${i}: ${c.width}x${c.height}, style=${c.style.width}x${c.style.height}, parent=${c.parentElement?.tagName}`);
        }
      } catch (e) {
        info.push(`canvases err: ${e}`);
      }
      try {
        const strategy = await el.experimentalModel.visualizationStrategy.get();
        info.push(`strategy: ${strategy}`);
      } catch (e) {
        info.push(`strategy err: ${e}`);
      }
      try {
        const puzzleID = await el.experimentalModel.puzzleID.get();
        info.push(`puzzleID: ${puzzleID}`);
      } catch (e) {
        info.push(`puzzleID err: ${e}`);
      }
      console.log("[CubeViewer] inspect:", info.join(" | "));
    };

    setTimeout(inspect, 500);
  }, []);

  const syncTimeline = useCallback(async () => {
    const el = playerRef.current;
    if (!el) return;
    try {
      const ts: number = await el.experimentalGet.timestamp();
      const info = await el.experimentalModel.coarseTimelineInfo.get();
      tsRef.current = Number(ts);
      setTimestamp(tsRef.current);
      setAtStart(info.atStart);
      setAtEnd(info.atEnd);
    } catch {
      // not ready yet
    }
  }, []);

  const syncDuration = useCallback(async () => {
    const el = playerRef.current;
    if (!el) return;
    try {
      const indexer = await el.experimentalModel.indexer.get();
      const dur = Number(indexer.algDuration());
      durRef.current = dur;
      setDuration(dur);
    } catch {
      // not ready yet
    }
  }, []);

  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;

    if (scramble) {
      el.experimentalSetupAlg = scramble;
    }
    el.alg = alg;
    el.jumpToStart();
    setPlaying(false);
    setTimestamp(0);
    syncDuration();
  }, [alg, scramble, syncDuration]);

  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;
    el.tempoScale = speed;
  }, [speed]);

  useEffect(() => {
    if (!controls) return;
    let active = true;

    const tick = () => {
      if (!active) return;
      if (playerRef.current) {
        syncTimeline();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [controls, syncTimeline]);

  const play = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    el.controller.animationController.play({ loop });
    setPlaying(true);
  }, [loop]);

  const pause = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    el.controller.animationController.pause();
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  const jumpToStart = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    el.jumpToStart({ flash: true });
    setPlaying(false);
    syncTimeline();
  }, [syncTimeline]);

  const jumpToEnd = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    el.jumpToEnd({ flash: true });
    setPlaying(false);
    syncTimeline();
  }, [syncTimeline]);

  const stepForward = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    pause();
    el.controller.animationController.play({
      direction: 1,
      untilBoundary: "move",
      autoSkipToOtherEndIfStartingAtBoundary: false,
    });
    setTimeout(syncTimeline, 60);
  }, [pause, syncTimeline]);

  const stepBackward = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    pause();
    el.controller.animationController.play({
      direction: -1,
      untilBoundary: "move",
      autoSkipToOtherEndIfStartingAtBoundary: false,
    });
    setTimeout(syncTimeline, 60);
  }, [pause, syncTimeline]);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = playerRef.current;
    if (!el) return;
    const val = Number(e.target.value);
    el.timestamp = val;
    tsRef.current = val;
    setTimestamp(val);
  }, []);

  const toggleLoop = useCallback(() => {
    setLoop((l) => !l);
  }, []);

  useEffect(() => {
    if (!controls) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowRight") stepForward();
      if (e.key === "ArrowLeft") stepBackward();
      if (e.key === "r" || e.key === "R") jumpToStart();
      if (e.key === "l" || e.key === "L") toggleLoop();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [controls, togglePlay, stepForward, stepBackward, jumpToStart, toggleLoop]);

  const formatTime = (ms: number) => {
    const total = Math.round(ms / 100);
    const sec = Math.floor(total / 10);
    const dec = total % 10;
    return `${sec}.${dec}s`;
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <twisty-player
        ref={playerRef}
        puzzle="3x3x3"
        background="none"
        control-panel="none"
        viewer-link="none"
        hint-facelets="none"
        style={{ width: "100%", height }}
      />

      {controls && (
        <div className="mt-3 space-y-2">
          {/* Transport controls */}
          <div className="flex items-center justify-center gap-1">
            <button type="button" onClick={jumpToStart} disabled={atStart}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Ir al inicio">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button type="button" onClick={stepBackward} disabled={atStart}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Movimiento anterior">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button type="button" onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all active:scale-95"
              title={playing ? "Pausa" : "Reproducir"}>
              {playing ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </button>
            <button type="button" onClick={stepForward} disabled={atEnd}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Siguiente movimiento">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button type="button" onClick={jumpToEnd} disabled={atEnd}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Ir al final">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Timeline slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 w-10 text-right tabular-nums">
              {formatTime(timestamp)}
            </span>
            <input type="range" min={0} max={duration || 1} value={timestamp} onChange={handleSlider}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer
                bg-slate-200 dark:bg-slate-700 accent-blue-500
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
                [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md
                [&::-moz-range-thumb]:cursor-pointer"
            />
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 w-10 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* Speed & loop controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {SPEEDS.map((s) => (
                <button key={s} type="button" onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    speed === s
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}>
                  {s}x
                </button>
              ))}
            </div>
            <button type="button" onClick={toggleLoop}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                loop
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              title="Repetir">
              {loop ? "🔂" : "🔁"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CubeViewer;
