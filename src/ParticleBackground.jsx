import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 100, 200]} scale={2.2}>
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

// Particle System
const Particles = ({ count = 150, isMobile = false }) => {
  const points = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random positions - mix of close and far particles
      const radius = Math.random() * 15; // 0 to 15 units from center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.set([x, y, z], i * 3);
      
      // Random colors (purple, blue, orange palette)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors.set([0.8, 0.3, 1], i * 3); // Purple
      } else if (colorChoice < 0.66) {
        colors.set([0.2, 0.5, 1], i * 3); // Blue
      } else {
        colors.set([1, 0.6, 0.2], i * 3); // Orange
      }
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.05;
      points.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.positions.length / 3}
          array={particlesPosition.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesPosition.colors.length / 3}
          array={particlesPosition.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.25 : 0.1}
        vertexColors
        transparent
        opacity={isMobile ? 0.9 : 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ParticleBackground = () => {
  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const particleCount = isMobile ? 150 : 300; // Reduce particles on mobile for better performance
  
  return (
    <div style={{ 
      position: 'fixed',
      inset: 0,
      width: '100dvw',
      height: '100dvh',
      zIndex: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(45deg, #0f172a 0%, #1e293b 100%)'
    }}>
      <Canvas
        style={{ display: 'block', width: '100%', height: '100%' }}
        gl={{ 
          alpha: true, 
          powerPreference: isMobile ? 'low-power' : 'high-performance',
          antialias: !isMobile // Disable antialiasing on mobile for better performance
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          gl.setSize(window.innerWidth, window.innerHeight);
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#f59e0b" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <AnimatedSphere />
        
        {/* Particle system */}
        <Particles count={particleCount} isMobile={isMobile} />
        
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