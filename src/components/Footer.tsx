import { motion } from "motion/react";
import { Heart, MapIcon } from "lucide-react";
import { PeruMap3D } from "./PeruMap3DHybrid";

export function Footer() {

  return (
    <footer className="py-20 px-6 bg-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo/Symbol */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center bg-[var(--color-accent)]"
          >
            <Heart className="text-white" size={48} />
          </motion.div>

          <h2 className="text-white mb-6">
            Gracias por Ser Parte de Esta Historia
          </h2>

          <div className="w-24 h-1 mx-auto mb-8 bg-[var(--color-accent)]"></div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/90 max-w-3xl mx-auto mb-8 text-lg leading-relaxed"
          >
            Este intercambio fue posible gracias a cada uno de ustedes. A los organizadores que 
            soñaron, a los participantes que se atrevieron, y a todos los que creyeron que la 
            unidad es más fuerte que cualquier distancia. Que estos recuerdos nos acompañen siempre 
            y nos inspiren a seguir construyendo puentes de amistad y colaboración.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 mb-16"
          >
            <p className="text-white/90 italic text-xl mb-2">
              "El verdadero viaje no termina cuando regresamos a casa,"
            </p>
            <p className="text-white/90 italic text-xl">
              "termina cuando dejamos de recordar."
            </p>
          </motion.div>

          {/* 3D Interactive Map */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <MapIcon className="text-[var(--color-accent)]" size={32} />
              <h3 className="text-white text-2xl font-bold">
                Mapa Interactivo del Perú
              </h3>
            </div>
            <p className="text-white/80 text-center mb-8 max-w-2xl mx-auto">
              Explora las regiones del Perú en 3D. Haz clic en cualquier región para ver más detalles.
            </p>
            <PeruMap3D />
          </motion.div> */}

          {/* Organization Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="border-t pt-8"
            style={{ borderColor: "#FFFFFF33" }}
          >
            <p className="text-white/70 mb-2">Intercambio Nacional 2025</p>
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Todos los derechos reservados. Hecho con{" "}
              <Heart className="inline-block" size={14} /> por Manu.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
