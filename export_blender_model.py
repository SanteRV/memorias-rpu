"""
Script para exportar modelo de Blender a GLB
Uso: blender --background peru_map.blend --python export_blender_model.py
"""

import bpy
import os

# Ruta del archivo de salida
output_dir = os.path.join(os.path.dirname(bpy.data.filepath), 'public', 'models')
output_file = os.path.join(output_dir, 'peru_map_3d.glb')

# Crear directorio si no existe
os.makedirs(output_dir, exist_ok=True)

# Seleccionar todos los objetos
bpy.ops.object.select_all(action='SELECT')

# Exportar como GLB
bpy.ops.export_scene.gltf(
    filepath=output_file,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_materials='EXPORT',
    export_colors=True,
    export_normals=True,
    export_tangents=True,
    export_lights=True,
    export_yup=True
)

print(f"✅ Modelo exportado exitosamente a: {output_file}")
print(f"📦 Tamaño del archivo: {os.path.getsize(output_file) / 1024:.2f} KB")
