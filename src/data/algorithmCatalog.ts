import type { AlgorithmCategory } from "../types";

export const algorithmCategories: AlgorithmCategory[] = [
  {
    slug: "f2l",
    name: "F2L",
    description: "Primeras Dos Capas — inserción de pares esquina-arista",
    icon: "🔲",
    gradient: "from-blue-600 to-blue-400",
    lightGradient: "from-blue-50 to-blue-100",
    count: 41,
    filters: [
      { key: "difficulty", label: "Dificultad", values: ["Easy", "Medium", "Hard"] },
    ],
  },
  {
    slug: "oll",
    name: "OLL",
    description: "Orientar la Última Capa — 57 algoritmos para orientar la última capa",
    icon: "⬡",
    gradient: "from-orange-600 to-orange-400",
    lightGradient: "from-orange-50 to-orange-100",
    count: 57,
    filters: [
      { key: "difficulty", label: "Dificultad", values: ["Easy", "Medium", "Hard"] },
    ],
  },
  {
    slug: "pll",
    name: "PLL",
    description: "Permutar la Última Capa — 21 algoritmos para permutar la última capa",
    icon: "🔄",
    gradient: "from-red-600 to-red-400",
    lightGradient: "from-red-50 to-red-100",
    count: 21,
    filters: [
      { key: "difficulty", label: "Dificultad", values: ["Easy", "Medium", "Hard"] },
    ],
  },
  {
    slug: "wv",
    name: "Winter Variation",
    description: "Si la cruz superior está resuelta, Winter Variation inserta el último par mientras resuelve OLL.",
    icon: "❄️",
    gradient: "from-emerald-600 to-emerald-400",
    lightGradient: "from-emerald-50 to-emerald-100",
    count: 27,
    filters: [
      { key: "corners", label: "Esquinas orientadas", values: ["3", "2", "1", "0"] },
    ],
  },
  {
    slug: "mw",
    name: "Magic Wonderful",
    description: "Técnicas avanzadas de inserción en el último slot",
    icon: "✨",
    gradient: "from-purple-600 to-purple-400",
    lightGradient: "from-purple-50 to-purple-100",
    count: 32,
    filters: [
      { key: "difficulty", label: "Dificultad", values: ["Easy", "Medium", "Hard"] },
    ],
  },
  {
    slug: "coll",
    name: "COLL",
    description: "Esquinas de la Última Capa — orienta y permuta las esquinas en un solo algoritmo",
    icon: "◆",
    gradient: "from-cyan-600 to-cyan-400",
    lightGradient: "from-cyan-50 to-cyan-100",
    count: 42,
    filters: [
      { key: "difficulty", label: "Dificultad", values: ["Easy", "Medium", "Hard"] },
    ],
  },
  {
    slug: "zbll",
    name: "ZBLL",
    description: "ZBLL — resuelve la última capa cuando las aristas están orientadas",
    icon: "⬟",
    gradient: "from-pink-600 to-pink-400",
    lightGradient: "from-pink-50 to-pink-100",
    count: 493,
    filters: [
      { key: "difficulty", label: "Dificultad", values: ["Easy", "Medium", "Hard"] },
    ],
  },
];
