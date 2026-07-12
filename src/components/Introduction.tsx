import { motion } from "motion/react";
import { Heart, Users, Star, Rocket, Trophy, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Introduction() {
  const features = [
    {
      icon: Heart,
      title: "Conexiones Verdaderas",
      description: "Amistades que trascienden fronteras",
      color: "from-pink-500 to-rose-500",
      iconColor: "text-white"
    },
    {
      icon: Users,
      title: "Unidad Nacional",
      description: "Diferentes culturas, un solo corazón",
      color: "from-blue-500 to-indigo-500",
      iconColor: "text-white"
    },
    {
      icon: Star,
      title: "Momentos Inolvidables",
      description: "Experiencias que marcan para siempre",
      color: "from-yellow-400 to-amber-500",
      iconColor: "text-white"
    }
  ];

  return (
    <section className="relative pb-24 px-6 bg-gradient-to-br from-[var(--color-primary)] via-blue-900 to-[var(--color-primary)] overflow-hidden" style={{ marginTop: '100px', paddingTop: '20px' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[var(--color-accent)]"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <motion.div
              className="mt-16"
              animate={{
                y: [0, -5, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Rocket className="text-white mx-auto" size={56} strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 text-white"
          >
            Un Viaje que Cambió Nuestras Vidas
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-32 h-1 mx-auto mb-10 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl mx-auto text-white/90 text-lg md:text-xl leading-relaxed mb-16"
          >
            El Intercambio Nacional no fue solo un evento, fue el comienzo de algo mucho más grande.
            Fue el espacio donde estudiantes de todo el país se reunieron para <span className="text-[var(--color-accent)] font-semibold">compartir</span>, <span className="text-[var(--color-accent)] font-semibold">aprender</span> y
            <span className="text-[var(--color-accent)] font-semibold"> crecer juntos</span>. Cada conversación, cada risada, cada momento compartido se convirtió en
            un lazo que nos unió más allá de las distancias. Aquí celebramos la diversidad,
            la amistad y la pasión por construir un futuro mejor, <span className="text-[var(--color-accent)] font-bold">juntos</span>.
          </motion.p>

          {/* RPU Awards Button - Prominent Version */}
          <Link to="/awards">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{
                scale: 1.15,
                boxShadow: "0 0 50px rgba(247, 197, 72, 1), 0 0 100px rgba(247, 197, 72, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative mt-8 bg-gradient-to-r from-yellow-400 via-[var(--color-accent)] to-yellow-400 text-[var(--color-primary)] px-12 py-6 rounded-full font-black text-2xl md:text-3xl flex items-center gap-4 shadow-2xl border-4 border-white hover:border-yellow-200 transition-all duration-300 mx-auto overflow-hidden group"
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ opacity: 0.5 }}
              />

              <motion.div
                className="relative z-10"
                animate={{
                  rotate: [0, -15, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <Trophy className="w-10 h-10" />
              </motion.div>

              <span className="relative z-10 font-black tracking-wide">VER RPU AWARDS</span>

              <motion.div
                className="relative z-10"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>

              {/* Sparkle effects around button */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${10 + i * 15}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{
                y: -12,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="relative text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl cursor-pointer group overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}
              >
                <feature.icon className={feature.iconColor} size={36} />

                {/* Pulsing ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${feature.color}`}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              </motion.div>

              <h3 className="mb-4 text-white font-bold text-xl group-hover:text-[var(--color-accent)] transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-white/80 group-hover:text-white transition-colors duration-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
