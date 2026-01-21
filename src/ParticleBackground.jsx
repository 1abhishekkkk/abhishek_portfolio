import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedSphere = () => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#f59e0b"
        attach="material"
        distort={0.5}
        speed={1.5}
        roughness={0.5}
        metalness={0.8}
      />
    </Sphere>
  );
};

const ParticleBackground = () => {
  return (
    <div style={{ 
      position: 'fixed',
      inset: 0,
      // Use dynamic viewport units to ensure correct sizing on mobile browsers
      width: '100dvw',
      height: '100dvh',
      zIndex: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(45deg, #0f172a 0%, #1e293b 100%)'
    }}>
      <Canvas
        style={{ display: 'block', width: '100%', height: '100%' }}
        gl={{ alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={({ gl }) => {
          // Improve mobile rendering stability
          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          gl.setSize(window.innerWidth, window.innerHeight);
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#f59e0b" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <AnimatedSphere />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;