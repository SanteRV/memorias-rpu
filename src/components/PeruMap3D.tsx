import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin } from 'lucide-react';
import * as THREE from 'three';

interface Region {
  id: string;
  name: string;
  coordinates: [number, number][];
  centroid: [number, number];
  color: string;
}

const peruRegions: Region[] = [
  {
    id: 'tumbes',
    name: 'Tumbes',
    coordinates: [[-80.5, -4.5], [-80.0, -4.5], [-80.0, -3.3], [-80.5, -3.3]],
    centroid: [-80.25, -3.9],
    color: '#FF6B6B'
  },
  {
    id: 'piura',
    name: 'Piura',
    coordinates: [[-81.0, -6.0], [-79.0, -6.0], [-79.0, -4.0], [-81.0, -4.0]],
    centroid: [-80.0, -5.0],
    color: '#4ECDC4'
  },
  {
    id: 'lambayeque',
    name: 'Lambayeque',
    coordinates: [[-80.0, -7.0], [-79.0, -7.0], [-79.0, -5.5], [-80.0, -5.5]],
    centroid: [-79.5, -6.25],
    color: '#45B7D1'
  },
  {
    id: 'lalibertad',
    name: 'La Libertad',
    coordinates: [[-79.0, -9.0], [-77.5, -9.0], [-77.5, -7.0], [-79.0, -7.0]],
    centroid: [-78.25, -8.0],
    color: '#96CEB4'
  },
  {
    id: 'cajamarca',
    name: 'Cajamarca',
    coordinates: [[-79.5, -7.5], [-78.0, -7.5], [-78.0, -5.0], [-79.5, -5.0]],
    centroid: [-78.75, -6.25],
    color: '#FFEAA7'
  },
  {
    id: 'amazonas',
    name: 'Amazonas',
    coordinates: [[-78.5, -6.5], [-77.5, -6.5], [-77.5, -3.5], [-78.5, -3.5]],
    centroid: [-78.0, -5.0],
    color: '#DFE6E9'
  },
  {
    id: 'loreto',
    name: 'Loreto',
    coordinates: [[-76.0, -6.0], [-73.0, -6.0], [-73.0, -1.0], [-76.0, -1.0]],
    centroid: [-74.5, -3.5],
    color: '#74B9FF'
  },
  {
    id: 'sanmartin',
    name: 'San Martín',
    coordinates: [[-77.5, -8.5], [-76.0, -8.5], [-76.0, -5.5], [-77.5, -5.5]],
    centroid: [-76.75, -7.0],
    color: '#A29BFE'
  },
  {
    id: 'ancash',
    name: 'Áncash',
    coordinates: [[-78.0, -10.0], [-77.0, -10.0], [-77.0, -8.5], [-78.0, -8.5]],
    centroid: [-77.5, -9.25],
    color: '#FD79A8'
  },
  {
    id: 'huanuco',
    name: 'Huánuco',
    coordinates: [[-76.5, -10.5], [-75.0, -10.5], [-75.0, -8.5], [-76.5, -8.5]],
    centroid: [-75.75, -9.5],
    color: '#FDCB6E'
  },
  {
    id: 'pasco',
    name: 'Pasco',
    coordinates: [[-76.0, -11.0], [-75.0, -11.0], [-75.0, -9.5], [-76.0, -9.5]],
    centroid: [-75.5, -10.25],
    color: '#6C5CE7'
  },
  {
    id: 'ucayali',
    name: 'Ucayali',
    coordinates: [[-75.0, -11.0], [-73.0, -11.0], [-73.0, -7.5], [-75.0, -7.5]],
    centroid: [-74.0, -9.25],
    color: '#00B894'
  },
  {
    id: 'lima',
    name: 'Lima',
    coordinates: [[-77.5, -13.0], [-76.0, -13.0], [-76.0, -10.5], [-77.5, -10.5]],
    centroid: [-76.75, -11.75],
    color: '#F7C548'
  },
  {
    id: 'callao',
    name: 'Callao',
    coordinates: [[-77.2, -12.1], [-77.0, -12.1], [-77.0, -11.9], [-77.2, -11.9]],
    centroid: [-77.1, -12.0],
    color: '#FF7675'
  },
  {
    id: 'junin',
    name: 'Junín',
    coordinates: [[-76.0, -12.5], [-74.5, -12.5], [-74.5, -10.5], [-76.0, -10.5]],
    centroid: [-75.25, -11.5],
    color: '#55EFC4'
  },
  {
    id: 'huancavelica',
    name: 'Huancavelica',
    coordinates: [[-75.5, -13.5], [-74.5, -13.5], [-74.5, -12.0], [-75.5, -12.0]],
    centroid: [-75.0, -12.75],
    color: '#81ECEC'
  },
  {
    id: 'ica',
    name: 'Ica',
    coordinates: [[-76.0, -15.5], [-75.0, -15.5], [-75.0, -13.5], [-76.0, -13.5]],
    centroid: [-75.5, -14.5],
    color: '#FAB1A0'
  },
  {
    id: 'ayacucho',
    name: 'Ayacucho',
    coordinates: [[-75.0, -15.0], [-73.5, -15.0], [-73.5, -12.5], [-75.0, -12.5]],
    centroid: [-74.25, -13.75],
    color: '#A29BFE'
  },
  {
    id: 'cusco',
    name: 'Cusco',
    coordinates: [[-73.0, -14.5], [-71.0, -14.5], [-71.0, -11.5], [-73.0, -11.5]],
    centroid: [-72.0, -13.0],
    color: '#6C5CE7'
  },
  {
    id: 'apurimac',
    name: 'Apurímac',
    coordinates: [[-73.5, -14.5], [-72.5, -14.5], [-72.5, -13.0], [-73.5, -13.0]],
    centroid: [-73.0, -13.75],
    color: '#E17055'
  },
  {
    id: 'madrededios',
    name: 'Madre de Dios',
    coordinates: [[-71.5, -13.5], [-69.0, -13.5], [-69.0, -10.0], [-71.5, -10.0]],
    centroid: [-70.25, -11.75],
    color: '#00B894'
  },
  {
    id: 'arequipa',
    name: 'Arequipa',
    coordinates: [[-73.0, -17.0], [-71.0, -17.0], [-71.0, -15.0], [-73.0, -15.0]],
    centroid: [-72.0, -16.0],
    color: '#FF7675'
  },
  {
    id: 'puno',
    name: 'Puno',
    coordinates: [[-71.0, -17.0], [-68.5, -17.0], [-68.5, -13.5], [-71.0, -13.5]],
    centroid: [-69.75, -15.25],
    color: '#74B9FF'
  },
  {
    id: 'moquegua',
    name: 'Moquegua',
    coordinates: [[-71.5, -17.5], [-70.0, -17.5], [-70.0, -16.0], [-71.5, -16.0]],
    centroid: [-70.75, -16.75],
    color: '#FDCB6E'
  },
  {
    id: 'tacna',
    name: 'Tacna',
    coordinates: [[-70.5, -18.5], [-69.5, -18.5], [-69.5, -17.0], [-70.5, -17.0]],
    centroid: [-70.0, -17.75],
    color: '#FD79A8'
  },
];

