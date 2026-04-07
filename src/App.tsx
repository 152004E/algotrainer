import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import MainLayout from "./Layouts/MainLayout";
import TrainerLayout from "./Layouts/TrainerLayout";
import MWTrainer from "./Pages/trainer/MWTrainer";
import OLLTrainer from "./Pages/trainer/OLLTrainer";
import PLLTrainer from "./Pages/trainer/PLLTrainer";

function App() {
  return (
    <Routes>
      {/* WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* TRAINER */}
      <Route element={<TrainerLayout />}>
        <Route path="/trainer/wv" element={<MWTrainer />} />
        <Route path="/trainer/mw" element={<OLLTrainer />} />
        <Route path="/trainer/oll" element={<OLLTrainer />} />
        <Route path="/trainer/pll" element={<PLLTrainer />} />
      </Route>
    </Routes>
  );
}

export default App;