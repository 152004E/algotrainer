import { useParams, Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { algorithmCategories } from "../../data/algorithmCatalog";
import OLLCases from "../../data/OLLCases";
import PLLCases from "../../data/PLLCases";
import WVCases from "../../data/WVCases";
import MWCases from "../../data/MWCases";
import f2lCases from "../../data/f2lCases";
import type { AlgoCase } from "../../types";
import AlgorithmCard from "../../Components/algorithms/AlgorithmCard";
import AlgorithmFilter from "../../Components/algorithms/AlgorithmFilter";
import AlgorithmModal from "../../Components/algorithms/AlgorithmModal";
import "cubing/twisty";
import { resolveAllAlgorithms } from "../../utils/resolveVariants";
import { scrambleService } from "../../utils/scrambleService";

const dataMap: Record<string, AlgoCase[]> = {
  f2l: f2lCases,
  oll: OLLCases,
  pll: PLLCases,
  wv: WVCases,
  mw: MWCases,
  coll: [],
  zbll: [],
};

const MiniCubeIcon = ({ slug }: { slug: string }) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.alg = slug === "pll"
      ? "M2 U' M2 U2' M2 U' M2"
      : "R U R' U R U2' R' . R U2 R' U' R U' R'";
    const t = setTimeout(() => {
      try { el.controller.animationController.play({ loop: true }); } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [slug]);
  return (
    <twisty-player
      ref={ref}
      puzzle="3x3x3"
      background="white"
      control-panel="none"
      viewer-link="none"
      hint-facelets="none"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

const isPLLVariation = (id: string) => id.startsWith("oll-") || id.startsWith("wv-");

const STORAGE_KEY = (s: string) => `algotrainer:filters:${s}`;

const loadFilters = (slug: string | undefined) => {
  if (!slug) return { search: "", filters: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY(slug));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { search: "", filters: {} };
};

const saveFilters = (slug: string, search: string, filters: Record<string, string>) => {
  try {
    localStorage.setItem(STORAGE_KEY(slug), JSON.stringify({ search, filters }));
  } catch {}
};

const AlgorithmCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = algorithmCategories.find((c) => c.slug === slug);
  const allCases = slug ? dataMap[slug] ?? [] : [];

  const [search, setSearch] = useState(() => loadFilters(slug).search);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    () => loadFilters(slug).filters,
  );
  const [selectedAlg, setSelectedAlg] = useState<AlgoCase | null>(null);
  const [dynamicScramble, setDynamicScramble] = useState<string | undefined>(undefined);

  const selectedAlgAlgorithms = useMemo(
    () => selectedAlg ? resolveAllAlgorithms(selectedAlg, allCases) : null,
    [selectedAlg, allCases],
  );

  const prevSlug = useRef(slug);
  useEffect(() => {
    if (slug && slug !== prevSlug.current) {
      const data = loadFilters(slug);
      setSearch(data.search);
      setActiveFilters(data.filters);
    }
    prevSlug.current = slug;
  }, [slug]);

  useEffect(() => {
    if (slug) saveFilters(slug, search, activeFilters);
  }, [slug, search, activeFilters]);

  useEffect(() => {
    if (selectedAlg && isPLLVariation(selectedAlg.id)) {
      setDynamicScramble(undefined);
      scrambleService.generateScramble(selectedAlg).then(setDynamicScramble);
    } else {
      setDynamicScramble(undefined);
    }
  }, [selectedAlg]);

  const handleNewScramble = useCallback(() => {
    if (!selectedAlg) return;
    setDynamicScramble(undefined);
    scrambleService.generateScramble(selectedAlg).then(setDynamicScramble);
  }, [selectedAlg]);

  const filtered = useMemo(() => {
    return allCases.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.id.toLowerCase().includes(q) &&
          !c.algorithm.toLowerCase().includes(q)
        )
          return false;
      }
      for (const [key, value] of Object.entries(activeFilters)) {
        if (!value) continue;
        if (key === "difficulty" && c.difficulty !== value) return false;
        if (key === "corners" && c.corners !== Number(value)) return false;
        if (key === "description" && c.description !== value) return false;
        if (key === "edgeGroup" && c.edgeGroup !== value) return false;
        if (key === "shapeGroup" && c.shapeGroup !== value) return false;
      }
      return true;
    });
  }, [allCases, search, activeFilters]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Categoría no encontrada</h1>
        <Link to="/algorithms" className="text-blue-500 hover:text-blue-600 font-medium">
          ← Todos los algoritmos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/algorithms"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Todos los algoritmos
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white text-lg shadow-lg overflow-hidden`}
          >
            {category.slug === "oll" || category.slug === "pll" ? (
              <MiniCubeIcon slug={category.slug} />
            ) : (
              category.icon
            )}
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {category.description}
            </p>
          </div>
        </div>

        <div className="mt-8 mb-8">
          <AlgorithmFilter
            filters={category.filters}
            activeFilters={activeFilters}
            search={search}
            onFilterChange={(key, value) =>
              setActiveFilters((prev) => ({ ...prev, [key]: value }))
            }
            onSearchChange={setSearch}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
            {filtered.length}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {filtered.length === 1 ? "algoritmo" : "algoritmos"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((alg) => (
            <AlgorithmCard key={alg.id} alg={alg} onClick={setSelectedAlg} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 dark:text-slate-500 text-lg">
              Ningún algoritmo coincide con los filtros.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilters({});
              }}
              className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {selectedAlg && selectedAlgAlgorithms && (
        <AlgorithmModal
          alg={selectedAlg}
          allAlgorithms={selectedAlgAlgorithms}
          onClose={() => setSelectedAlg(null)}
          dynamicScramble={dynamicScramble}
          onNewScramble={isPLLVariation(selectedAlg.id) ? handleNewScramble : undefined}
        />
      )}
    </div>
  );
};

export default AlgorithmCategory;
