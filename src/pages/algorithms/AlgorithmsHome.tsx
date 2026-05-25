import { algorithmCategories } from "../../data/algorithmCatalog";
import AlgorithmCategoryCard from "../../Components/algorithms/AlgorithmCategoryCard";

const AlgorithmsHome = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-full
            bg-blue-100 dark:bg-blue-900/40
            border border-blue-200 dark:border-blue-800
            text-blue-600 dark:text-blue-400
            text-xs font-bold uppercase tracking-widest mb-5">
            Biblioteca de Algoritmos
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Todos los Algoritmos
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Aprende, visualiza y practica todos tus algoritmos de speedcubing.
            Explora por categoría y domina cada caso.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithmCategories.map((cat) => (
            <AlgorithmCategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsHome;
