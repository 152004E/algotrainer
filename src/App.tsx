import { Routes, Route } from "react-router-dom"

import Home from "./Pages/Home"
import Trainer from "./Pages/Trainer"
import MainLayout from "./Layouts/MainLayout"

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trainer" element={<Trainer />} />
      </Route>
    </Routes>
  )
}

export default App