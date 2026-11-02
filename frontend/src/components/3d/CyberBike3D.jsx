import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const CyberBike3D = ({ color = '#10b981', autoRotate = true }) => {
  const bikeGroup = useRef();
  const frontWheel = useRef();
  const rearWheel = useRef();

  useFrame((state, delta) => {
    if (!bikeGroup.current) return;
    const t = state.clock.getElapsedTime();
    bikeGroup.current.position.y = Math.sin(t * 2) * 0.02;

    if (autoRotate) {
      bikeGroup.current.rotation.y += delta * 0.4;
    }

    const rot = delta * 3.5;
    if (frontWheel.current) frontWheel.current.rotation.x += rot;
    if (rearWheel.current) rearWheel.current.rotation.x += rot;
  });

  return (
    <group ref={bikeGroup} position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* Main Spine / Cyber Frame */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.3, 0.45, 1.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Battery / Energy Core (Neon Glow) */}
      <mesh position={[0, 0.55, -0.1]}>
        <boxGeometry args={[0.32, 0.28, 0.9]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>

      {/* Cyber Fuel Tank / Upper Fairing */}
      <mesh position={[0, 0.9, 0.25]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.9]} />
        <meshStandardMaterial color="#111c2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Ergonomic Driver Seat */}
      <mesh position={[0, 0.85, -0.45]}>
        <boxGeometry args={[0.26, 0.1, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Aerodynamic Tail */}
      <mesh position={[0, 0.95, -0.85]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.45]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      {/* Rear Tail Neon Strip */}
      <mesh position={[0, 1.0, -1.05]}>
        <boxGeometry args={[0.18, 0.04, 0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Front Fork & Steering Column */}
      <mesh position={[0, 0.7, 0.85]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>

      {/* Handlebars */}
      <mesh position={[0, 1.05, 0.68]}>
        <boxGeometry args={[0.7, 0.04, 0.06]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* Cyber Headlight Strip */}
      <mesh position={[0, 0.8, 1.05]}>
        <boxGeometry args={[0.22, 0.06, 0.05]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* FRONT WHEEL */}
      <group position={[0, 0.4, 1.05]} ref={frontWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.14, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.26, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* REAR WHEEL */}
      <group position={[0, 0.4, -0.95]} ref={rearWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.18, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.26, 0.025, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Ground Glow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 2.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default CyberBike3D;
