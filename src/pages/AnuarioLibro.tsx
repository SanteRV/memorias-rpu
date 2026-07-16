import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft, Loader2, GraduationCap, MapPin, Mail } from 'lucide-react';
import { awardsData } from '../components/RPUAwards';
import { STATIC_PHOTOS } from '../components/PhotoGallery';
import { FRASES_PROMO } from '../components/FrasesPromo';
import fotoGrupal from '../image/foto_rpu.png';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Perfil {
  id: number;
  nombre: string;
  universidad: string;
  departamento: string;
  frase: string;
  foto_url: string | null;
}

interface Dedi {
  id: number;
  perfil_id: number;
  de_nombre: string;
  mensaje: string;
}

const medalla = ['🥇', '🥈', '🥉'];

export function AnuarioLibro() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [dedis, setDedis] = useState<Dedi[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    document.title = 'Anuario RPU — Intercambio Nacional';
    Promise.all([
      fetch(`${API_URL}/perfiles`).then((r) => r.json()),
      fetch(`${API_URL}/dedicatorias`).then((r) => r.json())
    ])
      .then(([p, d]) => {
        if (p.success) setPerfiles(p.data);
        if (d.success) setDedis(d.data);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const dedisDe = (perfilId: number) => dedis.filter((d) => d.perfil_id === perfilId);

  return (
    <div className="min-h-screen bg-white text-[var(--color-primary)]">
      {/* Controles (no salen en el PDF) */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-3 print:hidden">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-gray-100 px-5 py-3 font-semibold text-[var(--color-primary)] shadow-lg hover:bg-gray-200"
        >
          <ArrowLeft size={18} /> Volver
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-primary)] shadow-lg transition-transform hover:scale-105"
        >
          <Printer size={18} /> Descargar PDF
        </button>
      </div>

      {/* ── Portada ── */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-primary)] px-8 text-center text-white">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Red Peruana de Universidades
        </p>
        <h1 className="mb-2 text-white">Anuario</h1>
        <p className="mb-8 text-2xl text-white/90 [font-family:var(--font-display)]">
          Intercambio Nacional 2025
        </p>
        <img
          src={fotoGrupal}
          alt="La promo del intercambio"
          className="w-full max-w-2xl"
        />
        <p className="mt-8 max-w-md text-white/70 italic">
          “El verdadero viaje no termina cuando regresamos a casa, termina
          cuando dejamos de recordar.”
        </p>
      </section>

      {/* ── La Promo ── */}
      <section className="break-before-page px-8 py-14">
        <h2 className="mb-2 text-center">La Promo</h2>
        <div className="mx-auto mb-10 h-1 w-24 bg-[var(--color-accent)]"></div>

        {cargando ? (
          <div className="flex justify-center py-10 print:hidden">
            <Loader2 className="animate-spin text-gray-400" size={36} />
          </div>
        ) : perfiles.length === 0 ? (
          <p className="text-center text-gray-500">
            Aún no hay carnés en el anuario — cuando la promo se una, aparecerán aquí.
          </p>
        ) : (
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3">
            {perfiles.map((p) => {
              const suyas = dedisDe(p.id);
              return (
                <div key={p.id} className="break-inside-avoid overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-blue-50">
                    {p.foto_url ? (
                      <img src={p.foto_url} alt={p.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl font-bold text-[var(--color-primary)]/30">
                        {p.nombre.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold leading-tight">{p.nombre}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <GraduationCap size={12} /> {p.universidad}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} /> {p.departamento}
                    </p>
                    <p className="mt-2 border-l-2 border-[var(--color-accent)] pl-2 text-sm italic">
                      “{p.frase}”
                    </p>
                    {suyas.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-dashed border-gray-200 pt-2">
                        <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                          <Mail size={11} /> Dedicatorias
                        </p>
                        {suyas.map((d) => (
                          <p key={d.id} className="text-xs leading-snug text-gray-600">
                            “{d.mensaje}” <span className="font-semibold">— {d.de_nombre}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── RPU Awards ── */}
      <section className="break-before-page bg-gray-50 px-8 py-14 print:bg-white">
        <h2 className="mb-2 text-center">RPU Awards</h2>
        <div className="mx-auto mb-10 h-1 w-24 bg-[var(--color-accent)]"></div>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          {awardsData.map((a) => (
            <div key={a.id} className="break-inside-avoid rounded-xl border border-gray-200 bg-white p-4">
              <p className="font-bold">
                {a.emoji} {a.title}
              </p>
              <div className="mt-2 space-y-0.5 text-sm text-gray-700">
                {a.winners.map((w, i) => (
                  <p key={i}>
                    {medalla[i]} {w.name}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Frases de la promo ── */}
      <section className="break-before-page px-8 py-14">
        <h2 className="mb-2 text-center">Recuerdos de la promo</h2>
        <div className="mx-auto mb-10 h-1 w-24 bg-[var(--color-accent)]"></div>
        <div className="mx-auto max-w-3xl space-y-5">
          {FRASES_PROMO.map((f, i) => (
            <blockquote
              key={i}
              className="break-inside-avoid border-l-4 border-[var(--color-accent)] pl-4 italic leading-relaxed text-gray-700"
            >
              “{f}”
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── Galería ── */}
      <section className="break-before-page px-8 py-14">
        <h2 className="mb-2 text-center">Galería de Momentos</h2>
        <div className="mx-auto mb-10 h-1 w-24 bg-[var(--color-accent)]"></div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3">
          {STATIC_PHOTOS.map((f, i) => (
            <figure key={i} className="break-inside-avoid">
              <img src={f.url} alt={f.alt} className="w-full rounded-xl object-cover" />
              <figcaption className="mt-1 text-center text-xs text-gray-500">{f.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Contraportada ── */}
      <section className="break-before-page flex min-h-[60vh] flex-col items-center justify-center bg-[var(--color-primary)] px-8 text-center text-white">
        <p className="max-w-lg text-lg leading-relaxed text-white/90">
          Gracias por ser parte de esta historia. Que estos recuerdos nos
          acompañen siempre y nos inspiren a seguir construyendo puentes de
          amistad.
        </p>
        <p className="mt-6 text-[var(--color-accent)] [font-family:var(--font-display)] text-xl">
          Intercambio Nacional RPU · 2025
        </p>
      </section>
    </div>
  );
}
