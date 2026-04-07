import { Link } from "react-router-dom";
import AlgorithmCard from "./AlgorithmCard";
import fondoImg from "../../assets/fongoImg.png";
import {
  faSnowflake,
  faLayerGroup,
  faSun,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

const sets = [
  {
    title: "Winter Variation",
    description: "Optimiza tu última ranura de F2L",
    cases: 27,
    icon: faSnowflake,
    url: "/trainer/wv",
  },
  {
    title: "magic wonderful 3x3",
    description: "Optimiza tu última ranura de F2L",
    cases: 41,
    icon: faLayerGroup,
    url: "/trainer/mw",
  },
  {
    title: "OLL Full Set",
    description: "Orientación de la última capa",
    cases: 57,
    icon: faSun,
    url: "/trainer/oll",
  },
  {
    title: "PLL Full Set",
    description: "Permutación final del cubo",
    cases: 21,
    icon: faArrowsRotate,
    url: "/trainer/pll",
  },
];

const AlgorithmSection = () => {
  return (
    <section className="py-24 h-full relative overflow-hidden bg-blue-500 ">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* blur top */}
        <div
          className="absolute top-20 -left-40 w-125 h-125 bg-white/40 dark:bg-blue-500/20 rounded-full blur-[140px]"
        />
        {/* blur bottom */}
        <div
          className="absolute -bottom-40 -right-40 w-125 h-125 bg-white/40 dark:bg-blue-600/20 rounded-full blur-[140px]"
        />
        {/* IMAGE */}
        <img
          src={fondoImg}
          alt="background cube"
          className="absolute  bottom-4 left-0 w-72 opacity-20 pointer-events-none rotate-600"
        />
        {/* IMAGE */}
        <img
          src={fondoImg}
          alt="background cube"
          className="absolute  bottom-34 right-0 w-72 opacity-20 pointer-events-none rotate-600"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl  lg:text-6xl text-center mb-5 font-black leading-tight tracking-tight text-white dark:text-white">
          Selecciona un set de algoritmos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sets.map((set) => (
            <Link to={set.url} key={set.title} className="block">
              <AlgorithmCard
                title={set.title}
                description={set.description}
                cases={set.cases}
                icon={set.icon}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlgorithmSection;