import { RPUAwards } from "../components/RPUAwards";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function RPUAwardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] via-purple-900 to-pink-900">
      {/* Navigation Button */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/">
          <motion.button
            className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <Home className="w-5 h-5" />
            <span className="font-semibold">Volver al Inicio</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* RPU Awards Component */}
      <RPUAwards />
    </div>
  );
}
