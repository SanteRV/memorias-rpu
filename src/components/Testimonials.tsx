import { motion } from "motion/react";
import { Quote, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Experiencia {
  id: number;
  nombre: string;
  departamento: string;
  experiencia: string;
  foto_url: string;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
      const response = await fetch(`${API_URL}/experiencias`);
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error al cargar testimonios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener un gradiente basado en el índice
  const getGradient = (index: number) => {
    return GRADIENTS[index % GRADIENTS.length];
  };

  return (
    <section id="testimonios" className="py-20 px-6 bg-gradient-to-br from-[var(--color-primary)] via-blue-900 to-[var(--color-primary)]">
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
            Cada foto con la historia de quien la vivió. Estos son los recuerdos que compartieron nuestros participantes.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="text-white animate-spin" size={48} />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => {
              const gradient = getGradient(index);
              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
                >
                  {/* Foto arriba (el contexto del comentario) */}
                  {testimonial.foto_url ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={testimonial.foto_url}
                        alt={`Recuerdo de ${testimonial.nombre}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                  ) : (
                    <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${gradient}`}>
                      <Quote className="text-white/80" size={56} />
                    </div>
                  )}

                  {/* Comentario debajo de la foto */}
                  <div className="flex flex-1 flex-col p-6">
                    <Quote
                      className={`mb-3 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
                      size={28}
                      strokeWidth={2.5}
                    />
                    <p className="mb-5 flex-1 italic leading-relaxed text-[var(--color-primary)]">
                      “{testimonial.experiencia}”
                    </p>

                    <div className="h-px w-full bg-[var(--color-accent)]" />

                    <div className="mt-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-bold text-white`}>
                        {testimonial.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold leading-tight text-[var(--color-primary)]">
                          {testimonial.nombre}
                        </p>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin size={14} strokeWidth={2.5} />
                          <span className="text-sm">{testimonial.departamento}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
