import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { geoMercator, geoPath, geoArea } from 'd3-geo';
import { MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import {
  useExperiencias,
  normalizarDepartamento,
  type Experiencia
} from '../hooks/useExperiencias';

interface RegionFeature {
  type: 'Feature';
  properties: { id: string; name: string; region_code: string };
  geometry: GeoJSON.Geometry;
}

interface RegionGeoJSON {
  type: 'FeatureCollection';
  features: RegionFeature[];
}

const MAP_W = 520;
const MAP_H = 620;

export function PeruMap() {
  const { experiencias } = useExperiencias();
  const [geo, setGeo] = useState<RegionGeoJSON | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/peru-regions.geojson')
      .then((r) => r.json())
      .then((fc: RegionGeoJSON) => {
        // d3-geo usa la convención esférica: si un polígono viene con el
        // winding invertido lo interpreta como "todo el globo menos la
        // región". Se re-orienta cada anillo cuando el área excede media
        // esfera.
        for (const f of fc.features) {
          if (geoArea(f as never) > Math.PI) {
            const g = f.geometry as {
              type: string;
              coordinates: number[][][] | number[][][][];
            };
            if (g.type === 'Polygon') {
              g.coordinates = (g.coordinates as number[][][]).map((ring) =>
                ring.slice().reverse()
              );
            } else if (g.type === 'MultiPolygon') {
              g.coordinates = (g.coordinates as number[][][][]).map((poly) =>
                poly.map((ring) => ring.slice().reverse())
              );
            }
          }
        }
        setGeo(fc);
      })
      .catch((e) => console.error('Error al cargar el mapa:', e));
  }, []);

  // Experiencias agrupadas por departamento (normalizado)
  const porDepartamento = useMemo(() => {
    const map = new Map<string, Experiencia[]>();
    for (const exp of experiencias) {
      const key = normalizarDepartamento(exp.departamento);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(exp);
    }
    return map;
  }, [experiencias]);

  const maxCount = useMemo(() => {
    let max = 0;
    porDepartamento.forEach((v) => (max = Math.max(max, v.length)));
    return max;
  }, [porDepartamento]);

  // Proyección y paths calculados una sola vez al cargar el geojson
  const regiones = useMemo(() => {
    if (!geo) return [];
    const projection = geoMercator().fitSize([MAP_W, MAP_H], geo as never);
    const path = geoPath(projection);
    return geo.features.map((f) => ({
      key: normalizarDepartamento(f.properties.name),
      name: f.properties.name,
      d: path(f as never) ?? ''
    }));
  }, [geo]);

  const countOf = (key: string) => porDepartamento.get(key)?.length ?? 0;

  const fillOf = (key: string) => {
    const count = countOf(key);
    if (count === 0) return 'rgba(255, 255, 255, 0.06)';
    const t = maxCount > 1 ? count / maxCount : 1;
    return `rgba(247, 197, 72, ${0.3 + 0.65 * t})`;
  };

  const seleccionadas = selected ? porDepartamento.get(selected) ?? [] : [];
  const nombreSeleccionado = selected
    ? regiones.find((r) => r.key === selected)?.name ?? ''
    : '';

  const handleMove = (e: React.MouseEvent) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      id="mapa"
      className="py-20 px-6 bg-gradient-to-br from-[var(--color-primary)] via-blue-900 to-[var(--color-primary)]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-white mb-6">Huellas por el Perú</h2>
          <div className="w-24 h-1 mx-auto mb-8 bg-[var(--color-accent)]"></div>
          <p className="text-white/90 max-w-2xl mx-auto">
            Cada departamento se ilumina con las experiencias de quienes lo
            representan. Toca una región para leer sus historias.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            ref={mapRef}
            className="relative mx-auto w-full max-w-xl"
            onMouseMove={handleMove}
            onMouseLeave={() => {
              setHovered(null);
              setTooltip(null);
            }}
          >
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="w-full h-auto drop-shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
              role="img"
              aria-label="Mapa del Perú con experiencias por departamento"
            >
              {regiones.map((r) => (
                <path
                  key={r.key}
                  d={r.d}
                  fill={fillOf(r.key)}
                  stroke={
                    selected === r.key
                      ? 'var(--color-accent)'
                      : 'rgba(247, 197, 72, 0.35)'
                  }
                  strokeWidth={selected === r.key ? 2 : 0.8}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter:
                      hovered === r.key
                        ? 'brightness(1.6) drop-shadow(0 0 12px rgba(247,197,72,0.5))'
                        : undefined
                  }}
                  onMouseEnter={() => setHovered(r.key)}
                  onClick={() =>
                    setSelected(selected === r.key ? null : r.key)
                  }
                >
                  <title>{`${r.name}: ${countOf(r.key)} experiencia${countOf(r.key) === 1 ? '' : 's'}`}</title>
                </path>
              ))}
            </svg>

            {/* Tooltip flotante */}
            {hovered && tooltip && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[var(--color-primary)] shadow-xl"
                style={{ left: tooltip.x, top: tooltip.y - 12 }}
              >
                {regiones.find((r) => r.key === hovered)?.name}
                <span className="ml-2 text-[var(--color-primary)]/60 font-normal">
                  {countOf(hovered)}{' '}
                  {countOf(hovered) === 1 ? 'experiencia' : 'experiencias'}
                </span>
              </div>
            )}

            {/* Leyenda */}
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-white/70">
              <span>Menos huellas</span>
              <div
                className="h-2 w-32 rounded-full"
                style={{
                  background:
                    'linear-gradient(to right, rgba(255,255,255,0.08), rgba(247,197,72,0.95))'
                }}
              ></div>
              <span>Más huellas</span>
            </div>
          </motion.div>

          {/* Panel de historias */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:sticky lg:top-24"
          >
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <MapPin className="text-[var(--color-accent)]" size={28} />
                    <h3 className="text-white">{nombreSeleccionado}</h3>
                    <span className="rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-sm font-bold text-[var(--color-primary)]">
                      {seleccionadas.length}
                    </span>
                  </div>

                  {seleccionadas.length > 0 ? (
                    <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-2">
                      {seleccionadas.map((exp) => (
                        <div
                          key={exp.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {exp.foto_url ? (
                              <img
                                src={exp.foto_url}
                                alt={exp.nombre}
                                loading="lazy"
                                className="h-10 w-10 rounded-full object-cover border-2 border-[var(--color-accent)]/60"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold">
                                {exp.nombre.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <p className="font-semibold text-[var(--color-accent)]">
                              {exp.nombre}
                            </p>
                          </div>
                          <p className="text-white/85 text-base leading-relaxed">
                            “{exp.experiencia}”
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
                      <p className="text-white/80 mb-4">
                        Aún nadie de {nombreSeleccionado} ha dejado su huella.
                        ¡Sé la primera persona!
                      </p>
                      <a
                        href="#comparte"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-2.5 font-semibold text-[var(--color-primary)] transition-transform hover:scale-105"
                      >
                        Compartir mi experiencia
                        <ArrowRight size={18} />
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="vacio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center"
                >
                  <MessageCircle
                    className="mx-auto mb-4 text-[var(--color-accent)]"
                    size={40}
                  />
                  <h3 className="text-white mb-3">Explora las historias</h3>
                  <p className="text-white/75">
                    Selecciona un departamento en el mapa para descubrir las
                    experiencias de quienes viajaron desde allí.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
