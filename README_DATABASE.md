# Configuración de Base de Datos PostgreSQL

## Pasos para configurar la base de datos

### 1. Abrir pgAdmin 4
- Usuario: postgres
- Contraseña: la que definiste al instalar PostgreSQL (guárdala en el `.env`, nunca en este archivo)

### 2. Crear la base de datos

1. Click derecho en "Databases" → "Create" → "Database"
2. Nombre: `intercambio_nacional`
3. Click en "Save"

### 3. Ejecutar el script SQL

1. Click derecho en la base de datos `intercambio_nacional`
2. Seleccionar "Query Tool"
3. Copiar y pegar el contenido del archivo `database/schema.sql`
4. Click en el botón "Execute/Refresh" (⚡ icono) o presionar F5

### 4. Verificar que la tabla se creó

Ejecutar en Query Tool:
```sql
SELECT * FROM experiencias;
```

Deberías ver una tabla vacía con las siguientes columnas:
- id
- nombre
- ciudad
- experiencia
- foto_url
- created_at
- updated_at

## Iniciar el proyecto

### Terminal 1 - Backend (Puerto 3001)
```bash
npm run server
```

### Terminal 2 - Frontend (Puerto 5173)
```bash
npm run dev
```

## Probar el sistema

1. Abre el navegador en `http://localhost:5173`
2. Ve a la sección "Comparte Tu Experiencia"
3. Completa el formulario:
   - Sube una imagen
   - Ingresa tu nombre
   - Ingresa tu ciudad
   - Escribe tu experiencia
4. Click en "Compartir Experiencia"

Las experiencias se guardarán en PostgreSQL y las imágenes en `server/uploads/`

## API Endpoints

- `GET /api/experiencias` - Obtener todas las experiencias
- `GET /api/experiencias/:id` - Obtener una experiencia por ID
- `POST /api/experiencias` - Crear nueva experiencia (con foto)
- `DELETE /api/experiencias/:id` - Eliminar experiencia
- `GET /api/experiencias/ciudad/:ciudad` - Buscar por ciudad

## Estructura de la base de datos

```sql
CREATE TABLE experiencias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    experiencia TEXT NOT NULL,
    foto_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Siguiente paso: Mapa Interactivo

Una vez que tengas experiencias guardadas con ubicaciones, podremos crear un mapa interactivo que muestre las experiencias por ciudad.
