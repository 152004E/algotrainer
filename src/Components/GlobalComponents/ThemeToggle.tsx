import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ThemeToggle = () => {
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

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;

    if (!document.startViewTransition) {
      setDarkMode((prev) => !prev);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setDarkMode((prev) => !prev);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300
          ${darkMode ? "bg-blue-700" : "bg-gray-300"}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center
          ${darkMode ? "translate-x-7" : "translate-x-0"}`}>
          <FontAwesomeIcon
            icon={darkMode ? faMoon : faSun}
            className={`text-[10px] ${darkMode ? "text-indigo-500" : "text-yellow-500"}`}
          />
        </div>
      </button>
    </div>
  );
};