import { Link, useLocation } from "react-router-dom";

const tabs = [
  { path: "/trainer/f2l", label: "F2L" },
  { path: "/trainer/wv", label: "WV" },
  { path: "/trainer/mw", label: "MW" },
  { path: "/trainer/oll", label: "OLL" },
  { path: "/trainer/pll", label: "PLL" },
];

export default function TrainerTabs() {
  const location = useLocation();

  return (
    <div className="absolute top-0 left-0 right-0 p-6 flex justify-center border-b border-slate-200 dark:border-slate-800">
      <nav className="flex items-center gap-8">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={
                isActive
                  ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1"
                  : "text-gray-400 hover:text-gray-600"
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
