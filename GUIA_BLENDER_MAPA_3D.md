# Guía Completa: Crear Mapa 3D del Perú con Blender

Esta guía te enseñará cómo crear un mapa 3D real del Perú usando Blender y cargarlo en tu aplicación web React.

## 📋 Índice
1. [Requisitos](#requisitos)
2. [Instalación de Software](#instalación-de-software)
3. [Obtener Datos Geográficos](#obtener-datos-geográficos)
4. [Proceso en Blender](#proceso-en-blender)
5. [Exportar el Modelo 3D](#exportar-el-modelo-3d)
6. [Integrar en React](#integrar-en-react)

---

## Requisitos

### Software necesario:
- **Blender 4.0+** (gratuito y open source)
- **Navegador web** (Chrome, Firefox, Edge)
- **Editor de texto** (VS Code recomendado)

### Conocimientos previos:
- Navegación básica en Blender (opcional pero útil)
- Conocimientos básicos de React (ya los tienes)

---

## Instalación de Software

### 1. Descargar e Instalar Blender

```
1. Ve a: https://www.blender.org/download/
2. Descarga la versión para Windows (aprox. 300MB)
3. Ejecuta el instalador
4. Sigue el asistente de instalación (siguiente, siguiente, instalar)
```

### 2. Instalar el addon BlenderGIS

**Opción A: Desde GitHub (Recomendado)**

```
1. Descarga desde: https://github.com/domlysz/BlenderGIS
2. Click en "Code" > "Download ZIP"
3. Guarda el archivo: BlenderGIS-master.zip
```

**Opción B: Desde Blender Add-ons**

```
1. En Blender: Edit > Preferences
2. Pestaña "Add-ons"
3. Buscar "BlenderGIS" en el repositorio oficial
```

**Instalación:**

```
1. En Blender: Edit > Preferences > Add-ons
2. Click en "Install..." (esquina superior derecha)
3. Selecciona el archivo .zip descargado
4. Busca "BlenderGIS" en la lista
5. Activa el checkbox junto al addon
6. Click "Save Preferences"
```

---

## Obtener Datos Geográficos

### Fuentes de datos del Perú (Shapefile o GeoJSON):

#### Opción 1: DIVA-GIS (Más detallado)
```
URL: https://www.diva-gis.org/gdata
Pasos:
1. Selecciona país: Peru
2. Selecciona subject: Administrative areas
3. Descarga el archivo PER_adm.zip
4. Descomprime y busca: PER_adm1.shp (departamentos)
```

#### Opción 2: Natural Earth (Mundial, incluye Perú)
```
URL: https://www.naturalearthdata.com/downloads/
Pasos:
1. Ve a "Cultural" > "Admin 1 – States, Provinces"
2. Descarga "Download states and provinces" (medium scale)
3. Filtra solo Perú en Blender
```

#### Opción 3: GeoGPS Perú (Nacional)
```
URL: https://www.geogpsperu.com/
Pasos:
1. Busca "Shapefile Perú departamentos"
2. Descarga el archivo .zip
3. Descomprime
```

**Archivos que necesitas:**
- `.shp` (geometría)
- `.dbf` (atributos)
- `.shx` (índice)
- `.prj` (proyección)

---

## Proceso en Blender

### Paso 1: Abrir Blender y Preparar la Escena

```
1. Abre Blender
2. Elimina los objetos por defecto:
   - Selecciona todo: A
   - Elimina: X > Delete
3. Guarda el archivo: File > Save As > "mapa_peru_3d.blend"
```

### Paso 2: Importar Datos Geográficos

```
1. Ve al menú: GIS > Import > Shapefile
   (Si no ves "GIS", verifica que BlenderGIS esté activado)

2. En el diálogo de importación:
   - Navega a tu archivo .shp (ej: PER_adm1.shp)
   - Click "Import SHP"

3. Configurar CRS (Sistema de Coordenadas):
   - Si te pregunta por CRS, selecciona: WGS84 (EPSG:4326)
   - O usa el CRS que viene en el archivo .prj

4. Espera a que se importe (puede tomar 10-30 segundos)
```

### Paso 3: Visualizar el Mapa Importado

```
1. Verás el contorno del Perú en modo wireframe (alambre)
2. Para ver mejor:
   - Tecla Z > Solid (vista sólida)
   - Scroll del mouse para hacer zoom
   - Middle-click arrastrar para rotar vista
```

### Paso 4: Extruir las Regiones (Crear Volumen 3D)

**Método 1: Extrusión Simple (todos los departamentos juntos)**

```
1. Selecciona todo el mapa: A
2. Entra en modo edición: Tab
3. Verifica que estés en modo Face: tecla 3
4. Selecciona todas las caras: A
5. Extruir hacia arriba: E (tecla E)
6. Mueve el mouse hacia arriba (o escribe 0.5 y Enter)
7. Click izquierdo para confirmar
8. Sal de modo edición: Tab
```

**Método 2: Extrusión por Región (para dar diferentes alturas)**

```
1. En modo edición (Tab)
2. Selecciona las caras de una región específica:
   - Click derecho sobre una cara
   - Shift + Alt + Click derecho para seleccionar región conectada
3. Extruir: E
4. Mueve hacia arriba la altura deseada
5. Repite para cada región que quieras destacar
```

### Paso 5: Agregar Materiales y Colores

**Material Base para todas las regiones:**

```
1. Sal de modo edición: Tab
2. En el panel derecho, ve a "Material Properties" (ícono de esfera)
3. Click "New" para crear material
4. En "Base Color", elige un color azul: #4A90E2
5. Ajusta:
   - Metallic: 0.3
   - Roughness: 0.4
```

**Materiales individuales por región:**

```
1. Entra en modo edición: Tab
2. Selecciona las caras de una región
3. En Material Properties, click "+" para nuevo material slot
4. Click "New" para crear material nuevo
5. Asigna el color deseado
6. Click "Assign" para aplicar a la selección
7. Repite para cada región
```

### Paso 6: Agregar Iluminación (Opcional)

```
1. Add > Light > Sun
2. Posiciona la luz arriba del mapa
3. Propiedades de luz:
   - Strength: 1.5
   - Angle: 5.0
```

### Paso 7: Configurar Cámara (Opcional para renderizar)

```
1. Add > Camera
2. Posiciona la cámara para buena vista del mapa:
   - Selecciona cámara
   - G para mover
   - R para rotar
3. Ver desde cámara: Numpad 0
```

---

## Exportar el Modelo 3D

### Exportar como GLB (para web - React Three Fiber)

```
1. Selecciona todo el mapa: A (en modo objeto)
2. File > Export > glTF 2.0 (.glb/.gltf)
3. En el panel derecho del exportador:
   ✓ Remember Export Settings
   ✓ Include > Selected Objects
   ✓ Transform > +Y Up
   ✓ Geometry > Apply Modifiers
   ✓ Geometry > UVs
   ✓ Geometry > Normals
   ✓ Geometry > Tangents
   ✓ Materials > Export
4. Formato: glTF Binary (.glb)
5. Nombre: peru_map_3d.glb
6. Ubicación: C:\Users\ROG STRIG\Documents\pagina_rpu\public\models\
7. Click "Export glTF 2.0"
```

**Tamaño del archivo:**
- Esperado: 500KB - 5MB (dependiendo de detalle)
- Si es > 10MB, considera simplificar la geometría

---

## Integrar en React

### Opción 1: Cargar Modelo GLB Desde Archivo

**1. Crear carpeta para modelos:**

```bash
mkdir C:\Users\ROG STRIG\Documents\pagina_rpu\public\models
```

**2. Copiar el archivo `peru_map_3d.glb` a la carpeta models**

**3. Crear componente para cargar el modelo:**

```typescript
// src/components/PeruMap3DFromFile.tsx
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin } from 'lucide-react';

function PeruModel({ onRegionClick }: { onRegionClick: (name: string) => void }) {
  const { scene } = useGLTF('/models/peru_map_3d.glb');

  return (
    <primitive
      object={scene}
      scale={0.1}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        // El nombre del objeto clickeado estará en e.object.name
        if (e.object.name) {
          onRegionClick(e.object.name);
        }
      }}
    />
  );
}

export function PeruMap3DFromFile() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="w-full h-[600px] relative">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 50 }}
          shadows
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, 10, -5]} intensity={0.5} />

          <PeruModel onRegionClick={setSelectedRegion} />

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={5}
            maxDistance={30}
          />
        </Canvas>
      </div>

      {/* Popup similar al actual */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-white rounded-xl shadow-2xl px-6 py-4">
              <button onClick={() => setSelectedRegion(null)}>
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <MapPin size={24} />
                <h3>{selectedRegion}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**4. Actualizar Footer.tsx:**

```typescript
// src/components/Footer.tsx
import { PeruMap3DFromFile } from "./PeruMap3DFromFile";

// Reemplaza <PeruMap3D /> con:
<PeruMap3DFromFile />
```

### Opción 2: Mantener el Componente Actual (Geometría Programática)

El componente actual que creé (`PeruMap3D.tsx`) ya funciona con geometría extruida programáticamente usando Three.js. No necesitas Blender para esto, pero las regiones son rectangulares simplificadas.

**Ventajas del componente actual:**
- ✅ No necesita archivos externos
- ✅ Más ligero (menos descarga)
- ✅ Fácil de modificar colores y altura
- ✅ Ya está funcionando

**Desventajas:**
- ❌ Forma de regiones simplificada (rectángulos)
- ❌ No es geográficamente preciso

**Ventajas de usar modelo de Blender:**
- ✅ Forma real y precisa de cada departamento
- ✅ Mayor realismo visual
- ✅ Puedes agregar más detalles (ríos, montañas)

**Desventajas:**
- ❌ Archivo más pesado
- ❌ Requiere trabajo adicional en Blender
- ❌ Más complejo de modificar

---

## Consejos y Trucos

### Optimizar el Modelo para Web

**1. Reducir polígonos (si el archivo es muy pesado):**

```
En Blender:
1. Selecciona el mapa
2. Add Modifier > Decimate
3. Ratio: 0.5 (reduce a la mitad los polígonos)
4. Apply modifier
```

**2. Comprimir texturas:**

```
En Blender:
1. UV Editing workspace
2. Image > Resize > 512x512 o 1024x1024
```

**3. Usar formato GLB en lugar de GLTF:**

```
GLB = archivo binario único (mejor para web)
GLTF = JSON + archivos separados (mejor para edición)
```

### Atajos de Teclado Importantes en Blender

```
G - Mover (Grab)
R - Rotar (Rotate)
S - Escalar (Scale)
E - Extruir (Extrude)
Tab - Alternar entre modo objeto y edición
A - Seleccionar todo
X - Eliminar
Z - Menú de visualización (wireframe, solid, material preview)
Numpad 0 - Vista desde cámara
Numpad 7 - Vista desde arriba
Shift + A - Agregar objeto
```

### Solución de Problemas Comunes

**Problema: El mapa se ve muy pequeño o muy grande**

```
Solución en Blender:
1. Selecciona el mapa
2. Presiona S (escalar)
3. Escribe un número (ej: 10 para agrandar 10x)
4. Enter

Solución en React:
En el componente, ajusta el prop scale:
<primitive object={scene} scale={0.5} /> // más pequeño
<primitive object={scene} scale={2} />   // más grande
```

**Problema: El mapa aparece de costado o al revés**

```
Solución en Blender:
1. Selecciona el mapa
2. Presiona R (rotar) > X (eje X) > 90 (grados)
3. Enter
4. Reexporta

Solución en React:
<primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
```

**Problema: Los colores no se ven en el modelo exportado**

```
Solución:
1. Verifica que marcaste "Materials > Export" al exportar
2. En Blender, asegúrate de usar Principled BSDF shader
3. Reexporta el modelo
```

---

## Recursos Adicionales

### Tutoriales de Blender (YouTube):
- Blender Guru - Donut Tutorial (principiantes)
- Grant Abbitt - Blender para principiantes
- CG Geek - Tutoriales avanzados

### Documentación:
- Blender Manual: https://docs.blender.org/
- Three.js GLTFLoader: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber

### Comunidades:
- r/blender (Reddit)
- Blender Artists Forum
- Stack Overflow (tag: blender)

---

## Próximos Pasos

1. **Básico:** Usa el componente actual con geometría programática
2. **Intermedio:** Descarga shapefile, importa en Blender, extruye básico
3. **Avanzado:** Crea modelo detallado con texturas, iluminación y animaciones

---

## Notas Finales

- El componente actual (`PeruMap3D.tsx`) ya tiene geometría extruida 3D funcional
- Si quieres un mapa **geográficamente preciso**, sigue esta guía de Blender
- Para un proyecto rápido, el componente actual es suficiente
- Para máximo realismo, invierte tiempo en Blender

**¡Éxito con tu mapa 3D!** 🗺️🇵🇪
