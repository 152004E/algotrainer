import { Routes, Route } from "react-router-dom"

import Home from "./Pages/Home"

import MainLayout from "./Layouts/MainLayout"
import TrainerLayout from "./Layouts/TrainerLayout"
import WVTrainer from "./Pages/trainer/MWTrainer"

function App() {
  return (
    <Routes>

      {/* WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* TRAINER */}
      <Route element={<TrainerLayout/>}>
        <Route path="/trainer/wv" element={<WVTrainer />} />
      </Route>

    </Routes>
  )
}

export default App