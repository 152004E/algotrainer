import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
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
  onAlgChange?: (alg: string) => void;
  guide?: boolean;
}

type TwistyPlayerElement = {
  experimentalSetupAlg: string;
  alg: string;
  jumpToEnd: () => void;
  experimentalGet: { alg: () => Promise<unknown> };
  experimentalModel: {
    experimentalAddMove: (move: string) => void;
    experimentalRemoveFinalChild: () => void;
    twistySceneModel: {
      orbitCoordinates: {
        get: () => Promise<{
          latitude: number;
          longitude: number;
          distance: number;
        }>;
        addFreshListener: (
          cb: (coords: {
            latitude: number;
            longitude: number;
            distance: number;
          }) => void,
        ) => () => void;
      };
    };
  };
};

type Vec3 = [number, number, number];
type FacePos = { xPct: number; yPct: number; visible: boolean; back?: boolean };

const FACE_NORMALS: Record<string, Vec3> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  R: [1, 0, 0],
  L: [-1, 0, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
};

const CUBE_FACE_R = 0.55;
const BACK_OFFSET_PCT = 40;
const CAMERA_FOV_DEG = 20;

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const normalize = (v: Vec3): Vec3 => {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
};

function computeFacePositions(coords: {
  latitude: number;
  longitude: number;
  distance: number;
}): Record<string, FacePos> {
  const DEG = Math.PI / 180;
  const phi = (90 - coords.latitude) * DEG;
  const theta = coords.longitude * DEG;
  const r = coords.distance;
  const cam: Vec3 = [
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.cos(theta),
  ];
  const f = normalize([-cam[0], -cam[1], -cam[2]]);
  let right = cross(f, [0, 1, 0]);
  if (Math.hypot(right[0], right[1], right[2]) < 1e-4) right = [1, 0, 0];
  right = normalize(right);
  const trueUp = normalize(cross(right, f));
  const focal = 1 / Math.tan((CAMERA_FOV_DEG * DEG) / 2);

  const raw: Record<string, { xPct: number; yPct: number; facing: boolean }> = {};
  for (const [letter, n] of Object.entries(FACE_NORMALS)) {
    const facing = dot(n, cam) > 0;
    const p: Vec3 = [n[0] * CUBE_FACE_R, n[1] * CUBE_FACE_R, n[2] * CUBE_FACE_R];
    const rel: Vec3 = [p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]];
    const cz = dot(rel, f);
    if (cz <= 0.01) {
      raw[letter] = { xPct: 50, yPct: 50, facing };
      continue;
    }
    const ndcX = (dot(rel, right) / cz) * focal;
    const ndcY = (dot(rel, trueUp) / cz) * focal;
    raw[letter] = {
      xPct: (ndcX * 0.5 + 0.5) * 100,
      yPct: (1 - (ndcY * 0.5 + 0.5)) * 100,
      facing,
    };
  }

  const out: Record<string, FacePos> = {};
  for (const [letter, pos] of Object.entries(raw)) {
    if (pos.facing) {
      out[letter] = { xPct: pos.xPct, yPct: pos.yPct, visible: true };
      continue;
    }
    let dx = pos.xPct - 50;
    let dy = pos.yPct - 50;
    let len = Math.hypot(dx, dy);
    if (len < 1) {
      const n = FACE_NORMALS[letter];
      dx = dot(n, right);
      dy = -dot(n, trueUp);
      len = Math.hypot(dx, dy) || 1;
    }
    const xPct = Math.max(6, Math.min(94, 50 + (dx / len) * BACK_OFFSET_PCT));
    const yPct = Math.max(6, Math.min(94, 50 + (dy / len) * BACK_OFFSET_PCT));
    out[letter] = { xPct, yPct, visible: true, back: true };
  }
  return out;
}

const CubeViewer = forwardRef<CubeViewerHandle, Props>(function CubeViewer(
  { scramble, loading, interactive, onAlgChange, guide },
  ref,
) {
  const playerRef = useRef<TwistyPlayerElement | null>(null);
  const lastReportedRef = useRef("");
  const interactiveRef = useRef(false);
  const [facePositions, setFacePositions] = useState<Record<string, FacePos>>({});

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

  useEffect(() => {
    if (!guide) return;
    const el = playerRef.current;
    if (!el) return;
    let unsubscribe: (() => void) | void;
    try {
      unsubscribe = el.experimentalModel.twistySceneModel.orbitCoordinates.addFreshListener(
        (coords) => setFacePositions(computeFacePositions(coords)),
      );
    } catch {
      // orbit tracking not available
    }
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [guide]);

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
        hint-facelets="none"
        experimental-setup-anchor="start"
        experimental-drag-input="auto"
        style={{ width: "100%", height: "100%" }}
      />
      {guide && (
        <div className="pointer-events-none absolute inset-0">
          {Object.entries(facePositions).map(([letter, pos]) =>
            pos.visible ? (
              <span
                key={letter}
                className={`absolute px-1.5 py-0.5 rounded text-xs font-bold shadow ${
                  pos.back
                    ? "bg-slate-500/50 text-slate-100 ring-1 ring-slate-300/40"
                    : "bg-primary/80 text-white"
                }`}
                style={{
                  left: `${pos.xPct}%`,
                  top: `${pos.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {letter}
              </span>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
});

export default CubeViewer;
