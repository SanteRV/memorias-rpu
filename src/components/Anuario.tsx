import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, MapPin, Loader2, X, UserPlus, Camera, Upload, CheckCircle, AlertCircle, Mail, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const MAX_SOURCE_SIZE = 15 * 1024 * 1024;
const TARGET_SIZE = 3.5 * 1024 * 1024;

interface Perfil {
  id: number;
  nombre: string;
  universidad: string;
  departamento: string;
  frase: string;
  foto_url: string | null;
  dedicatorias?: number;
}

interface Dedicatoria {
  id: number;
  de_nombre: string;
  mensaje: string;
}

const DEPARTAMENTOS = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
  'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad',
  'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco',
  'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

// Comprime la imagen en el navegador (igual que en el formulario de fotos)
async function comprimir(file: File): Promise<File> {
  if (file.size <= TARGET_SIZE) return file;
  const dataUrl: string = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(new Error('read'));
    r.readAsDataURL(file);
  });
  const img: HTMLImageElement = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error('decode'));
    im.src = dataUrl;
  });
  const MAX_DIM = 1400;
  let { width, height } = img;
  if (width > MAX_DIM || height > MAX_DIM) {
    if (width >= height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
    else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
  }
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);
  let q = 0.85;
  let blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', q));
  while (blob && blob.size > TARGET_SIZE && q > 0.4) {
    q -= 0.15;
    blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', q));
  }
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
}

export function Anuario() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState<Perfil | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/perfiles`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setPerfiles(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onCreado = (p: Perfil) => {
    setPerfiles((prev) => [...prev, p]);
    setFormOpen(false);
  };

  return (
    <section id="anuario" className="bg-[var(--color-primary)] py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-6 text-white">La Promo</h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[var(--color-accent)]"></div>
          <p className="mx-auto max-w-2xl text-white/90 text-lg">
            El anuario del intercambio. Cada carné es una persona que dejó su
            huella. ¡Agrega el tuyo!
          </p>
          <motion.button
            onClick={() => setFormOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3 font-semibold text-[var(--color-primary)] shadow-lg"
          >
            <UserPlus size={20} />
            Únete al anuario
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-white" size={40} />
          </div>
        ) : perfiles.length === 0 ? (
          <p className="text-center text-white/70">
            Todavía no hay nadie en el anuario. ¡Sé la primera persona en aparecer!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {perfiles.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
                onClick={() => setSeleccionado(p)}
                className="group overflow-hidden rounded-2xl bg-white text-left shadow-xl"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                  {p.foto_url ? (
                    <img
                      src={p.foto_url}
                      alt={p.nombre}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl font-bold text-[var(--color-primary)]/40">
                      {p.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {(p.dedicatorias ?? 0) > 0 && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Mail size={11} /> {p.dedicatorias}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="font-bold leading-tight text-white truncate">{p.nombre}</p>
                    <p className="flex items-center gap-1 text-xs text-white/80">
                      <MapPin size={11} /> {p.departamento}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Perfil ampliado */}
      <AnimatePresence>
        {seleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSeleccionado(null)}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              <button
                onClick={() => setSeleccionado(null)}
                aria-label="Cerrar"
                className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-2 text-white backdrop-blur-md hover:bg-black/50"
              >
                <X size={20} />
              </button>
              <div className="aspect-[3/4] w-full shrink-0 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                {seleccionado.foto_url ? (
                  <img src={seleccionado.foto_url} alt={seleccionado.nombre} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-7xl font-bold text-[var(--color-primary)]/40">
                    {seleccionado.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-[var(--color-primary)]">{seleccionado.nombre}</h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={15} /> {seleccionado.universidad}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={15} /> {seleccionado.departamento}
                  </span>
                </div>
                <p className="mt-4 border-l-4 border-[var(--color-accent)] pl-3 italic text-[var(--color-primary)]">
                  “{seleccionado.frase}”
                </p>

                <Dedicatorias perfilId={seleccionado.id} nombre={seleccionado.nombre} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario */}
      <AnimatePresence>
        {formOpen && (
          <FormAnuario onClose={() => setFormOpen(false)} onCreado={onCreado} />
        )}
      </AnimatePresence>
    </section>
  );
}

function FormAnuario({ onClose, onCreado }: { onClose: () => void; onCreado: (p: Perfil) => void }) {
  const [nombre, setNombre] = useState('');
  const [universidad, setUniversidad] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [frase, setFrase] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);

  const aviso = (tipo: 'ok' | 'err', texto: string) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 5000);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SOURCE_SIZE) { aviso('err', 'La foto supera los 15MB'); e.target.value = ''; return; }
    try {
      setProcessing(true);
      const opt = await comprimir(f);
      setFile(opt);
      const r = new FileReader();
      r.onloadend = () => setPreview(r.result as string);
      r.readAsDataURL(opt);
    } catch {
      aviso('err', 'No se pudo procesar esa imagen. Usa JPG o PNG.');
      e.target.value = '';
    } finally {
      setProcessing(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 3 || universidad.trim().length < 2 || !departamento || frase.trim().length < 5) {
      aviso('err', 'Completa todos los campos correctamente');
      return;
    }
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append('nombre', nombre);
      fd.append('universidad', universidad);
      fd.append('departamento', departamento);
      fd.append('frase', frase);
      if (file) fd.append('foto', file);
      const r = await fetch(`${API_URL}/perfiles`, { method: 'POST', body: fd });
      const data = await r.json();
      if (data.success) {
        aviso('ok', '¡Bienvenido(a) al anuario!');
        setTimeout(() => onCreado(data.data), 700);
      } else {
        aviso('err', data.message || 'No se pudo guardar');
      }
    } catch {
      aviso('err', 'Error al conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  const valido = nombre.trim().length >= 3 && universidad.trim().length >= 2 && departamento && frase.trim().length >= 5;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[1001] flex items-start justify-center overflow-y-auto bg-black/85 p-4 py-10"
    >
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="fixed left-4 right-4 top-6 z-[1100] mx-auto max-w-md"
          >
            <div className={`flex items-center gap-3 rounded-xl px-5 py-3 text-white shadow-2xl ${msg.tipo === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}>
              {msg.tipo === 'ok' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
              <span className="font-medium">{msg.texto}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[var(--color-primary)]">Únete al anuario</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <label htmlFor="anuario-foto" className="mb-4 flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--color-accent)]/50">
          {processing ? (
            <div className="flex flex-col items-center text-[var(--color-primary)]">
              <Loader2 className="mb-2 animate-spin" size={40} /> Optimizando...
            </div>
          ) : preview ? (
            <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-[var(--color-primary)]">
              <Camera className="mb-2" size={40} />
              <span>Sube tu foto</span>
              <span className="text-sm text-gray-500">JPG, PNG hasta 15MB</span>
            </div>
          )}
          <input id="anuario-foto" type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>

        <div className="space-y-3">
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} placeholder="Tu nombre *" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          <input value={universidad} onChange={(e) => setUniversidad(e.target.value)} maxLength={120} placeholder="Tu universidad *" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          <select value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
            <option value="">Tu departamento *</option>
            {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <div>
            <textarea value={frase} onChange={(e) => setFrase(e.target.value)} maxLength={200} rows={2} placeholder="Tu frase para el anuario * (lo que te llevas del intercambio)" className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            <p className={`mt-1 text-sm ${frase.length > 0 && frase.length < 5 ? 'text-red-500' : 'text-gray-500'}`}>
              {frase.length < 5 ? `Mínimo 5 caracteres` : `${frase.length}/200`}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!valido || enviando || processing}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)] py-3.5 font-semibold text-[var(--color-primary)] transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enviando ? <><Loader2 size={20} className="animate-spin" /> Guardando...</> : <><Upload size={20} /> Entrar al anuario</>}
        </button>
      </motion.form>
    </motion.div>
  );
}

