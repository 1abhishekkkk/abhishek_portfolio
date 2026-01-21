import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Simple 3D Avatar using basic geometries
const SimpleAvatarMesh = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1.2, 8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.6, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.6, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Camera in hand */}
      <mesh position={[0.6, 0.4, 0.2]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 1.6, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.6, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

// Main Avatar Component
const SimpleAvatar = ({ 
  position = [0, -1, 0], 
  scale = 1,
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

        <SimpleAvatarMesh position={position} scale={scale} />

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

// Hero Section Avatar
export const HeroAvatar = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <SimpleAvatar 
        position={[0, -0.5, 0]}
        scale={1.2}
        showControls={false}
        autoRotate={true}
        className="w-full h-96"
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        <p>3D Avatar • Interactive</p>
      </div>
    </div>
  );
};

// Floating Avatar Component
export const FloatingAvatar = () => {
  const [isMinimized, setIsMinimized] = React.useState(false);

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
      isMinimized ? 'w-16 h-16' : 'w-48 h-48'
    }`}>
      <div className="relative w-full h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <SimpleAvatar 
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

export default SimpleAvatar;