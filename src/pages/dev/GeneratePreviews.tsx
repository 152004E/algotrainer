import { useState, useRef, useCallback, useEffect } from "react";
import "cubing/twisty";
import { Alg } from "cubing/alg";

interface WVCase {
  id: string;
  name: string;
  shape: string;
  algorithm: string;
}

const WV_DATASET: WVCase[] = [
  { id: "wv-01", name: "3 Corners", shape: "Rectangle", algorithm: "L' U2 R U R' U2 L" },
  { id: "wv-02", name: "2 Corners", shape: "Rectangle", algorithm: "U' R' F R U R U' R' F'" },
  { id: "wv-03", name: "2 Corners", shape: "Snake", algorithm: "R U' R'" },
  { id: "wv-04", name: "2 Corners", shape: "Snake", algorithm: "R U' R' U R' U' R U' R' U2 R" },
  { id: "wv-05", name: "2 Corners", shape: "Tank", algorithm: "R2 D R' U' R D' R2" },
  { id: "wv-06", name: "2 Corners", shape: "Tank", algorithm: "R U R' U' R U' R'" },
  { id: "wv-07", name: "2 Corners", shape: "Adjacent", algorithm: "U' R U' R' U2 R U' R' U2 R U R'" },
  { id: "wv-08", name: "1 Corner", shape: "Adjacent", algorithm: "R U' R D' R U2 R' D R U2 R" },
  { id: "wv-09", name: "1 Corner", shape: "Adjacent", algorithm: "U' R' F' R U2 R U2 R' F" },
  { id: "wv-10", name: "1 Corner", shape: "Adjacent", algorithm: "U R U2 R'" },
  { id: "wv-11", name: "1 Corner", shape: "Adjacent", algorithm: "U R U' R' U' R' F R U R U' R' F'" },
  { id: "wv-12", name: "1 Corner", shape: "Bowtie", algorithm: "U' L' U R U' R' L" },
  { id: "wv-13", name: "1 Corner", shape: "Bowtie", algorithm: "U R2 D R' U2 R D' R2" },
  { id: "wv-14", name: "1 Corner", shape: "Bowtie", algorithm: "U R U2 R2 U' R U' R' U2 R" },
  { id: "wv-15", name: "1 Corner", shape: "Bowtie", algorithm: "U' R' F2 R F2 U L' U L" },
  { id: "wv-16", name: "1 Corner", shape: "Gun (Back)", algorithm: "R U R2 U' R2 U' R2 U2 R" },
  { id: "wv-17", name: "1 Corner", shape: "Gun (Far)", algorithm: "U R' U' R2 U' R2 U2 R" },
  { id: "wv-18", name: "1 Corner", shape: "Gun (Near)", algorithm: "U R U' R' U R U2 R'" },
  { id: "wv-19", name: "1 Corner", shape: "Gun (Sides)", algorithm: "R U' R' U R U2 R2 U' R2 U' R2 U2 R" },
  { id: "wv-20", name: "0 Corners", shape: "H (Front)", algorithm: "U R' U L U' R2 U L' U R'" },
  { id: "wv-21", name: "0 Corners", shape: "H (Side)", algorithm: "U R U' R' U R U' R' U R U2 R'" },
  { id: "wv-22", name: "0 Corners", shape: "Pi (Back)", algorithm: "R2 D R' U R D' R' U2 R'" },
  { id: "wv-23", name: "0 Corners", shape: "Pi (Far)", algorithm: "R U' R2 U2 R U R' U R" },
  { id: "wv-24", name: "0 Corners", shape: "Pi (Front)", algorithm: "U R U2 R2 U2 R U R' U R" },
  { id: "wv-25", name: "0 Corners", shape: "Pi (Near)", algorithm: "R U' R2 U' R U' R' U2 R" },
  { id: "wv-26", name: "0 Corners", shape: "Sune", algorithm: "R U R' U' R U R' U' R U' R'" },
  { id: "wv-27", name: "0 Corners", shape: "Sune", algorithm: "R U' R' U' R U R' U R U2 R'" },
];

const GeneratePreviews = () => {
  const playerRef = useRef<any>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [current, setCurrent] = useState("");
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [ready, setReady] = useState(false);
  const cancelledRef = useRef(false);

  const total = WV_DATASET.length;

  useEffect(() => {
    customElements
      .whenDefined("twisty-player")
      .then(() => {
        console.log("[WV Generator] twisty-player ready");
        setReady(true);
      })
      .catch((err) => {
        console.error("[WV Generator] Failed:", err);
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
    el.cameraLatitude = 35;
    el.cameraLongitude = 30;
    el.cameraDistance = 6;
    el.tempoScale = 10;

    const results: { id: string; url: string }[] = [];

    for (let i = 0; i < total; i++) {
      if (cancelledRef.current) {
        setStatus("idle");
        return;
      }

      const c = WV_DATASET[i];
      setCurrent(`${c.id} — ${c.name} ${c.shape}`);
      setProgress(i + 1);
      console.log(`[WV Generator] [${i + 1}/${total}] ${c.id} — ${c.algorithm}`);

      try {
        const inverseAlg = new Alg(c.algorithm).invert();
        const inverseStr = inverseAlg.toString();
        console.log(`[WV Generator]   setup: ${inverseStr}`);

        el.experimentalSetupAlg = inverseStr;
        el.experimentalSetupAnchor = "start";
        el.alg = "";

        await new Promise((r) => setTimeout(r, 800));

        const url = await el.experimentalScreenshot({ width: 400, height: 400 });

        if (typeof url === "string" && url.startsWith("data:image")) {
          results.push({ id: `${c.id}.png`, url });
          setImages([...results]);
          console.log(`[WV Generator] ✓ ${c.id}`);
        } else {
          throw new Error("Invalid screenshot result");
        }
      } catch (err) {
        const msg = `${c.id}: ${err instanceof Error ? err.message : String(err)}`;
        console.error(`[WV Generator] ✗ ${c.id} —`, err);
        setErrors((prev) => [...prev, msg]);
      }

      await new Promise((r) => setTimeout(r, 150));
    }

    console.log(`[WV Generator] Done. ${results.length}/${total} generated`);
    setStatus("done");
  }, [total]);

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
          WV Preview Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Generating {total} Winter Variation case previews via inverse setup
        </p>

        <div className="flex gap-4 mb-8 items-center">
          <button
            type="button"
            onClick={generate}
            disabled={status === "generating" || !ready}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition"
          >
            {status === "idle"
              ? "Generate WV Previews"
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
