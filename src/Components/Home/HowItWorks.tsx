import { faCube, faEye, faList } from "@fortawesome/free-solid-svg-icons";
import fondoImg from "../../assets/fongoImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const steps = [
  {
    number: "1",
    icon: faList,
    title: "Selecciona un set",
    description:
      "Elige entre los sets predefinidos más populares o crea una lista personalizada con tus puntos débiles.",
  },
  {
    number: "2",
    icon: faEye,
    title: "Reconoce el caso",
    description:
      "Analiza el diagrama interactivo 3D. Entrena tu cerebro para identificar patrones visuales en milisegundos.",
  },
  {
    number: "3",
    icon: faCube,
    title: "Ejecuta y repite",
    description:
      "Practica la secuencia de movimientos hasta que se convierta en puro instinto y memoria muscular.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative  text-blue-500 dark:text-white py-24 px-6">
      {/* Background */}
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* top left blur */}
        <div
          className="absolute top-20 -left-40 w-125 h-125
    bg-white/40 dark:bg-blue-500/20
    rounded-full blur-[140px]"
        />

        {/* top right blur */}
        <div
          className="absolute top-20 -right-40 w-125 h-125
    bg-white/40 dark:bg-blue-500/20
    rounded-full blur-[140px]"
        />

        {/* bottom right blur */}
        <div
          className="absolute -bottom-40 -right-40 w-125 h-125
    bg-white/40 dark:bg-blue-600/20
    rounded-full blur-[140px]"
        />

        {/* bottom left blur */}
        <div
          className="absolute -bottom-40 -left-40 w-125 h-125
    bg-white/40 dark:bg-blue-600/20
    rounded-full blur-[140px]"
        />

        {/* IMAGE left */}
        <img
          src={fondoImg}
          alt="background cube"
          className="absolute bottom-4 left-0 w-72 opacity-20 pointer-events-none rotate-35"
        />

        {/* IMAGE right */}
        <img
          src={fondoImg}
          alt="background cube"
          className="absolute bottom-34 right-0 w-72 opacity-20 pointer-events-none -rotate-35"
        />
      </div>
      <div className="max-w-6xl mx-auto text-center">
        {/* title */}
        <h2 className="text-6xl font-bold mb-4">Cómo funciona</h2>
        <p className="text-gray-600 dark:text-white/60 mb-16">
          Tres simples pasos diseñados por expertos para acelerar tu
          aprendizaje.
        </p>

        {/* steps */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* circle */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full  text-white  bg-blue-600 flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>

                <div className="absolute -top-5 -right-4 bg-blue-600 w-7 h-7 flex items-center justify-center rounded-full">
                  <FontAwesomeIcon
                    icon={step.icon}
                    className="text-gray-300 text-xs"
                  />
                </div>
              </div>

              {/* title */}
              <h3 className="text-lg font-semibold mb-3">{step.title}</h3>

              {/* text */}
              <p className="text-gray-600 dark:text-white/80 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
