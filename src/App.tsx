import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { HomePage } from "./pages/HomePage";

// Páginas secundarias: se cargan solo cuando se visitan
const RPUAwardsPage = lazy(() =>
  import("./pages/RPUAwardsPage").then((m) => ({ default: m.RPUAwardsPage }))
);
const AnuarioLibro = lazy(() =>
  import("./pages/AnuarioLibro").then((m) => ({ default: m.AnuarioLibro }))
);

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[var(--color-primary)]" />
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/awards" element={<RPUAwardsPage />} />
            <Route path="/anuario" element={<AnuarioLibro />} />
          </Routes>
        </Suspense>
      </Router>
    </MotionConfig>
  );
}
