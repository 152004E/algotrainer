import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";


interface NavbarProps {
  onOpenTrainerModal?: () => void;
}

const Navbar = ({ onOpenTrainerModal }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-transparent border-slate-200 dark:border-slate-800 dark:bg-blue-500/70 dark:backdrop-blur-md     backdrop-blur-md transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent!">
        <div className="flex h-16 items-center justify-between bg-transparent!">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/algoTrainerLogo-removebg-preview.png"
              alt="AlgoTrainer"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              AlgoTrainer
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 transition-all duration-500">
            <button
              type="button"
              onClick={onOpenTrainerModal}
              className="text-[15px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors  duration-500 bg-transparent border-none outline-none cursor-pointer"
              style={{ background: "none" }}
            >
              Trainer
            </button>

            <Link
              to="/algorithms"
              className="text-[15px] font-medium text-slate-700 dark:text-slate-300  hover:text-blue-600 transition-colors  duration-500"
            >
              Algoritmos
            </Link>

            <Link
              to="/about"
              className="text-[15px] font-medium text-slate-700 dark:text-slate-300  hover:text-blue-600 transition-colors  duration-500"
            >
              Acerca de
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;