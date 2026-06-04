import { useState, useRef, useCallback, useEffect } from "react";
import "cubing/twisty";
import { Alg } from "cubing/alg";

interface GenCase {
  id: string;
  name: string;
  shape: string;
  scramble: string;
  algorithm: string;
}

const DATASET: GenCase[] = [
  {
    id: "pll-aa",
    name: "Aa Perm",
    shape: "Corner cycle (clockwise)",
    scramble: "R2' B2' R F R' B2' R F' R",
    algorithm: "R' F R' B2 R F' R' B2 R2",
  },
];

const GeneratePreviews = () => {
  const playerRef = useRef<any>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [current, setCurrent] = useState("");
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState("pll-aa");
  const cancelledRef = useRef(false);

  const filtered = filter.trim()
    ? DATASET.filter((c) => filter.split(",").map((s) => s.trim()).includes(c.id))
    : DATASET;
  const total = filtered.length;

  useEffect(() => {
    customElements
      .whenDefined("twisty-player")
      .then(() => {
        console.log("[Generator] twisty-player ready");
        setReady(true);
      })
      .catch((err) => {
        console.error("[Generator] Failed:", err);
      });
  }, []);

  const generate = useCallback(async () => {
    const el = playerRef.current;
    if (!el) return;

    cancelledRef.current = false;
    setStatus("generating");
    setImages([]);
    setErrors([]);

    el.puzzle = "3x3x3";
    el.background = "none";
    el.controlPanel = "none";
    el.viewerLink = "none";
    el.hintFacelets = "none";
    el.cameraLatitude = 25;
    el.cameraLongitude = 45;
    el.cameraDistance = 6;
    el.tempoScale = 10;

    const ds = filtered;
    const results: { id: string; url: string }[] = [];

    for (let i = 0; i < ds.length; i++) {
      if (cancelledRef.current) {
        setStatus("idle");
        return;
      }

      const c = ds[i];
      setCurrent(`${c.id} — ${c.name} ${c.shape}`);
      setProgress(i + 1);
      console.log(`[PLL Generator] [${i + 1}/${ds.length}] ${c.id} — scramble: ${c.scramble}`);

      try {
        let setupAlg = new Alg("y").concat(new Alg(c.scramble)).concat(new Alg("y'"));
        const setupStr = setupAlg.toString();
        console.log(`[PLL Generator]   setup: ${setupStr}`);

        el.experimentalSetupAlg = setupStr;
        el.experimentalSetupAnchor = "start";
        el.alg = "";

        await new Promise((r) => setTimeout(r, 800));

        const url = await el.experimentalScreenshot({ width: 400, height: 400 });

        if (typeof url === "string" && url.startsWith("data:image")) {
          results.push({ id: `${c.id}.png`, url });
          setImages([...results]);
          console.log(`[PLL Generator] ✓ ${c.id}`);
        } else {
          throw new Error("Invalid screenshot result");
        }
      } catch (err) {
        const msg = `${c.id}: ${err instanceof Error ? err.message : String(err)}`;
        console.error(`[PLL Generator] ✗ ${c.id} —`, err);
        setErrors((prev) => [...prev, msg]);
      }

      await new Promise((r) => setTimeout(r, 150));
    }

    console.log(`[PLL Generator] Done. ${results.length}/${ds.length} generated`);
    setStatus("done");
  }, []);

  const downloadAll = useCallback(() => {
    images.forEach((img, i) => {
      const a = document.createElement("a");
      a.download = img.id;
      a.href = img.url;
      setTimeout(() => a.click(), i * 300);
    });
  }, [images]);

  const progressPct = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Preview Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Generating {total} PLL case previews
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Filter (comma-separated IDs, empty = all)
          </label>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="pll-aa"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
          />
        </div>

        <div className="flex gap-4 mb-8 items-center">
          <button
            type="button"
            onClick={generate}
            disabled={status === "generating" || !ready}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition"
          >
            {status === "idle"
              ? `Generate PLL Previews (${total})`
              : status === "generating"
                ? "Generating..."
                : "Regenerate"}
          </button>

          {images.length > 0 && (
            <button
              type="button"
              onClick={downloadAll}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition"
            >
              Download ({images.length})
            </button>
          )}
        </div>

        <div className="mb-8 space-y-2 text-sm">
          {!ready && <p className="text-amber-500 font-medium">⏳ Initializing cubing.js...</p>}

          <p>
            Status:{" "}
            <span className="font-semibold">
              {status === "idle" ? "Idle" : status === "generating" ? "Generating..." : "Completed"}
            </span>
          </p>

          {status === "generating" && (
            <div className="space-y-2">
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p>
                Progress: {progress} / {total} ({progressPct}%)
              </p>
              <p className="font-mono text-blue-600 dark:text-blue-400">
                Current: {current}
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-4">
              <p className="text-red-500 font-semibold mb-1">Errors ({errors.length}):</p>
              <ul className="list-disc list-inside text-red-400 text-xs space-y-0.5 max-h-32 overflow-y-auto">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Previews ({images.length})
            </h2>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt={img.id}
                    className="w-full aspect-square object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <a
                      href={img.url}
                      download={img.id}
                      className="text-white text-xs font-bold px-2 py-1 bg-blue-500 rounded"
                    >
                      DL
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          opacity: 0,
          position: "absolute",
          left: "-9999px",
          width: "400px",
          height: "400px",
          pointerEvents: "none",
        }}
      >
        <twisty-player
          ref={playerRef}
          puzzle="3x3x3"
          background="none"
          control-panel="none"
          viewer-link="none"
          hint-facelets="none"
        />
      </div>
    </div>
  );
};

export default GeneratePreviews;
