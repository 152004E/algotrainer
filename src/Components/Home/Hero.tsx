import cubeHero from "../../assets/Rubik's_cube.svg";
import { Button } from "../GlobalComponents/Button";
import { faChartLine, faScroll } from "@fortawesome/free-solid-svg-icons";

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden  ">
      
      {/* Background blur */}
      <div className="absolute inset-0 z-0 overflow-hidden">

        {/* top blur */}
        <div className="absolute -top-40 -left-40 w-125 h-125 
        bg-blue-400/20 dark:bg-blue-500/20 
        rounded-full blur-[140px]" />

        {/* bottom blur */}
        <div className="absolute -bottom-40 -right-40 w-125 h-125 
        bg-blue-400/20 dark:bg-blue-500/20 
        rounded-full blur-[140px]" />

      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="flex flex-col gap-8">

            {/* badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full
            bg-blue-100 dark:bg-blue-900/40
            border border-blue-200 dark:border-blue-800
            text-blue-600 dark:text-blue-400
            text-xs font-bold uppercase tracking-widest">
              #1 Speedcubing Trainer
            </div>

            {/* title */}
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white">
              Domina tus <span className="text-blue-500">Algoritmos</span>
            </h1>

            {/* description */}
            <p className="text-[22px] text-slate-600 dark:text-slate-400 max-w-xl">
              La plataforma definitiva para speedcubers. Entrena tus casos,
              mejora tu reconocimiento y rompe tus récords personales.
            </p>

            {/* buttons */}
            <div className="flex gap-4 flex-wrap">

              <Button
                text="Empezar a entrenar"
                iconLetf={faChartLine}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 transition"
              />

              <Button
                text="Ver algoritmos"
                to="/algoritmos"
                iconRight={faScroll}
                className="px-8 py-4 bg-white text-blue-600! border border-slate-300 font-bold rounded-xl hover:bg-slate-50 
                dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 transition"
              />

            </div>

            {/* users text */}
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              +2,000 cubers entrenando hoy
            </p>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative group">

            <div className="absolute inset-1 
            bg-linear-to-r from-blue-200 to-blue-500 
            dark:from-blue-500 dark:to-blue-700 
            rounded-2xl blur opacity-25 
            group-hover:opacity-40 transition duration-1000" />

            <div className="relative aspect-square rounded-2xl overflow-hidden 
            bg-slate-100 dark:bg-slate-800 shadow-2xl">

              <img
                src={cubeHero}
                alt="Rubik Cube"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-700 p-6"
              />

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;