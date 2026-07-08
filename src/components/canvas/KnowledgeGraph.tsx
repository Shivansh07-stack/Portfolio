"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Line, Float, Stars, Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const nodes = [
  // Core Node
  { id: 'root', label: 'Shivansh', pos: [0, 0, 0] as [number, number, number], color: '#3b82f6', size: 0.6, count: 0 },
  
  // Primary Category Nodes (Sized by project count)
  { id: 'ml', label: 'Machine Learning', pos: [3, 2, -2] as [number, number, number], color: '#8b5cf6', size: 0.7, count: 5 },
  { id: 'data', label: 'Big Data', pos: [-3, 2, 2] as [number, number, number], color: '#10b981', size: 0.4, count: 2 },
  { id: 'ai', label: 'LLMs & GenAI', pos: [0, -3, 2] as [number, number, number], color: '#f59e0b', size: 0.5, count: 3 },
  { id: 'eng', label: 'Engineering', pos: [-2, -2, -2] as [number, number, number], color: '#ec4899', size: 0.5, count: 3 },
  
  // Secondary Tool Nodes
  { id: 'pytorch', label: 'PyTorch', pos: [4, 3.5, -3] as [number, number, number], color: '#8b5cf6', size: 0.25, count: 0 },
  { id: 'xgboost', label: 'XGBoost', pos: [4.5, 1, -1] as [number, number, number], color: '#8b5cf6', size: 0.25, count: 0 },
  { id: 'tensorflow', label: 'TensorFlow', pos: [2.5, 4.5, -1.5] as [number, number, number], color: '#8b5cf6', size: 0.25, count: 0 },
  { id: 'opencv', label: 'OpenCV', pos: [5, 2.5, -0.5] as [number, number, number], color: '#8b5cf6', size: 0.25, count: 0 },

  { id: 'langchain', label: 'LangChain', pos: [1.5, -4.5, 3] as [number, number, number], color: '#f59e0b', size: 0.25, count: 0 },
  { id: 'faiss', label: 'FAISS', pos: [-1.5, -4, 2.5] as [number, number, number], color: '#f59e0b', size: 0.25, count: 0 },

  { id: 'sql', label: 'SQL', pos: [-4.5, 3.5, 3] as [number, number, number], color: '#10b981', size: 0.25, count: 0 },
  { id: 'pandas', label: 'Pandas', pos: [-4, 1, 3.5] as [number, number, number], color: '#10b981', size: 0.25, count: 0 },
  { id: 'hadoop', label: 'Hadoop', pos: [-2.5, 4.5, 1] as [number, number, number], color: '#10b981', size: 0.25, count: 0 },
  { id: 'streamlit', label: 'Streamlit', pos: [-4.5, -1, 3] as [number, number, number], color: '#10b981', size: 0.25, count: 0 },

  { id: 'fastapi', label: 'FastAPI', pos: [-3.5, -3.5, -2.5] as [number, number, number], color: '#ec4899', size: 0.25, count: 0 },
  
  { id: 'python', label: 'Python', pos: [1, 5, 0] as [number, number, number], color: '#3b82f6', size: 0.35, count: 0 },
];

const connections = [
  // Primary connections
  ['root', 'ml'], ['root', 'data'], ['root', 'ai'], ['root', 'eng'], ['ml', 'ai'], ['data', 'eng'],
  
  // Secondary connections
  ['ml', 'pytorch'], ['ml', 'xgboost'], ['ml', 'tensorflow'], ['ml', 'opencv'],
  ['ai', 'langchain'], ['ai', 'faiss'],
  ['data', 'sql'], ['data', 'pandas'], ['data', 'hadoop'], ['data', 'streamlit'],
  ['eng', 'fastapi'],
  
  // Cross-cutting connections
  ['root', 'python'], ['ml', 'python'], ['data', 'python']
];

const SynapseLine = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  return (
    <Line
      points={[start, end]}
      color="#ffffff"
      lineWidth={1}
      transparent
      opacity={0.15}
    />
  );
};

const Node = ({ position, label, color, size, count, onClick }: { position: [number, number, number], label: string, color: string, size: number, count: number, onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null!);
  const scale = hovered ? 1.15 : 1;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} scale={[scale, scale, scale]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <group ref={groupRef} onClick={onClick}>
          {/* Inner glowing core */}
          <Sphere args={[size * 0.7, 32, 32]}>
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={hovered ? 1.5 : 0.8}
              roughness={0.2}
            />
          </Sphere>
          
          {/* Tech wireframe shell */}
          <Sphere args={[size * 1.1, 16, 16]}>
            <meshBasicMaterial 
              color={color} 
              wireframe 
              transparent 
              opacity={hovered ? 0.4 : 0.15} 
            />
          </Sphere>

          {/* Glassy outer bubble */}
          <Sphere args={[size * 1.25, 32, 32]}>
            <meshPhysicalMaterial 
              color={color}
              transparent 
              opacity={0.2}
              roughness={0}
              transmission={0.9}
              thickness={1}
            />
          </Sphere>
        </group>
        
        <Text 
          position={[0, size * 1.6, 0]} 
          fontSize={0.3} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf"
        >
          {label}
        </Text>
        
        {hovered && count > 0 && (
          <Html position={[0, -size * 1.5, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-black/90 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md cursor-pointer pointer-events-none">
              {count} Shipped Project{count > 1 ? 's' : ''}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

export const KnowledgeGraph = ({ onNodeClick }: { onNodeClick?: (id: string) => void }) => {
  const [resetKey, setResetKey] = useState(0);
  const getNodePos = (id: string) => nodes.find(n => n.id === id)?.pos || [0, 0, 0];

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden bg-black/50 border border-white/5 relative">
      <div className="absolute top-4 left-4 z-10 text-xs text-gray-400 font-mono flex items-center bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
        Neural link active. Click nodes to filter Mission Control.
      </div>
      <button 
        onClick={() => setResetKey(prev => prev + 1)}
        className="absolute top-4 right-4 z-10 text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-colors"
      >
        Reset Camera
      </button>
      <Canvas key={resetKey} camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#030303']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color={nodes[0].color} />
        
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={1.5} />
        
        {connections.map(([startId, endId], i) => (
          <SynapseLine 
            key={i} 
            start={getNodePos(startId)} 
            end={getNodePos(endId)} 
          />
        ))}

        {nodes.map(node => (
          <Node 
            key={node.id} 
            position={node.pos} 
            label={node.label} 
            color={node.color}
            size={node.size}
            count={node.count}
            onClick={() => onNodeClick && onNodeClick(node.id)} 
          />
        ))}

        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
};
