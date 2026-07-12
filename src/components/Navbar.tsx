import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#galeria', label: 'Galería' },
  { href: '#mapa', label: 'Mapa' },
  { href: '#comparte', label: 'Comparte' },
  { href: '#testimonios', label: 'Testimonios' }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-primary)]/85 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Marca */}
        <a href="#inicio" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] font-bold text-xl text-[var(--color-primary)] [font-family:var(--font-display)]">
            R
          </span>
          <span className="text-white font-semibold tracking-wide [font-family:var(--font-display)]">
            Memorias RPU
          </span>
        </a>

        {/* Enlaces desktop */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-[var(--color-accent)]"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/awards"
            className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-bold text-[var(--color-primary)] transition-transform hover:scale-105"
          >
            <Trophy size={16} />
            Awards
          </Link>
        </div>

        {/* Botón móvil */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[var(--color-primary)]/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="flex flex-col gap-1 px-6 pb-5 pt-2">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-white/85 hover:bg-white/10 hover:text-[var(--color-accent)]"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/awards"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-bold text-[var(--color-primary)]"
              >
                <Trophy size={16} />
                RPU Awards
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
