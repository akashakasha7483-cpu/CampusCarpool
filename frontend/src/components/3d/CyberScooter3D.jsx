import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const CyberScooter3D = ({ color = '#10b981', autoRotate = true }) => {
  const scooterGroup = useRef();
  const frontWheel = useRef();
  const rearWheel = useRef();

  useFrame((state, delta) => {
    if (!scooterGroup.current) return;
    const t = state.clock.getElapsedTime();
    scooterGroup.current.position.y = Math.sin(t * 1.8) * 0.02;

    if (autoRotate) {
      scooterGroup.current.rotation.y += delta * 0.4;
    }

    const rot = delta * 3.5;
    if (frontWheel.current) frontWheel.current.rotation.x += rot;
    if (rearWheel.current) rearWheel.current.rotation.x += rot;
  });

  return (
    <group ref={scooterGroup} position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* Lower Foot Deck */}
      <mesh position={[0, 0.25, -0.1]}>
        <boxGeometry args={[0.45, 0.12, 1.3]} />
        <meshStandardMaterial color="#0b1322" metalness={0.8} />
      </mesh>

      {/* Deck Neon Strip */}
      <mesh position={[0, 0.28, -0.1]}>
        <boxGeometry args={[0.48, 0.02, 1.2]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Front Aerodynamic Apron */}
      <mesh position={[0, 0.75, 0.65]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.42, 0.8, 0.2]} />
        <meshStandardMaterial color="#111c2e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Digital Dashboard Handlebar */}
      <mesh position={[0, 1.2, 0.52]}>
        <boxGeometry args={[0.65, 0.06, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Cyber Headlight Strip */}
      <mesh position={[0, 0.85, 0.76]}>
        <boxGeometry args={[0.3, 0.06, 0.04]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Seat Bench */}
      <mesh position={[0, 0.72, -0.45]}>
        <boxGeometry args={[0.36, 0.18, 0.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>

      {/* Rear Taillight */}
      <mesh position={[0, 0.65, -0.88]}>
        <boxGeometry args={[0.22, 0.05, 0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* FRONT WHEEL */}
      <group position={[0, 0.25, 0.75]} ref={frontWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.14, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* REAR WHEEL */}
      <group position={[0, 0.25, -0.75]} ref={rearWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Ground Neon Glow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 2.2]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default CyberScooter3D;