// ─── Libro de dedicatorias del perfil ───────────────────────────────────────
function Dedicatorias({ perfilId, nombre }: { perfilId: number; nombre: string }) {
  const [lista, setLista] = useState<Dedicatoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [deNombre, setDeNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCargando(true);
    fetch(`${API_URL}/perfiles/${perfilId}/dedicatorias`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setLista(d.data); })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [perfilId]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deNombre.trim().length < 2 || mensaje.trim().length < 5) {
      setError('Pon tu nombre y un mensaje de al menos 5 letras');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const r = await fetch(`${API_URL}/perfiles/${perfilId}/dedicatorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ de_nombre: deNombre, mensaje })
      });
      const d = await r.json();
      if (d.success) {
        setLista((prev) => [...prev, d.data]);
        setDeNombre('');
        setMensaje('');
      } else {
        setError(d.message || 'No se pudo enviar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  const primerNombre = nombre.split(' ')[0];

  return (
    <div className="mt-6 border-t border-gray-200 pt-5">
      <p className="mb-3 flex items-center gap-2 font-bold text-[var(--color-primary)]">
        <Mail size={18} className="text-[var(--color-accent)]" />
        Dedicatorias
      </p>

      {cargando ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-gray-400" size={22} />
        </div>
      ) : lista.length === 0 ? (
        <p className="mb-4 text-sm text-gray-500">
          Nadie le ha escrito todavía. ¡Déjale unas palabras a {primerNombre}!
        </p>
      ) : (
        <div className="mb-4 max-h-52 space-y-3 overflow-y-auto pr-1">
          {lista.map((d) => (
            <div key={d.id} className="rounded-xl bg-gray-50 p-3">
              <p className="text-sm leading-relaxed text-[var(--color-primary)]">
                {d.mensaje}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                — {d.de_nombre}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={enviar} className="space-y-2">
        <input
          value={deNombre}
          onChange={(e) => setDeNombre(e.target.value)}
          maxLength={100}
          placeholder="Tu nombre"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
        <div className="flex gap-2">
          <input
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            maxLength={300}
            placeholder={`Escríbele algo a ${primerNombre}...`}
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <button
            type="submit"
            disabled={enviando || deNombre.trim().length < 2 || mensaje.trim().length < 5}
            aria-label="Enviar dedicatoria"
            className="flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-[var(--color-primary)] transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>
    </div>
  );
}
