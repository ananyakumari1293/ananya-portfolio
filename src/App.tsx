import { BrowserRouter, Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";

import FlowerGarden from "./pages/FlowerGarden";
import FruitNinja from "./pages/FruitNinja";
import BowlingZone from "./pages/BowlingZone";
import CookingMama from "./pages/CookingMama";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Hero />} />

        <Route
          path="/flower-garden"
          element={<FlowerGarden />}
        />

        <Route
          path="/fruit-ninja"
          element={<FruitNinja />}
        />

        <Route
          path="/bowling-zone"
          element={<BowlingZone />}
        />

        <Route
          path="/cooking-mama"
          element={<CookingMama />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;