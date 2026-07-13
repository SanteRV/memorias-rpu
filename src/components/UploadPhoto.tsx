import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || '/api';

const DEPARTAMENTOS_PERU = [
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali'
];

export function UploadPhoto() {
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consent, setConsent] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const MAX_SOURCE_SIZE = 15 * 1024 * 1024; // lo que el usuario puede elegir
  const TARGET_SIZE = 3.5 * 1024 * 1024;    // a lo que se comprime (bajo el límite de Vercel)

  // Comprime/redimensiona la imagen en el navegador para que la subida
  // quede bajo el límite de ~4.5MB de las funciones serverless.
  const comprimirImagen = async (file: File): Promise<File> => {
    if (file.size <= TARGET_SIZE) return file; // ya es liviana

    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(new Error('read'));
      r.readAsDataURL(file);
    });

    const img: HTMLImageElement = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('decode'));
      image.src = dataUrl;
    });

    // Redimensionar manteniendo proporción (máx 1920px del lado mayor)
    const MAX_DIM = 1920;
    let { width, height } = img;
    if (width > MAX_DIM || height > MAX_DIM) {
      if (width >= height) {
        height = Math.round((height * MAX_DIM) / width);
        width = MAX_DIM;
      } else {
        width = Math.round((width * MAX_DIM) / height);
        height = MAX_DIM;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    // Bajar la calidad hasta quedar bajo el objetivo
    let quality = 0.85;
    let blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, 'image/jpeg', quality)
    );
    while (blob && blob.size > TARGET_SIZE && quality > 0.4) {
      quality -= 0.15;
      blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    }
    if (!blob) return file;

    const nombreBase = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${nombreBase}.jpg`, { type: 'image/jpeg' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SOURCE_SIZE) {
      showNotification('error', 'La foto supera el tamaño máximo de 15MB');
      e.target.value = "";
      return;
    }

    try {
      setIsProcessing(true);
      const optimizada = await comprimirImagen(file);
      setSelectedFile(optimizada);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(optimizada);
    } catch {
      showNotification(
        'error',
        'No se pudo procesar esa imagen. Prueba con una JPG o PNG (si es de iPhone, súbela como "Más compatible" o toma captura de pantalla).'
      );
      e.target.value = "";
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !name || !location || !caption) {
      showNotification('error', 'Por favor completa todos los campos');
      return;
    }

    if (!consent) {
      showNotification('error', 'Debes aceptar que tu experiencia se muestre públicamente');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('foto', selectedFile);
      formData.append('nombre', name);
      formData.append('departamento', location);
      formData.append('experiencia', caption);

      const response = await fetch(`${API_URL}/experiencias`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showNotification('success', '¡Experiencia compartida exitosamente!');

        // Limpiar formulario
        setPreviewUrl(null);
        setSelectedFile(null);
        setName("");
        setCaption("");
        setLocation("");
        setConsent(false);
        const fileInput = document.getElementById("photo-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        showNotification('error', data.message || 'Error al compartir experiencia');
      }
    } catch (error) {
      console.error('Error al enviar experiencia:', error);
      showNotification('error', 'Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section id="comparte" className="py-20 px-6 bg-[var(--color-primary)]">
      <div className="max-w-6xl mx-auto">
        {/* Notificaciones */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 z-[200] sm:max-w-md"
            >
              <div
                className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
                  notification.type === 'success'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle className="text-white" size={24} />
                ) : (
                  <AlertCircle className="text-white" size={24} />
                )}
                <p className="text-white font-medium">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-6">
            Comparte Tu Experiencia
          </h2>
          <div className="w-24 h-1 mx-auto mb-8 bg-[var(--color-accent)]"></div>
          <p className="text-white/90 max-w-2xl mx-auto">
            ¿Tienes una foto especial del intercambio? ¡Compártela con todos! Sube tu imagen y deja tu huella en este muro de recuerdos.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-12 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[var(--color-accent)]/50 rounded-2xl cursor-pointer transition-all hover:border-opacity-100"
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Loader2 className="mb-4 animate-spin text-[var(--color-primary)]" size={48} />
                    <p className="text-[var(--color-primary)]">Optimizando tu foto...</p>
                  </div>
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="mb-4 text-[var(--color-primary)]" size={48} />
                    <p className="mb-2 text-[var(--color-primary)]">
                      Haz clic para subir una foto
                    </p>
                    <p className="text-gray-500">PNG, JPG hasta 15MB (se optimiza sola)</p>
                  </div>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-[var(--color-primary)] font-semibold">
                Tu nombre *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                placeholder="Ej: María González"
              />
              {name.length > 0 && name.trim().length < 3 && (
                <p className="mt-1 text-sm text-red-500">
                  Escribe al menos 3 caracteres
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block mb-2 text-[var(--color-primary)] font-semibold">
                Tu departamento *
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all bg-white cursor-pointer"
              >
                <option value="">Selecciona tu departamento</option>
                {DEPARTAMENTOS_PERU.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="caption" className="block mb-2 text-[var(--color-primary)] font-semibold">
                Tu experiencia *
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all resize-none"
                placeholder="Cuéntanos qué viviste en el intercambio (mínimo 10 caracteres)..."
                rows={4}
              />
              <p className={`mt-1 text-sm ${caption.length > 0 && caption.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                {caption.length < 10
                  ? `Escribe al menos 10 caracteres (te faltan ${10 - caption.length})`
                  : `${caption.length}/500 caracteres`}
              </p>
            </div>

            {/* Consentimiento (Ley N° 29733 de Protección de Datos Personales) */}
            <label className="mb-6 flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-accent)] cursor-pointer"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                Acepto que mi nombre, mi foto y mi experiencia se muestren
                públicamente en esta página. Puedo pedir que se eliminen en
                cualquier momento.
              </span>
            </label>

            <button
              type="submit"
              disabled={!previewUrl || name.trim().length < 3 || !location || caption.trim().length < 10 || !consent || isSubmitting || isProcessing}
              className="w-full py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 bg-[var(--color-accent)] border-2 border-[var(--color-accent)]"
              style={{
                minHeight: '56px',
                color: 'var(--color-primary)'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload size={20} style={{ color: 'var(--color-primary)' }} />
                  Compartir Experiencia
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
