import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';

// Realistic 3D Avatar using basic geometries
const SimpleAvatar = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000); // Random blinking between 3-5 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      // More dynamic interaction when hovered
      const rotationSpeed = hovered ? 0.5 : 0.3;
      const rotationAmount = hovered ? 0.2 : 0.1;
      const floatSpeed = hovered ? 1.2 : 0.8;
      const floatAmount = hovered ? 0.08 : 0.05;
      
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * rotationSpeed) * rotationAmount;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmount;
      
      // Subtle head tilt when hovered
      if (hovered) {
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      } else {
        groupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Head - More realistic proportions */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#d4a574" : "#c4956c"} 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.85, -0.1]} scale={[1.1, 0.6, 1.1]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#2d1b14" roughness={0.8} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.25, 16]} />
        <meshStandardMaterial color="#c4956c" roughness={0.7} />
      </mesh>
      
      {/* Body - Shirt */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.28, 0.35, 1.0, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      
      {/* Shirt collar */}
      <mesh position={[0, 1.1, 0.1]}>
        <cylinderGeometry args={[0.15, 0.18, 0.15, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      
      {/* Left Arm - Waves when hovered */}
      <group 
        position={[-0.5, 0.9, 0]} 
        rotation={[0, 0, hovered ? -0.8 : -0.2]}
      >
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
          <meshStandardMaterial color="#c4956c" roughness={0.7} />
        </mesh>
        {/* Forearm - Animated when hovered */}
        <mesh 
          position={[0, -0.5, 0]} 
          rotation={[hovered ? -0.5 : 0, hovered ? 0.3 : 0, hovered ? 0.4 : 0]}
        >
          <cylinderGeometry args={[0.07, 0.08, 0.4, 12]} />
          <meshStandardMaterial color="#c4956c" roughness={0.7} />
        </mesh>
        {/* Hand - Waves */}
        <mesh 
          position={[hovered ? -0.2 : 0, hovered ? -0.6 : -0.75, hovered ? 0.3 : 0]}
          rotation={[hovered ? -0.2 : 0, hovered ? 0.4 : 0, hovered ? 0.2 : 0]}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#c4956c" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Right Arm - Holding camera */}
      <group position={[0.5, 0.9, 0]} rotation={[0, 0, hovered ? 0.1 : 0.2]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
          <meshStandardMaterial color="#c4956c" roughness={0.7} />
        </mesh>
        {/* Forearm - More dynamic when hovered */}
        <mesh position={[0, -0.5, 0]} rotation={[hovered ? -0.1 : -0.3, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.4, 12]} />
          <meshStandardMaterial color="#c4956c" roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.65, hovered ? 0.25 : 0.15]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#c4956c" roughness={0.7} />
        </mesh>
        {/* Camera - Raises when hovered */}
        <mesh position={[0, -0.6, hovered ? 0.35 : 0.25]} rotation={[0, hovered ? 0 : -0.3, 0]}>
          <boxGeometry args={[0.25, 0.18, 0.12]} />
          <meshStandardMaterial 
            color={hovered ? "#374151" : "#1f2937"} 
            roughness={0.3} 
            metalness={0.7} 
          />
        </mesh>
        {/* Camera lens - Glows when hovered */}
        <mesh position={[0.05, -0.6, hovered ? 0.41 : 0.31]} rotation={[0, hovered ? 0 : -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
          <meshStandardMaterial 
            color={hovered ? "#1e40af" : "#000000"} 
            roughness={0.1} 
            metalness={0.9}
            emissive={hovered ? "#1e40af" : "#000000"}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </mesh>
        {/* Camera flash/LED when hovered */}
        {hovered && (
          <mesh position={[-0.08, -0.55, hovered ? 0.41 : 0.31]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff"
              emissiveIntensity={0.8}
            />
          </mesh>
        )}
      </group>
      
      {/* Eyes - Blinking animation */}
      <mesh position={[-0.12, 1.65, 0.28]} scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#f0f8ff" : "#ffffff"} 
          emissive={hovered ? "#e3f2fd" : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>
      <mesh position={[0.12, 1.65, 0.28]} scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#f0f8ff" : "#ffffff"} 
          emissive={hovered ? "#e3f2fd" : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>
      {/* Pupils - Follow mouse when hovered */}
      <mesh position={[-0.12, 1.65, 0.31]} scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#1565c0" : "#2d1b14"} />
      </mesh>
      <mesh position={[0.12, 1.65, 0.31]} scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#1565c0" : "#2d1b14"} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.58, 0.3]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshStandardMaterial color="#b8905f" roughness={0.7} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.15, -0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 12]} />
        <meshStandardMaterial color="#1e40af" roughness={0.6} />
      </mesh>
      <mesh position={[0.15, -0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 12]} />
        <meshStandardMaterial color="#1e40af" roughness={0.6} />
      </mesh>
      
      {/* Shoes */}
      <mesh position={[-0.15, -0.75, 0.05]}>
        <boxGeometry args={[0.2, 0.1, 0.35]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} />
      </mesh>
      <mesh position={[0.15, -0.75, 0.05]}>
        <boxGeometry args={[0.2, 0.1, 0.35]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} />
      </mesh>
      
      {/* Floating text */}
      {hovered && (
        <Html position={[0, 2.4, 0]} center>
          <div className="bg-black/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-white/20">
            Hey! I'm Abhi 👋 Your Creative Partner
          </div>
        </Html>
      )}
    </group>
  );
};

// Main Avatar Component
const Avatar3D = ({ 
  position = [0, -1.5, 0], 
  scale = 1.2,
  showControls = true,
  autoRotate = false,
  style = {},
  className = ""
}) => {
  return (
    <div className={`w-full h-full ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, 10]} intensity={0.8} color="#3b82f6" />
        <spotLight 
          position={[0, 5, 5]} 
          intensity={1} 
          angle={0.3} 
          penumbra={1} 
          color="#f59e0b"
          castShadow
        />

        <Suspense fallback={
          <Html position={[0, 0, 0]} center>
            <div className="text-white text-center">
              <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading your avatar...
            </div>
          </Html>
        }>
          <SimpleAvatar position={position} scale={scale} />
        </Suspense>

        <ContactShadows 
          position={[0, -1.5, 0]} 
          scale={5} 
          opacity={0.3} 
          far={2} 
        />

        <Environment preset="studio" />

        {showControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        )}
      </Canvas>
    </div>
  );
};

// Floating Avatar Component for corner display
export const FloatingAvatar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className={`fixed bottom-4 right-4 z-30 transition-all duration-300 md:bottom-6 md:right-6 ${
      isMinimized ? 'w-14 h-14 md:w-16 md:h-16' : 'w-32 h-32 md:w-48 md:h-48'
    }`}>
      <div className="relative w-full h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <Avatar3D 
          showControls={!isMinimized}
          autoRotate={isMinimized}
          scale={isMinimized ? 0.6 : 0.8}
        />
        
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70 transition-colors"
        >
          {isMinimized ? '↗' : '↙'}
        </button>
        
        {!isMinimized && (
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <p className="text-xs text-white/80 bg-black/50 rounded px-2 py-1">
              Your Creative Partner
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Hero Section Avatar
export const HeroAvatar = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Clean Avatar - No Shadows */}
      <div className="w-full h-96">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-10, -10, 10]} intensity={0.8} color="#3b82f6" />
          
          <SimpleAvatar position={[0, -0.5, 0]} scale={0.7} />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
      
    </div>
  );
};

export default Avatar3D;
