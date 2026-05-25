
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/GlobalComponents/Navbar";
import Footer from "../Components/GlobalComponents/Footer";
import TrainerModal from "../Components/Modals/TrainerModal";

const MainLayout = () => {
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);

  return (
    <>
      <Navbar onOpenTrainerModal={() => setIsTrainerModalOpen(true)} />
      <main className="bg-white dark:bg-background-dark">
        <Outlet />
      </main>
      <Footer />
      <TrainerModal isOpen={isTrainerModalOpen} onClose={() => setIsTrainerModalOpen(false)} />
    </>
  );
};

export default MainLayout;