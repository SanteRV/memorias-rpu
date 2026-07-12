import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { RPUAwardsPage } from "./pages/RPUAwardsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/awards" element={<RPUAwardsPage />} />
      </Routes>
    </Router>
  );
}
