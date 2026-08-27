import { Link, useLocation } from "react-router-dom";

const tabs = [
  { path: "/trainer/f2l", label: "F2L Trainer" },
  { path: "/trainer/oll", label: "OLL Practice" },
  { path: "/trainer/pll", label: "PLL Time Attack" },
  { path: "/trainer/wv", label: "WV" },
  { path: "/trainer/mw", label: "MW" },
];

export default function TrainerTabs() {
  const location = useLocation();

  return (
        <div className="w-full p-6 flex justify-center border-b border-slate-100 dark:border-slate-800">
      <nav className="flex items-center gap-8">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary pb-1 transition-colors"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium"
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
