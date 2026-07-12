import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { HomePage } from "./pages/HomePage";

// La página de Awards se carga solo cuando se visita
const RPUAwardsPage = lazy(() =>
  import("./pages/RPUAwardsPage").then((m) => ({ default: m.RPUAwardsPage }))
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
          </Routes>
        </Suspense>
      </Router>
    </MotionConfig>
  );
}
