import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin } from 'lucide-react';
import * as THREE from 'three';

interface Department {
  id: string;
  name: string;
  position: [number, number, number]; // x, y, z en espacio 3D
  color: string;
}

// Posiciones ajustadas para coincidir con el mapa real (coordenadas X, Y, Z)
// Norte del Perú (arriba en el mapa)
const departments: Department[] = [
  { id: 'tumbes', name: 'Tumbes', position: [1.0, 0, -6.0], color: '#FF6B6B' },
  { id: 'piura', name: 'Piura', position: [0.7, 0, -4.5], color: '#4ECDC4' },
  { id: 'lambayeque', name: 'Lambayeque', position: [1.5, 0, -3.5], color: '#45B7D1' },
  { id: 'lalibertad', name: 'La Libertad', position: [2.0, 0, -2.5], color: '#96CEB4' },
  { id: 'cajamarca', name: 'Cajamarca', position: [2.3, 0, -4.0], color: '#FFEAA7' },
  { id: 'amazonas', name: 'Amazonas', position: [3.3, 0, -5.0], color: '#DFE6E9' },
  { id: 'loreto', name: 'Loreto', position: [6.0, 0, -5.5], color: '#74B9FF' },
  { id: 'sanmartin', name: 'San Martín', position: [4.5, 0, -3.8], color: '#A29BFE' },
  { id: 'ancash', name: 'Áncash', position: [2.5, 0, -1.5], color: '#FD79A8' },
  { id: 'huanuco', name: 'Huánuco', position: [3.7, 0, -2.0], color: '#FDCB6E' },
  { id: 'pasco', name: 'Pasco', position: [4.0, 0, -1.0], color: '#6C5CE7' },
  { id: 'ucayali', name: 'Ucayali', position: [6.7, 0, -2.5], color: '#00B894' },
  { id: 'lima', name: 'Lima', position: [2.7, 0, -0.5], color: '#F7C548' },
  { id: 'callao', name: 'Callao', position: [2.2, 0, -0.3], color: '#FF7675' },
  { id: 'junin', name: 'Junín', position: [4.5, 0, -0.8], color: '#55EFC4' },
  { id: 'huancavelica', name: 'Huancavelica', position: [4.0, 0, 0.0], color: '#81ECEC' },
  { id: 'ica', name: 'Ica', position: [3.0, 0, 1.0], color: '#FAB1A0' },
  { id: 'ayacucho', name: 'Ayacucho', position: [4.8, 0, 0.3], color: '#A29BFE' },
  { id: 'cusco', name: 'Cusco', position: [6.0, 0, -0.5], color: '#6C5CE7' },
  { id: 'apurimac', name: 'Apurímac', position: [5.0, 0, 0.8], color: '#E17055' },
  { id: 'madrededios', name: 'Madre de Dios', position: [8.0, 0, -1.5], color: '#00B894' },
  { id: 'arequipa', name: 'Arequipa', position: [5.3, 0, 2.0], color: '#FF7675' },
  { id: 'puno', name: 'Puno', position: [6.7, 0, 1.2], color: '#74B9FF' },
  { id: 'moquegua', name: 'Moquegua', position: [5.7, 0, 2.8], color: '#FDCB6E' },
  { id: 'tacna', name: 'Tacna', position: [6.3, 0, 3.5], color: '#FD79A8' },
];

// Componente de esfera 3D para cada departamento
function DepartmentSphere({
  department,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave
}: {
  department: Department;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetY = useRef(0);
  const targetScale = useRef(0.4);

  // Animación
  useFrame(() => {
    if (meshRef.current) {
      targetY.current = isSelected ? 1.0 : -0.7;
      targetScale.current = isSelected ? 0.6 : isHovered ? 0.5 : 0.4;

      meshRef.current.position.y += (targetY.current - meshRef.current.position.y) * 0.2;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale.current - currentScale) * 0.2;
      meshRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  const color = isSelected ? '#F7C548' : isHovered ? '#FFFFFF' : department.color;

  return (
    <mesh
      ref={meshRef}
      position={department.position}
      onClick={onSelect}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover();
      }}
      onPointerOut={onLeave}
      castShadow
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.2}
        emissive={isSelected ? '#F7C548' : department.color}
        emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0.2}
      />
    </mesh>
  );
}

