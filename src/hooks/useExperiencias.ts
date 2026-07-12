import { useEffect, useState } from 'react';

export interface Experiencia {
  id: number;
  nombre: string;
  departamento: string;
  experiencia: string;
  foto_url: string | null;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Caché a nivel de módulo: varios componentes (mapa, contador) comparten
// una sola llamada a la API por visita.
let cache: Experiencia[] | null = null;
let inflight: Promise<Experiencia[]> | null = null;

function fetchExperiencias(): Promise<Experiencia[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch(`${API_URL}/experiencias`)
      .then((r) => r.json())
      .then((d) => {
        cache = d.success ? d.data : [];
        return cache!;
      })
      .catch(() => {
        inflight = null;
        return [];
      });
  }
  return inflight;
}

export function useExperiencias() {
  const [experiencias, setExperiencias] = useState<Experiencia[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let active = true;
    fetchExperiencias().then((d) => {
      if (active) {
        setExperiencias(d);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { experiencias, loading };
}

/** Quita tildes y pasa a minúsculas para comparar nombres de departamentos */
export function normalizarDepartamento(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
