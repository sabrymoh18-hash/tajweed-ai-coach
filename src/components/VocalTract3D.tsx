import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface VocalTract3DProps {
  color: string;
  active: boolean;
}

function GlowingNode({ color, active }: VocalTract3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the node slowly
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
      
      // If active (microphone listening), pulse the scale
      if (active) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.15;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1}>
        <MeshDistortMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={active ? 0.8 : 0.2}
          envMapIntensity={1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.8} 
          roughness={0.2}
          distort={active ? 0.4 : 0.2}
          speed={active ? 4 : 1}
        />
      </Sphere>
    </Float>
  );
}

export function VocalTract3D({ color, active }: VocalTract3DProps) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-3xl overflow-hidden relative" style={{ background: 'radial-gradient(circle at center, #111827, #0a0f16)' }}>
      {/* Decorative Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(10,15,22,0.8) 0%, transparent 20%, transparent 80%, rgba(10,15,22,0.8) 100%)' }}></div>
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }}></span>}
          <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: color }}></span>
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-white/50">Vocal Node</span>
      </div>

      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color={color} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <GlowingNode color={color} active={active} />
        
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate={!active} autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
