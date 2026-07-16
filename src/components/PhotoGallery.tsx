import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Image } from "./Image";
import { X, Play } from "lucide-react";
import { Slideshow } from "./Slideshow";
import img1 from "../image/recuerdos/1.jpeg";
import img2 from "../image/recuerdos/2.jpeg";
import img3 from "../image/recuerdos/3.jpeg";
import img4 from "../image/recuerdos/4.jpg";
import img5 from "../image/recuerdos/5.jpg";
import img9 from "../image/recuerdos/9.jpeg";
import img10 from "../image/recuerdos/10.jpeg";
import img11 from "../image/recuerdos/11.jpeg";
import img12 from "../image/recuerdos/12.jpeg";
import img13 from "../image/recuerdos/13.jpeg";

interface PhotoType {
  url: string;
  alt: string;
  isStatic: boolean;
}

// Fotos curadas del evento (exportadas también para el anuario imprimible)
export const STATIC_PHOTOS: PhotoType[] = [
  { url: img12, alt: "Almuerzo compartido en Ica", isStatic: true },
  { url: img13, alt: "Paseo por el campus con antojos", isStatic: true },
  { url: img1, alt: "Momentos inolvidables", isStatic: true },
  { url: img2, alt: "Unidos por la amistad", isStatic: true },
  { url: img3, alt: "Celebrando juntos", isStatic: true },
  { url: img4, alt: "Compartiendo experiencias", isStatic: true },
  { url: img5, alt: "Recuerdos que perduran", isStatic: true },
  { url: img9, alt: "Lazos que nos unen", isStatic: true },
  { url: img10, alt: "Diversidad y unidad", isStatic: true },
  { url: img11, alt: "Un viaje compartido", isStatic: true }
];

export function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoType | null>(null);
  const [showSlideshow, setShowSlideshow] = useState(false);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    if (selectedPhoto) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  const allPhotos = STATIC_PHOTOS;

  return (
    <section id="galeria" className="py-20 px-6 bg-gradient-to-br from-[var(--color-primary)] via-blue-900 to-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-6 text-white">
            Galería de Momentos
          </h2>
          <div className="w-24 h-1 mx-auto mb-8 bg-[var(--color-accent)]"></div>
          <p className="max-w-2xl mx-auto text-white/90 text-lg">
            Cada foto cuenta una historia. Revive con nosotros los momentos más especiales de nuestro intercambio.
          </p>
          <motion.button
            onClick={() => setShowSlideshow(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3 font-semibold text-[var(--color-primary)] shadow-lg transition-shadow hover:shadow-xl"
          >
            <Play size={20} fill="currentColor" />
            Ver en presentación
          </motion.button>
        </motion.div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 768: 3 }}>
          <Masonry gutter="1rem">
            {allPhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setSelectedPhoto(photo)}
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white group"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-medium">{photo.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {/* Modal de imagen ampliada */}
        <AnimatePresence mode="wait">
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 sm:p-8 cursor-zoom-out overflow-y-auto"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(null);
                }}
                className="fixed top-4 right-4 z-[10000] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={28} />
              </motion.button>

              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 100 }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-[95vw] max-h-[90vh] cursor-default flex flex-col items-center justify-center"
              >
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.alt}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain shadow-2xl"
                  style={{ maxHeight: '90vh', borderRadius: '5px' }}
                />
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-lg"
                >
                  <p className="text-white text-base sm:text-lg font-medium text-center">
                    {selectedPhoto.alt}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modo presentación (slideshow con música) */}
        <AnimatePresence>
          {showSlideshow && (
            <Slideshow
              photos={allPhotos.map((p) => ({ url: p.url, alt: p.alt }))}
              onClose={() => setShowSlideshow(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
