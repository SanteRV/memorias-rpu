const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy: solo el primer proxy (Nginx/Vercel). Un valor `true` permitiría
// falsificar la IP vía X-Forwarded-For y evadir el rate limiting.
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configurado para orígenes específicos
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'https://rpuintercambio.duckterv.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (ej: Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas solicitudes, intente de nuevo más tarde'
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 uploads por hora
  message: 'Demasiados uploads, intente de nuevo más tarde'
});

app.use(limiter);

// Middleware
app.use(express.json({ limit: '1mb' })); // Limitar tamaño de JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB límite
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// RUTAS

// GET - Obtener todas las experiencias
app.get('/api/experiencias', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM experiencias ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener experiencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las experiencias'
    });
  }
});

// GET - Obtener una experiencia por ID
app.get('/api/experiencias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM experiencias WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener experiencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la experiencia'
    });
  }
});

// Función para sanitizar entrada (prevenir XSS)
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .substring(0, 500); // Limitar longitud
}

// POST - Crear nueva experiencia
app.post('/api/experiencias', uploadLimiter, upload.single('foto'), async (req, res) => {
  try {
    let { nombre, departamento, experiencia } = req.body;

    // Validación
    if (!nombre || !departamento || !experiencia) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, departamento y experiencia'
      });
    }

    // Sanitizar entradas
    nombre = sanitizeInput(nombre);
    departamento = sanitizeInput(departamento);
    experiencia = sanitizeInput(experiencia);

    // Validar longitud
    if (nombre.length < 3 || nombre.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El nombre debe tener entre 3 y 100 caracteres'
      });
    }

    if (experiencia.length < 10 || experiencia.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'La experiencia debe tener entre 10 y 500 caracteres'
      });
    }

    const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      'INSERT INTO experiencias (nombre, departamento, experiencia, foto_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, departamento, experiencia, foto_url]
    );

    res.status(201).json({
      success: true,
      message: 'Experiencia compartida exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear experiencia:', error);

    // No exponer detalles internos del error
    res.status(500).json({
      success: false,
      message: 'Error al guardar la experiencia'
    });
  }
});

// Middleware de autenticación para operaciones de administración.
// Si ADMIN_API_KEY no está configurada, el endpoint queda deshabilitado.
function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey || req.get('x-api-key') !== adminKey) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }
  next();
}

// DELETE - Eliminar una experiencia (requiere API key de admin)
app.delete('/api/experiencias/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la experiencia para eliminar la foto
    const experiencia = await pool.query(
      'SELECT foto_url FROM experiencias WHERE id = $1',
      [id]
    );

    if (experiencia.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada'
      });
    }

    // Eliminar la foto del servidor si existe
    if (experiencia.rows[0].foto_url) {
      const fotoPath = path.join(__dirname, experiencia.rows[0].foto_url);
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
      }
    }

    // Eliminar de la base de datos
    await pool.query('DELETE FROM experiencias WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Experiencia eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar experiencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la experiencia'
    });
  }
});

// GET - Obtener experiencias por departamento (para el mapa)
app.get('/api/experiencias/departamento/:departamento', async (req, res) => {
  try {
    const { departamento } = req.params;
    const result = await pool.query(
      'SELECT * FROM experiencias WHERE LOWER(departamento) LIKE LOWER($1) ORDER BY created_at DESC',
      [`%${departamento}%`]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al buscar por departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar experiencias por departamento'
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API Intercambio Nacional - Funcionando',
    endpoints: {
      'GET /api/experiencias': 'Obtener todas las experiencias',
      'GET /api/experiencias/:id': 'Obtener una experiencia por ID',
      'POST /api/experiencias': 'Crear nueva experiencia (con foto)',
      'DELETE /api/experiencias/:id': 'Eliminar experiencia',
      'GET /api/experiencias/departamento/:departamento': 'Buscar por departamento'
    }
  });
});

// Manejo de errores: solo se devuelven al cliente mensajes de errores
// esperados (validación de archivos); el resto queda en el log del servidor.
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'Error al subir el archivo (tamaño máximo: 10MB)'
    });
  }

  if (err.message && err.message.startsWith('Solo se permiten imágenes')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err.message === 'No permitido por CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origen no permitido'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Carpeta de uploads: ${uploadsDir}`);
});
