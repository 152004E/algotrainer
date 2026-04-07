import AlgorithmSection from "../Home/AlgorithmSection"


interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function TrainerModal({ isOpen, onClose }: Props) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* background blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-background-dark border border-blue-400 rounded-3xl shadow-3xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto p-10 z-20 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-white text-3xl z-30 hover:text-blue-400 transition-colors cursor-pointer"
          style={{ lineHeight: 1 }}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <div className="w-full">
          <AlgorithmSection />
        </div>
      </div>
    </div>
  )
}