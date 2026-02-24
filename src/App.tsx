import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Historic from "./pages/Historic";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="a-propos" element={<About />} />
          <Route path="evenements" element={<Events />} />
          <Route path="notre-histoire" element={<Historic />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
