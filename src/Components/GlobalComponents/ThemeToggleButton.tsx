import { useEffect, useState } from "react";

export const ThemeToggleButton = () => {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="size-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-all"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="material-symbols-outlined">
        {darkMode ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
};
