import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

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
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !name || !location || !caption) {
      showNotification('error', 'Por favor completa todos los campos');
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
    <section className="py-20 px-6 bg-[var(--color-primary)]">
      <div className="max-w-6xl mx-auto">
        {/* Notificaciones */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-6 right-6 z-50 max-w-md"
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
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="mb-4 text-[var(--color-primary)]" size={48} />
                    <p className="mb-2 text-[var(--color-primary)]">
                      Haz clic para subir una foto
                    </p>
                    <p className="text-gray-500">PNG, JPG hasta 10MB</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                placeholder="Ej: María González"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all resize-none"
                placeholder="Comparte tu experiencia del intercambio..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={!previewUrl || !name || !location || !caption || isSubmitting}
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
