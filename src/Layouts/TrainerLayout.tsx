import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TrainerSidebar from "../Components/trainer/TrainerSidebar";
import TrainerTabs from "../Components/trainer/TrainerTabs";
import TrainerToolsSidebar from "../Components/trainer/TrainerToolsSidebar";

export default function TrainerLayout() {
  const location = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        const btn = document.querySelector<HTMLButtonElement>(
          "[data-next-case]"
        );
        const revealBtn = document.querySelector<HTMLButtonElement>(
          "[data-reveal-algo]"
        );

        const revealed =
          document.getElementById("algo-display") !== null;

        if (revealed) {
          btn?.click();
        } else {
          revealBtn?.click();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* LEFT SIDEBAR */}
      <TrainerSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-background-dark relative">
        {/* TABS */}
        <TrainerTabs />

        {/* TRAINER CONTENT */}
        <div className="max-w-3xl w-full flex flex-col items-center gap-8 mt-16">
          <Outlet />
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <TrainerToolsSidebar />
    </div>
  );
}
