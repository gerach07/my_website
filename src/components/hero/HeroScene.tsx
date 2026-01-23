'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PresentationControls, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useUI } from '@/context/UIContext';

function CameraController() {
  const { selectedProjectSlug } = useUI();
  const { camera } = useThree();
  
  // Define target coordinates for each project
  const targets: Record<string, THREE.Vector3> = {
    'astra-link': new THREE.Vector3(2, 0, 3),
    'quantum-ui': new THREE.Vector3(-2, 1, 3),
    'default': new THREE.Vector3(0, 0, 5)
  };

  useFrame((state) => {
    const target = targets[selectedProjectSlug || 'default'] || targets['default'];
    
    // Smoothly lerp camera position
    state.camera.position.lerp(target, 0.05);
    
    // Look at the center or a specific point
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function DeformedSphere({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const { selectedProjectSlug } = useUI();
  useCursor(hovered);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useFrame((state) => {
    if (prefersReducedMotion) return;

    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(time / 4) * 0.2;
    meshRef.current.rotation.y = Math.sin(time / 4) * 0.2;

    if (Math.random() > 0.98) {
      meshRef.current.position.x = (Math.random() - 0.5) * 0.1;
      meshRef.current.position.y = (Math.random() - 0.5) * 0.1;
    } else {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <Float speed={prefersReducedMotion ? 0 : 2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={isHovered || selectedProjectSlug ? 1.4 : 1.2}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={isHovered || selectedProjectSlug ? "#00FF41" : "#2A2A2A"}
          wireframe
          speed={prefersReducedMotion ? 0 : 3}
          distort={isHovered || selectedProjectSlug ? 0.6 : 0.4}
          radius={1}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene({ isHovered }: { isHovered: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 md:opacity-100 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-[#2A2A2A] rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 md:opacity-100">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false }}
      >
        <CameraController />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <DeformedSphere isHovered={isHovered} />
        </PresentationControls>
      </Canvas>
    </div>
  );
}
