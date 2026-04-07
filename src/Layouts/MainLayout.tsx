
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/GlobalComponents/Navbar";
import Footer from "../Components/GlobalComponents/Footer";
import TrainerModal from "../Components/Modals/TrainerModal";

const MainLayout = () => {
  const [isTrainerModalOpen, setTrainerModalOpen] = useState(false);

  return (
    <>
      <Navbar onOpenTrainerModal={() => setTrainerModalOpen(true)} />
      <main className="dark:bg-slate-900">
        <Outlet />
      </main>
      <Footer />
      <TrainerModal isOpen={isTrainerModalOpen} onClose={() => setTrainerModalOpen(false)} />
    </>
  );
};

export default MainLayout;