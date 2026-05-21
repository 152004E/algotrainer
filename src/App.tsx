import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import About from "./pages/About";
import MainLayout from "./Layouts/MainLayout";
import TrainerLayout from "./Layouts/TrainerLayout";
import WVTrainer from "./pages/trainer/WVTrainer";
import MWTrainer from "./pages/trainer/MWTrainer";
import OLLTrainer from "./pages/trainer/OLLTrainer";
import PLLTrainer from "./pages/trainer/PLLTrainer";
import F2LTrainer from "./pages/trainer/F2LTrainer";

function App() {
  return (
    <Routes>
      {/* WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* TRAINER */}
      <Route element={<TrainerLayout />}>
        <Route path="/trainer/wv" element={<WVTrainer />} />
        <Route path="/trainer/mw" element={<MWTrainer />} />
        <Route path="/trainer/oll" element={<OLLTrainer />} />
        <Route path="/trainer/pll" element={<PLLTrainer />} />
        <Route path="/trainer/f2l" element={<F2LTrainer />} />
      </Route>
    </Routes>
  );
}

export default App;