// Imagen real del mapa del Perú
function PeruMapImage() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
      <img
        src="/src/image/peru_maps.png"
        alt="Mapa del Perú"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(74, 144, 226, 1))',
          opacity: 0.6
        }}
      />
    </div>
  );
}

// Componente principal
export function PeruMap3D() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const handleDeptClick = (deptId: string) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
    } else {
      setSelectedDept(deptId);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '1000px' }}>
      <div className="w-full relative" style={{ height: '1000px' }}>
        {/* Canvas 3D con esferas */}
        <Canvas
          camera={{ position: [0, 15, 0.1], fov: 50 }}
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
        >
          {/* Iluminación */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[10, 15, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-8, 10, 8]} intensity={0.8} color="#4A90E2" />
          <pointLight position={[8, 10, -8]} intensity={0.6} color="#F7C548" />
          <spotLight
            position={[0, 20, 0]}
            angle={0.5}
            penumbra={1}
            intensity={1}
            castShadow
          />

          {/* Renderizar esferas para cada departamento */}
          {departments.map((dept) => (
            <DepartmentSphere
              key={dept.id}
              department={dept}
              isSelected={selectedDept === dept.id}
              isHovered={hoveredDept === dept.id}
              onSelect={() => handleDeptClick(dept.id)}
              onHover={() => setHoveredDept(dept.id)}
              onLeave={() => setHoveredDept(null)}
            />
          ))}

          {/* Imagen del mapa como textura en el plano 3D */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.4, -0.5, -2.5]}>
            <planeGeometry args={[9, 13]} />
            <meshBasicMaterial transparent opacity={0.8}>
              <primitive attach="map" object={new THREE.TextureLoader().load('/src/image/peru_maps.png')} />
            </meshBasicMaterial>
          </mesh>

          {/* Controles */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={8}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
          />
        </Canvas>

        {/* Etiquetas de departamentos (HTML overlay) */}
        <div className="absolute inset-0 pointer-events-none">
          {departments.map((dept) => {
            const isVisible = selectedDept === dept.id || hoveredDept === dept.id;
            if (!isVisible) return null;

            // Aproximar posición 2D basada en posición 3D
            const x = 50 + (dept.position[0] / 6) * 100; // porcentaje
            const y = 50 - (dept.position[2] / 8) * 100; // porcentaje

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl">
                  <p className="text-[var(--color-primary)] font-bold text-sm whitespace-nowrap">
                    {dept.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Popup de departamento seleccionado */}
      <AnimatePresence>
        {selectedDept && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-white rounded-xl shadow-2xl px-6 py-4 min-w-[280px] relative">
              <button
                onClick={() => setSelectedDept(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: departments.find(d => d.id === selectedDept)?.color }}
                />
                <div>
                  <h3 className="text-[var(--color-primary)] font-bold text-xl">
                    {departments.find(d => d.id === selectedDept)?.name}
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

      {/* Instrucciones */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-5 py-4 shadow-lg max-w-[380px]">
        <p className="text-[var(--color-primary)] text-sm font-bold mb-3">
          Mapa Interactivo 3D del Perú
        </p>
        <ul className="text-[var(--color-primary)] text-xs space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span><strong>Click</strong> en una esfera para seleccionar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span><strong>Hover</strong> sobre esferas para ver nombre</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span><strong>Arrastra</strong> para rotar el mapa</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold">•</span>
            <span><strong>Scroll</strong> para zoom</span>
          </li>
        </ul>
      </div>

      {/* Leyenda */}
      <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
        <p className="text-[var(--color-primary)] text-xs font-bold mb-2">
          25 Departamentos
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <span>Esferas 3D</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F7C548' }}></div>
            <span>Seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
