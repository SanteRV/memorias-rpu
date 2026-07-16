import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';

// Respuestas reales a "Tu mejor recuerdo RPU" del formulario de la promo
export const FRASES_PROMO = [
  'Este preciso momento <3',
  'La primera vez que conocí a la gente RPU: fui a la casa de Lucky sin conocer a nadie y nos quedamos buen rato con los punos y los cuscos.',
  'Soy una persona que sin sol le da depre, y venir a Lima me parecía una locura por eso. Pero desde la recepción jamás me sentí sola: siempre había un RPU por ahí andando en Tinkuy, el tontódromo o donde fuera. Todo inició con un tímido "hola"… vibraban bonito, y fueron y siguen siendo cálidos como el sol, mi sol. Tomé una buena decisión al venir.',
  'Mi mejor recuerdo nace de nuestra última reunión, aquel último jueves cultural que aún vibra en mi corazón. Caminamos como una sola historia, fuimos al concierto de rock, almorzamos unidos y, sin darnos cuenta, tejimos un momento que se volvió eterno.',
  'La fiesta de Halloween 🎃',
  'La chocolatada',
  'El día de la despedida RPU',
  'Ustedes.'
];

const INTERVALO = 7000;

export function FrasesPromo() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % FRASES_PROMO.length), INTERVALO);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="border-y border-[var(--color-accent)]/15 bg-[var(--color-primary)] px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <Quote className="mx-auto mb-6 rotate-180 text-[var(--color-accent)]" size={36} />
        <div className="flex min-h-[7rem] items-center justify-center sm:min-h-[6rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="text-lg italic leading-relaxed text-white/90 sm:text-xl [font-family:var(--font-display)]"
            >
              “{FRASES_PROMO[i]}”
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <p className="mt-5 text-sm uppercase tracking-widest text-[var(--color-accent)]">
          Recuerdos de la promo
        </p>
        <div className="mt-4 flex justify-center gap-1.5">
          {FRASES_PROMO.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Frase ${k + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                k === i ? 'w-5 bg-[var(--color-accent)]' : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
