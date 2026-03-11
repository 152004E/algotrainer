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
      <div className="relative w-full h-full bg-background-dark overflow-auto">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-xl"
        >
          ✕
        </button>

        <AlgorithmSection />

      </div>
    </div>
  )
}