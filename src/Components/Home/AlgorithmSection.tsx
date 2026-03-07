import AlgorithmCard from "./AlgorithmCard"

import { 
  faSnowflake,
  faLayerGroup,
  faSun,
  faArrowsRotate
} from "@fortawesome/free-solid-svg-icons"

const AlgorithmSection = () => {
  return (
<section className="py-24 relative overflow-hidden bg-blue-500 dark:bg-slate-900">
  
  {/* Background blur */}
  <div className="absolute inset-0 z-0 overflow-hidden">

    {/* top blur */}
    <div
      className="absolute top-20 -left-40 w-125 h-125
      bg-white/40 dark:bg-blue-500/20
      rounded-full blur-[140px]"
    />

    {/* bottom blur */}
    <div
      className="absolute -bottom-40 -right-40 w-125 h-125
      bg-white/40 dark:bg-blue-600/20
      rounded-full blur-[140px]"
    />

  </div>

  <div className="max-w-7xl mx-auto px-4 relative z-10">

    <h2 className="text-4xl  lg:text-6xl text-center mb-5 font-black leading-tight tracking-tight text-white dark:text-white">
      Selecciona un set de algoritmos
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <AlgorithmCard
        title="Winter Variation"
        description="Optimiza tu última ranura de F2L"
        cases={27}
        icon={faSnowflake}
      />

      <AlgorithmCard
        title="Magic F2L"
        description="Trucos avanzados para F2L"
        cases={41}
        icon={faLayerGroup}
      />

      <AlgorithmCard
        title="OLL Full Set"
        description="Orientación de la última capa"
        cases={57}
        icon={faSun}
      />

      <AlgorithmCard
        title="PLL Full Set"
        description="Permutación final del cubo"
        cases={21}
        icon={faArrowsRotate}
      />

    </div>
  </div>
</section>
  )
}

export default AlgorithmSection