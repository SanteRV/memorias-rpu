import { motion } from "motion/react";
import { Quote, MapPin, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Experiencia {
  id: number;
  nombre: string;
  departamento: string;
  experiencia: string;
  foto_url: string;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

// Array de gradientes para rotar entre las cards
const GRADIENTS = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-cyan-500 to-blue-500",
  "from-yellow-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-red-500 to-pink-500",
  "from-indigo-500 to-purple-500"
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Experiencia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching testimonials from:', `${API_URL}/experiencias`);
      const response = await fetch(`${API_URL}/experiencias`);
      const data = await response.json();

      console.log('Response data:', data);
      console.log('Testimonials length:', data.data?.length);

      if (data.success) {
        setTestimonials(data.data);
        console.log('Testimonials set:', data.data);
      }
    } catch (error) {
      console.error('Error al cargar testimonios:', error);
    } finally {
      setIsLoading(false);
      console.log('Loading finished');
    }
  };

  // Función para obtener un gradiente basado en el índice
  const getGradient = (index: number) => {
    return GRADIENTS[index % GRADIENTS.length];
  };

  console.log('RENDER - isLoading:', isLoading, 'testimonials.length:', testimonials.length);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[var(--color-primary)] via-blue-900 to-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-6 text-white">
            Voces del Intercambio
          </h2>
          <div className="w-24 h-1 mx-auto mb-8 bg-[var(--color-accent)]"></div>
          <p className="max-w-2xl mx-auto text-white/90 text-lg">
            Escucha lo que nuestros participantes tienen que decir sobre esta experiencia transformadora.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="text-white animate-spin" size={48} />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ overflow: 'visible' }}>
            {testimonials.map((testimonial, index) => {
              const gradient = getGradient(index);
              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                  }}
                  className="bg-white rounded-3xl p-8 shadow-2xl relative group"
                  style={{
                    borderRadius: '2rem',
                    clipPath: 'none'
                  }}
                >
                  {/* Decorative corner shapes */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`}></div>
                  <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${gradient} opacity-10 rounded-tr-full`}></div>

                  {/* Gradient border animation */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100`}
                    style={{
                      padding: '3px',
                      borderRadius: '2rem',
                      clipPath: 'none',
                      zIndex: -1
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Quote icon with gradient */}
                  <motion.div
                    className={`absolute -top-5 -right-5 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${gradient} shadow-xl`}
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Quote className="text-white" size={32} />

                    {/* Pulsing ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient}`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.4
                      }}
                    />
                  </motion.div>

                  {/* Icon in corner - centered on top left corner */}
                  <div
                    className="absolute w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
                    style={{ backgroundColor: '#F7C548', zIndex: 30, top: '-24px', left: '-24px' }}
                  >
                    <Sparkles className="text-white" size={22} strokeWidth={2.5} />
                  </div>

                  <p className="text-[var(--color-primary)] italic mb-6 mt-6 leading-relaxed relative text-base" style={{ zIndex: 5 }}>
                    "{testimonial.experiencia}"
                  </p>

                  {/* Golden line separator */}
                  <div
                    className="w-full mb-4 relative z-10"
                    style={{
                      height: '2px',
                      backgroundColor: '#F7C548',
                      opacity: 1
                    }}
                  />

                  <div className="relative z-10">
                    <p className="text-[var(--color-primary)] font-bold text-lg mb-2">
                      {testimonial.nombre}
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MapPin className={`bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} size={18} strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 8px rgba(247, 197, 72, 0.5))' }} />
                      </motion.div>
                      <p className="text-gray-600 text-sm font-medium">{testimonial.departamento}</p>
                    </div>
                  </div>

                  {/* Decorative side accent */}
                  <motion.div
                    className={`absolute left-0 top-1/4 w-1.5 h-1/2 bg-gradient-to-b ${gradient} rounded-r-full`}
                    initial={{ height: "0%" }}
                    whileInView={{ height: "50%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">Aún no hay testimonios compartidos. ¡Sé el primero en compartir tu experiencia!</p>
          </div>
        )}
      </div>
    </section>
  );
}
