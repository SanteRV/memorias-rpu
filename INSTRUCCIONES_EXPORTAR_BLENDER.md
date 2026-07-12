# Instrucciones para Exportar el Modelo de Blender

Tienes un archivo `peru_map.blend` en `src/` que contiene un modelo 3D del Perú.

## 📋 Opciones para Exportar

### Opción A: Exportar Manualmente (Recomendado)

**Requisitos:**
- Descargar e instalar Blender: https://www.blender.org/download/

**Pasos:**

1. **Instala Blender** (si no lo tienes)
   ```
   https://www.blender.org/download/
   Descarga versión Windows (aprox. 300MB)
   ```

2. **Abre el archivo en Blender**
   ```
   - Abre Blender
   - File > Open
   - Navega a: C:\Users\ROG STRIG\Documents\pagina_rpu\src\peru_map.blend
   - Click "Open"
   ```

3. **Exportar a GLB**
   ```
   a) Selecciona todo: Presiona A (select all)

   b) Ve a: File > Export > glTF 2.0 (.glb/.gltf)

   c) En el panel derecho del diálogo de exportación:
      ✅ Format: glTF Binary (.glb)
      ✅ Include > Selected Objects
      ✅ Transform > +Y Up
      ✅ Geometry > Apply Modifiers
      ✅ Materials > Export

   d) Navega a la carpeta:
      C:\Users\ROG STRIG\Documents\pagina_rpu\public\models\

   e) Nombre del archivo: peru_map_3d.glb

   f) Click "Export glTF 2.0"
   ```

4. **Verifica la exportación**
   ```
   Deberías ver el archivo en:
   C:\Users\ROG STRIG\Documents\pagina_rpu\public\models\peru_map_3d.glb
   ```

5. **Activa el componente en tu app**

   Edita `src/components/Footer.tsx`:

   ```typescript
   // Cambia esta línea:
   import { PeruMap3D } from "./PeruMap3D";

   // Por esta:
   import { PeruMap3DFromBlender } from "./PeruMap3DFromBlender";

   // Y luego cambia:
   <PeruMap3D />

   // Por:
   <PeruMap3DFromBlender />
   ```

6. **Recarga tu navegador**
   ```
   Ve a: http://localhost:3001
   El mapa 3D ahora cargará desde tu modelo de Blender
   ```

---

### Opción B: Exportar Automáticamente (Línea de Comandos)

**Requisitos:**
- Blender instalado y agregado al PATH del sistema

**Pasos:**

1. **Instala Blender** (si no lo tienes)

2. **Agrega Blender al PATH** (opcional pero útil)
   ```
   - Busca dónde se instaló Blender (ej: C:\Program Files\Blender Foundation\Blender 4.0\)
   - Agrega esa ruta a las variables de entorno PATH
   ```

3. **Ejecuta el script de exportación**
   ```bash
   cd C:\Users\ROG STRIG\Documents\pagina_rpu
   blender --background src/peru_map.blend --python export_blender_model.py
   ```

4. **Sigue los pasos 5 y 6 de la Opción A**

---

## 🎯 Estado Actual

### Componentes disponibles:

1. **PeruMap3D.tsx** (ACTUALMENTE ACTIVO)
   - ✅ Funcionando ahora mismo
   - ✅ Geometría extruida programática con Three.js
   - ✅ No requiere archivos externos
   - ❌ Regiones simplificadas (rectangulares)

2. **PeruMap3DFromBlender.tsx** (LISTO PARA USAR)
   - ⏳ Requiere que exportes peru_map.glb primero
   - ✅ Carga modelo real de Blender
   - ✅ Forma geográfica precisa
   - ✅ Mayor realismo

### Para cambiar de uno a otro:

Edita `src/components/Footer.tsx` y cambia el import:

```typescript
// Opción 1: Geometría programática (actual)
import { PeruMap3D } from "./PeruMap3D";

// Opción 2: Modelo de Blender (cuando esté exportado)
import { PeruMap3DFromBlender } from "./PeruMap3DFromBlender";
```

---

## 📂 Estructura de Archivos

```
pagina_rpu/
├── src/
│   ├── peru_map.blend                    ← Tu modelo de Blender original
│   └── components/
│       ├── PeruMap3D.tsx                 ← Mapa actual (geometría programática)
│       └── PeruMap3DFromBlender.tsx      ← Mapa desde Blender (nuevo)
│
├── public/
│   └── models/
│       └── peru_map_3d.glb               ← AQUÍ debes exportar (aún no existe)
│
├── export_blender_model.py               ← Script de exportación automática
├── GUIA_BLENDER_MAPA_3D.md              ← Guía completa de Blender
└── INSTRUCCIONES_EXPORTAR_BLENDER.md    ← Este archivo
```

---

## ❓ Preguntas Frecuentes

**P: ¿Necesito Blender instalado para que funcione el mapa?**
R: No. El mapa actual (PeruMap3D.tsx) ya funciona sin Blender. Solo necesitas Blender si quieres usar el modelo más realista.

**P: ¿Cuál es mejor?**
R:
- Para proyecto rápido/demo: usa el actual (PeruMap3D.tsx)
- Para máximo realismo: exporta de Blender y usa PeruMap3DFromBlender.tsx

**P: ¿El archivo GLB será muy pesado?**
R: Depende del detalle del modelo. Típicamente entre 500KB - 5MB. Si es > 10MB, necesitas simplificar en Blender.

**P: ¿Puedo editar el modelo en Blender?**
R: Sí! Abre peru_map.blend, haz tus cambios, y vuelve a exportar a GLB.

**P: No tengo Blender y no quiero instalarlo**
R: No hay problema. El mapa actual ya tiene geometría 3D extruida y funciona perfectamente.

---

## 🚀 Próximos Pasos

1. **Opción Rápida**: Deja el mapa actual como está (ya funciona)
2. **Opción Avanzada**: Instala Blender, exporta el modelo, y activa PeruMap3DFromBlender

---

## 💡 Consejo

Si tienes dudas o quieres ayuda adicional, consulta:
- `GUIA_BLENDER_MAPA_3D.md` - Guía completa de Blender
- La documentación oficial de Blender: https://docs.blender.org/

¡Éxito! 🇵🇪
