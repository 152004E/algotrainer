import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Trainer from "./pages/Trainer";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trainer" element={<Trainer />} />
    </Routes>
  );
}

export default App;