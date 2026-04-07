import TrainerSidebar from "../Components/trainer/TrainerSidebar";
import TrainerTabs from "../Components/trainer/TrainerTabs";
import ScrambleBox from "../Components/trainer/ScrambleBox";
import CubeViewer from "../Components/trainer/CubeViewer";
import AlgorithmBox from "../Components/trainer/AlgorithmBox";
import NextCaseButton from "../Components/trainer/NextCaseButton";
import TrainerToolsSidebar from "../Components/trainer/TrainerToolsSidebar";

export default function Trainer() {
	// Datos estáticos de ejemplo
	const scramble = "R2 U B2 L2 U' R2 U' B2 U' L' B' R' D2 L2 B' D' R";
	const algorithm = "(R U R' U') (R' F R2 U') R' U' (R U R' F')";

	return (
		<div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
			{/* Sidebar izquierda */}
			<TrainerSidebar />

			{/* Main content */}
			<main className="flex-1 flex flex-col items-center justify-center p-8 relative">
				{/* Tabs arriba */}
				<TrainerTabs />

				<div className="max-w-3xl w-full flex flex-col items-center gap-8 mt-24">
					{/* Scramble */}
					<ScrambleBox scramble={scramble} />

					{/* Cube viewer y acciones */}
					<div className="relative group">
						<div className="absolute -inset-4 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700" />
						<div className="relative">
							<CubeViewer />
							{/* Botones de acción (simulados) */}
							<div className="absolute bottom-4 right-4 flex gap-2">
								<button className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
									<span className="material-symbols-outlined text-sm">refresh</span>
								</button>
								<button className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
									<span className="material-symbols-outlined text-sm">3d_rotation</span>
								</button>
							</div>
						</div>
					</div>

					{/* Algoritmo recomendado y botón */}
					<div className="w-full text-center space-y-6">
						<div className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-500 rounded-full text-sm font-bold">
							RECOMMENDED ALGORITHM
						</div>
						<AlgorithmBox algorithm={algorithm} />
						<div className="pt-4">
							<NextCaseButton onNext={() => {}} />
							<p className="mt-4 text-slate-400 text-sm">
								Press <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">SPACE</kbd> to skip to next case
							</p>
						</div>
					</div>
				</div>

				{/* Footer meta info */}
				<div className="absolute bottom-8 text-center text-slate-400 text-sm w-full">
					Practice Session: F2L Pair 17 (Hidden Back Slot) • Difficulty: <span className="text-amber-500 font-bold">Intermediate</span>
				</div>
			</main>

			{/* Sidebar derecha */}
			<TrainerToolsSidebar />
		</div>
	);
}
