import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import musicaFondo from '../mp3/musica_fondo.mp3';

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Volumen al 50%
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Error al reproducir:', error);
          alert('Haz clic en el botón de música para reproducir');
        });
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicaFondo}
        loop
        preload="auto"
      />

      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={toggleMusic}
        className="fixed bottom-8 left-8 z-[999] bg-gradient-to-r from-[var(--color-accent)] to-yellow-500 text-white p-5 rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(247,197,72,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white"
        whileHover={{ rotate: 5 }}
        whileTap={{ rotate: -5 }}
        title={isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo'}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        style={{ position: 'fixed' }}
      >
        {isPlaying ? (
          <Volume2 size={28} className="drop-shadow-lg" />
        ) : (
          <VolumeX size={28} className="drop-shadow-lg" />
        )}
      </motion.button>

      {/* Indicador visual más prominente */}
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-28 left-8 z-[999] bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium pointer-events-none"
        >
          🎵 Click para música
        </motion.div>
      )}
    </>
  );
}
