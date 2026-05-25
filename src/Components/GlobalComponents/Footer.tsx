import { Link } from "react-router-dom"
import { faDiscord, faGithub, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import fondoImg from "../../assets/fongoImg.png"

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 overflow-hidden">

      {/* Decorative background images */}
      <img
        src={fondoImg}
        alt=""
        className="absolute left-0 top-0 w-80 opacity-10 -rotate-12 pointer-events-none select-none"
      />

      <img
        src={fondoImg}
        alt=""
        className="absolute right-0 bottom-0 w-80 opacity-10 rotate-12 pointer-events-none select-none"
      />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo / About */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/algoTrainerLogo-removebg-preview.png"
                alt="AlgoTrainer"
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                AlgoTrainer
              </span>
            </Link>

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
              Plataforma para aprender y practicar algoritmos de Rubik's Cube.
              Mejora tu velocidad con sets completos de F2L, OLL y PLL.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Navegación
            </h3>

            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="hover:text-blue-500 cursor-pointer">Inicio</li>
              <li className="hover:text-blue-500 cursor-pointer">Algoritmos</li>
              <li className="hover:text-blue-500 cursor-pointer">Trainer</li>
              <li className="hover:text-blue-500 cursor-pointer">Scramble</li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Recursos
            </h3>

            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="hover:text-blue-500 cursor-pointer">Guías CFOP</li>
              <li className="hover:text-blue-500 cursor-pointer">Casos OLL</li>
              <li className="hover:text-blue-500 cursor-pointer">Casos PLL</li>
              <li className="hover:text-blue-500 cursor-pointer">Notación</li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Comunidad
            </h3>

            <div className="flex gap-4 text-xl">

              <a className="text-gray-500 hover:text-blue-500 transition">
                <FontAwesomeIcon icon={faGithub} />
              </a>

              <a className="text-gray-500 hover:text-indigo-500 transition">
                <FontAwesomeIcon icon={faDiscord} />
              </a>

              <a className="text-gray-500 hover:text-red-500 transition">
                <FontAwesomeIcon icon={faYoutube} />
              </a>

              <a className="text-gray-500 hover:text-pink-500 transition">
                <FontAwesomeIcon icon={faInstagram} />
              </a>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">

          <p>
            © {new Date().getFullYear()} AlgoTrainer. Todos los derechos reservados.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-blue-500 cursor-pointer">
              Privacidad
            </span>

            <span className="hover:text-blue-500 cursor-pointer">
              Términos
            </span>

            <span className="hover:text-blue-500 cursor-pointer">
              Contacto
            </span>
          </div>

        </div>

      </div>

    </footer>
  )
}

export default Footer