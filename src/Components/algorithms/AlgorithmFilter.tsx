import type { FilterOption } from "../../types";

interface Props {
  filters: FilterOption[];
  activeFilters: Record<string, string>;
  search: string;
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
}

const filterLabels: Record<string, Record<string, string>> = {
  difficulty: { Easy: "Fácil", Medium: "Medio", Hard: "Difícil" },
  corners: { "3": "3 Esquinas", "2": "2 Esquinas", "1": "1 Esquina", "0": "0 Esquinas" },
  edgeGroup: {
    all: "Todas las aristas orientadas",
    l: "Dos aristas orientadas (L)",
    line: "Dos aristas orientadas (Línea)",
    corners: "Todas las esquinas orientadas",
    none: "Ninguna arista orientada",
  },
};

const AlgorithmFilter = ({ filters, activeFilters, search, onFilterChange, onSearchChange }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar algoritmos..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 
            bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
            transition-all"
        />
      </div>

      {filters.map((filter) => {
        if (filter.dependent) {
          const parentVal = activeFilters[filter.key];
          const childOptions = parentVal ? filter.dependent.options[parentVal] ?? [] : [];
          return (
            <div key={filter.key} className="flex gap-3">
              <select
                value={parentVal || ""}
                onChange={(e) => {
                  onFilterChange(filter.key, e.target.value);
                  onFilterChange(filter.dependent!.key, "");
                }}
                className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 
                  bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                  transition-all"
              >
                <option value="">{filter.label}</option>
                {filter.values.map((v) => (
                  <option key={v} value={v}>
                    {filterLabels[filter.key]?.[v] ?? v}
                  </option>
                ))}
              </select>
              <select
                value={activeFilters[filter.dependent.key] || ""}
                onChange={(e) => onFilterChange(filter.dependent!.key, e.target.value)}
                disabled={!parentVal}
                className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 
                  bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                  transition-all capitalize disabled:opacity-40"
              >
                <option value="">{filter.dependent.label}</option>
                {childOptions.map((v) => (
                  <option key={v} value={v}>
                    {filter.dependent!.labels[parentVal]?.[v] ?? v}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <select
            key={filter.key}
            value={activeFilters[filter.key] || ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 
              bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
              transition-all capitalize"
          >
            <option value="">{filter.label}</option>
            {filter.values.map((v) => (
              <option key={v} value={v}>
                {filterLabels[filter.key]?.[v] ?? v}
              </option>
            ))}
          </select>
        );
      })}
    </div>
  );
};

export default AlgorithmFilter;
