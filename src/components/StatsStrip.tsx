import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  useExperiencias,
  normalizarDepartamento
} from '../hooks/useExperiencias';

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (value === 0) {
      setDisplay(0);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export function StatsStrip() {
  const { experiencias } = useExperiencias();

  const departamentos = new Set(
    experiencias.map((e) => normalizarDepartamento(e.departamento))
  ).size;
  const fotos = experiencias.filter((e) => e.foto_url).length;

  const stats = [
    { valor: experiencias.length, sufijo: '', label: 'Experiencias compartidas' },
    { valor: departamentos, sufijo: ' / 25', label: 'Departamentos representados' },
    { valor: fotos, sufijo: '', label: 'Fotos en el muro' }
  ];

  return (
    <section className="border-y border-[var(--color-accent)]/15 bg-[var(--color-primary)] px-6 py-14">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="text-center"
          >
            <p className="text-5xl font-bold text-[var(--color-accent)] [font-family:var(--font-display)]">
              <CountUp value={s.valor} />
              <span className="text-white/40 text-3xl">{s.sufijo}</span>
            </p>
            <p className="mt-2 text-white/70">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
