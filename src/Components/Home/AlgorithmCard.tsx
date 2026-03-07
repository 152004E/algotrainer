import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faPlay } from "@fortawesome/free-solid-svg-icons"

type Props = {
  title: string
  description: string
  cases: number
  icon: IconDefinition
}

const AlgorithmCard = ({ title, description, cases, icon }: Props) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/40 transition-all hover:shadow-xl hover:-translate-y-1">

      {/* Icon */}
      <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
        {description}
      </p>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {cases} Casos
        </span>

        <FontAwesomeIcon
          icon={faPlay}
          className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

    </div>
  )
}

export default AlgorithmCard