// Componente para una región 3D individual
function Region3D({
  region,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave
}: {
  region: Region;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const targetY = useRef(isSelected ? 1.5 : 0);
  const targetScale = useRef(1);

  // Crear la geometría extruida para la región
  const geometry = useMemo(() => {
    // Escala más grande para mejor visibilidad
    const scale = 2.0;
    const offsetX = 75;
    const offsetY = 10;

    const shape = new THREE.Shape();
    region.coordinates.forEach((coord, i) => {
      const x = (coord[0] + offsetX) * scale;
      const y = (coord[1] + offsetY) * scale;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    });
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: isSelected ? 1.2 : 0.6,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [region.coordinates, isSelected]);

  // Calcular posición del texto
  const textPosition = useMemo(() => {
    const scale = 2.0;
    const offsetX = 75;
    const offsetY = 10;
    return [
      (region.centroid[0] + offsetX) * scale,
      0.8,
      (region.centroid[1] + offsetY) * scale
    ];
  }, [region.centroid]);

  // Animación suave
  useFrame(() => {
    if (meshRef.current) {
      targetY.current = isSelected ? 1.5 : 0;
      targetScale.current = isSelected ? 1.1 : isHovered ? 1.05 : 1;

      meshRef.current.position.y += (targetY.current - meshRef.current.position.y) * 0.15;
      meshRef.current.scale.x += (targetScale.current - meshRef.current.scale.x) * 0.15;
      meshRef.current.scale.z += (targetScale.current - meshRef.current.scale.z) * 0.15;
    }

    // Hacer que el texto siempre mire a la cámara
    if (textRef.current) {
      textRef.current.lookAt(0, 5, 15);
    }
  });

  const baseColor = isSelected ? '#F7C548' : isHovered ? '#FFFFFF' : region.color;

  return (
    <group>
      {/* Región 3D */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={onSelect}
        onPointerOver={onHover}
        onPointerOut={onLeave}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={baseColor}
          metalness={0.4}
          roughness={0.3}
          emissive={isSelected ? '#F7C548' : isHovered ? region.color : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Etiqueta 3D con nombre de región (siempre visible) */}
      <Text
        ref={textRef}
        position={textPosition as [number, number, number]}
        fontSize={0.8}
        color={isSelected ? '#F7C548' : isHovered ? '#FFFFFF' : '#E0E0E0'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {region.name}
      </Text>
    </group>
  );
}

// Componente principal del mapa
export function PeruMap3D() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionClick = (regionId: string) => {
    if (selectedRegion === regionId) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(regionId);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="w-full h-[800px] relative">
        <Canvas
          camera={{ position: [0, 12, 35], fov: 60 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          {/* Iluminación mejorada */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[15, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          <pointLight position={[-15, 15, -10]} intensity={0.8} color="#4A90E2" />
          <pointLight position={[15, 10, 10]} intensity={0.6} color="#F7C548" />
          <spotLight
            position={[0, 30, 0]}
            angle={0.4}
            penumbra={1}
            intensity={1}
            castShadow
          />

          {/* Renderizar todas las regiones */}
          {peruRegions.map((region) => (
            <Region3D
              key={region.id}
              region={region}
              isSelected={selectedRegion === region.id}
              isHovered={hoveredRegion === region.id}
              onSelect={() => handleRegionClick(region.id)}
              onHover={() => setHoveredRegion(region.id)}
              onLeave={() => setHoveredRegion(null)}
            />
          ))}

          {/* Plano base con sombra */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.5} />
          </mesh>

          {/* Controles de órbita */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={15}
            maxDistance={60}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 8}
            target={[0, 0, 0]}
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
                    {peruRegions.find(r => r.id === selectedRegion)?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Departamento del Perú
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instrucciones mejoradas */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-5 py-4 shadow-lg max-w-[380px]">
        <p className="text-[var(--color-primary)] text-sm font-bold mb-3">
          Mapa Interactivo 3D del Perú
        </p>
        <ul className="text-[var(--color-primary)] text-xs space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span><strong>Click</strong> en una región para seleccionar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span><strong>Arrastra</strong> para rotar el mapa</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span><strong>Scroll</strong> para acercar/alejar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span>Cada región tiene su propio color</span>
          </li>
        </ul>
      </div>

      {/* Leyenda de colores */}
      <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg max-w-[200px]">
        <p className="text-[var(--color-primary)] text-xs font-bold mb-2">
          25 Departamentos
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F7C548' }}></div>
          <span>Seleccionado</span>
        </div>
      </div>
    </div>
  );
}
