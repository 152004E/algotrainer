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
      {
        key: "edgeGroup",
        label: "Estado de la última capa",
        values: ["all", "l", "line", "none", "corners"],
        dependent: {
          key: "shapeGroup",
          label: "Caso",
          options: {
            all: ["sune", "anti-sune", "h-cross", "pi", "u", "t", "diagonals"],
            l: ["p-shapes", "w-shapes", "l-shapes", "fish-shapes", "awkward-shapes", "square-shapes", "lightning-shapes", "small-lightning"],
            line: ["i-shapes", "big-lightning", "knight-shapes", "t-shapes", "c-shapes"],
            none: ["0", "1", "2", "4"],
            corners: [],
          },
          labels: {
            all: { sune: "Sune", "anti-sune": "Anti-Sune", "h-cross": "H-Cross", pi: "Pi", u: "U", t: "T", diagonals: "Diagonals" },
            l: { "p-shapes": "P Shapes", "w-shapes": "W Shapes", "l-shapes": "L Shapes", "fish-shapes": "Fish Shapes", "awkward-shapes": "Awkward Shapes", "square-shapes": "Square Shapes", "lightning-shapes": "Lightning Shapes", "small-lightning": "Small Lightning" },
            line: { "i-shapes": "I Shapes", "big-lightning": "Big Lightning Bolt", "knight-shapes": "Knight Move Shapes", "t-shapes": "T Shapes", "c-shapes": "C Shapes" },
            none: { "0": "0 Esquinas", "1": "1 Esquina", "2": "2 Esquinas", "4": "4 Esquinas" },
          },
        },
      },
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
      { key: "edgeGroup", label: "Grupo", values: ["edges", "corners", "both"] },
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
