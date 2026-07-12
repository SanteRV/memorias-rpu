import { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin } from 'lucide-react';
import * as THREE from 'three';

// Componente que carga el modelo GLB del Perú
function PeruModelFromBlender({
  onRegionClick
}: {
  onRegionClick: (name: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Cargar el modelo GLB exportado desde Blender
  const { scene } = useGLTF('/models/peru_map_3d.glb');

  // Animación de rotación suave
  useFrame((state) => {
    if (groupRef.current) {
      // Rotación automática muy sutil
      groupRef.current.rotation.y += 0.001;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    // Obtener el nombre del objeto clickeado
    let objectName = event.object.name;

    // Si el objeto no tiene nombre, buscar en el padre
    if (!objectName && event.object.parent) {
      objectName = event.object.parent.name;
    }

    if (objectName) {
      console.log('Región clickeada:', objectName);
      setSelectedRegion(objectName);
      onRegionClick(objectName);
    }
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';

    let objectName = event.object.name;
    if (!objectName && event.object.parent) {
      objectName = event.object.parent.name;
    }

    if (objectName) {
      setHoveredRegion(objectName);
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    setHoveredRegion(null);
  };

  // Clonar el modelo para poder modificarlo
  const clonedScene = scene.clone();

  // Recorrer todos los meshes del modelo para agregar interactividad
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Habilitar sombras
      child.castShadow = true;
      child.receiveShadow = true;

      // Cambiar color si está hovered o selected
      if (child.material instanceof THREE.MeshStandardMaterial) {
        const isHovered = hoveredRegion === child.name;
        const isSelected = selectedRegion === child.name;

        if (isSelected) {
          child.material = child.material.clone();
          child.material.color.set('#F7C548'); // Dorado
          child.material.emissive.set('#F7C548');
          child.material.emissiveIntensity = 0.3;
        } else if (isHovered) {
          child.material = child.material.clone();
          child.material.color.set('#5BA3F5'); // Azul claro
          child.material.emissive.set('#5BA3F5');
          child.material.emissiveIntensity = 0.2;
        } else {
          child.material = child.material.clone();
          child.material.color.set('#4A90E2'); // Azul base
          child.material.emissive.set('#000000');
          child.material.emissiveIntensity = 0;
        }
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive
        object={clonedScene}
        scale={0.1}
        position={[0, 0, 0]}
      />
    </group>
  );
}

// Componente principal
export function PeruMap3DFromBlender() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionClick = (regionName: string) => {
    if (selectedRegion === regionName) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(regionName);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="w-full h-[600px] relative">
        <Canvas
          camera={{ position: [0, 8, 20], fov: 50 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          {/* Iluminación */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 15, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, 10, -5]} intensity={0.5} />
          <spotLight
            position={[0, 20, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.7}
            castShadow
          />

          {/* Modelo del Perú desde Blender */}
          <PeruModelFromBlender onRegionClick={handleRegionClick} />

          {/* Plano base con sombra */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.4} />
          </mesh>

          {/* Controles de órbita */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={10}
            maxDistance={40}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
          />
        </Canvas>
      </div>

      {/* Popup de región seleccionada */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-white rounded-xl shadow-2xl px-6 py-4 min-w-[250px] relative">
              <button
                onClick={() => setSelectedRegion(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <MapPin className="text-[var(--color-accent)]" size={24} />
                <div>
                  <h3 className="text-[var(--color-primary)] font-bold text-xl">
                    {selectedRegion}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Región seleccionada
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instrucciones */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg max-w-[350px]">
        <p className="text-[var(--color-primary)] text-sm font-medium mb-2">
          <span className="font-bold">Interactúa:</span>
        </p>
        <ul className="text-[var(--color-primary)] text-xs space-y-1">
          <li>• Click en región para seleccionar</li>
          <li>• Arrastra para rotar el mapa</li>
          <li>• Scroll para hacer zoom</li>
        </ul>
      </div>
    </div>
  );
}

// Precargar el modelo para mejor performance
useGLTF.preload('/models/peru_map_3d.glb');
