import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import musicaFondo from '../mp3/musica_fondo.mp3';

interface SlidePhoto {
  url: string;
  alt: string;
}

interface SlideshowProps {
  photos: SlidePhoto[];
  onClose: () => void;
}

const INTERVALO = 4500; // ms entre fotos

export function Slideshow({ photos, onClose }: SlideshowProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const next = () => setIndex((i) => (i + 1) % photos.length);
  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);

  // Auto-avance
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(next, INTERVALO);
    return () => clearTimeout(t);
  }, [index, playing, photos.length]);

  // Música: intenta reproducir al abrir (el clic que abrió el modo es el gesto)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.6;
      audio.play().catch(() => {});
    }
    return () => {
      if (audio) audio.pause();
    };
  }, []);

  // Bloquear scroll del fondo + atajos de teclado
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    setPlaying((p) => {
      const nuevo = !p;
      if (audio) nuevo ? audio.play().catch(() => {}) : audio.pause();
      return nuevo;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
    >
      <audio ref={audioRef} src={musicaFondo} loop preload="auto" />

      {/* Imagen con efecto Ken Burns + crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={index}
          src={photos[index].url}
          alt={photos[index].alt}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: INTERVALO / 1000 + 1, ease: 'linear' } }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </AnimatePresence>

      {/* Degradados para legibilidad de los controles */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Título de la foto */}
      <div className="absolute bottom-16 left-0 right-0 px-6 text-center">
        <p className="text-lg font-medium text-white drop-shadow-lg">
          {photos[index].alt}
        </p>
      </div>

      {/* Cerrar */}
      <button
        onClick={onClose}
        aria-label="Cerrar presentación"
        className="absolute right-5 top-5 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/30"
      >
        <X size={24} />
      </button>

      {/* Anterior / Siguiente */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:left-6"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:right-6"
      >
        <ChevronRight size={28} />
      </button>

      {/* Play/pause + progreso */}
      <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-3">
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pausar' : 'Reproducir'}
          className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2 font-semibold text-[var(--color-primary)] transition-transform hover:scale-105"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
          {playing ? 'Pausar' : 'Reproducir'}
        </button>
        <div className="flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir a la foto ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-[var(--color-accent)]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
