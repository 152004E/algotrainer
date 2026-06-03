import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import type { AlgorithmCategory } from "../../types";
import "cubing/twisty";

interface Props {
  category: AlgorithmCategory;
}

const MiniCube = ({ slug }: { slug: string }) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.alg = slug === "pll"
      ? "M2 U' M2 U2' M2 U' M2 . M2 U' M2 U2' M2 U' M2"
      : "R U R' U R U2' R' . R U2 R' U' R U' R'";
    const t = setTimeout(() => {
      try {
        el.controller.animationController.play({ loop: true });
      } catch {}
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

const AlgorithmCategoryCard = ({ category }: Props) => {
  return (
    <Link
      to={`/algorithms/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 
        bg-white dark:bg-slate-800/80 
        hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 
        transition-all duration-500 hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.lightGradient} dark:opacity-0 opacity-50 transition-opacity duration-500`}
      />

      <div className="relative p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white text-xl shadow-lg`}
          >
            {category.slug === "oll" || category.slug === "pll" ? (
              <MiniCube slug={category.slug} />
            ) : (
              category.icon
            )}
          </div>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            {category.count} alg.
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Explorar</span>
          <span className="text-lg leading-none">→</span>
        </div>
      </div>
    </Link>
  );
};

export default AlgorithmCategoryCard;
