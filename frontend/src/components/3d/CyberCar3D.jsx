import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Procedural Futuristic Cyber Car
 * Realistic geometry, neon light trails, and interactive rotation.
 */
export const CyberCar3D = ({ color = '#10b981', autoRotate = true, interactive = true }) => {
  const carGroup = useRef();
  const frontLeftWheel = useRef();
  const frontRightWheel = useRef();
  const rearLeftWheel = useRef();
  const rearRightWheel = useRef();

  useFrame((state, delta) => {
    if (!carGroup.current) return;

    // Subtle breathing / suspension float
    const t = state.clock.getElapsedTime();
    carGroup.current.position.y = Math.sin(t * 1.5) * 0.03;

    // Auto slow rotation if enabled
    if (autoRotate) {
      carGroup.current.rotation.y += delta * 0.35;
    }

    // Wheel spin simulation
    const wheelRot = delta * 2.5;
    if (frontLeftWheel.current) frontLeftWheel.current.rotation.x += wheelRot;
    if (frontRightWheel.current) frontRightWheel.current.rotation.x += wheelRot;
    if (rearLeftWheel.current) rearLeftWheel.current.rotation.x += wheelRot;
    if (rearRightWheel.current) rearRightWheel.current.rotation.x += wheelRot;
  });

  return (
    <group ref={carGroup} position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* Lower Chassis / Battery Pack */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.7, 0.25, 3.8]} />
        <meshStandardMaterial
          color="#0b1322"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Main Aerodynamic Body Shell */}
      <mesh position={[0, 0.55, 0.1]}>
        <boxGeometry args={[1.65, 0.35, 3.4]} />
        <meshStandardMaterial
          color="#101c30"
          metalness={0.9}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Cabin / Windshield Canopy */}
      <mesh position={[0, 0.9, -0.15]}>
        <boxGeometry args={[1.3, 0.45, 1.9]} />
        <meshPhysicalMaterial
          color="#050a14"
          transmission={0.6}
          opacity={0.85}
          transparent
          roughness={0.1}
          metalness={0.9}
          reflectivity={0.9}
        />
      </mesh>

      {/* Roof Aerodynamic Fin */}
      <mesh position={[0, 1.15, -0.6]}>
        <boxGeometry args={[0.06, 0.18, 0.7]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>

      {/* Hood Slanted Scoop */}
      <mesh position={[0, 0.6, 1.2]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.4, 0.12, 1.1]} />
        <meshStandardMaterial color="#0b1322" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Cyber LED Headlight Strip (Neon Emerald) */}
      <mesh position={[0, 0.52, 1.91]}>
        <boxGeometry args={[1.45, 0.06, 0.05]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Headlight Left Projector */}
      <mesh position={[-0.6, 0.52, 1.9]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Headlight Right Projector */}
      <mesh position={[0.6, 0.52, 1.9]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Cyber LED Taillight Bar (Neon Crimson/Cyan) */}
      <mesh position={[0, 0.65, -1.81]}>
        <boxGeometry args={[1.5, 0.05, 0.05]} />
        <meshBasicMaterial color="#f43f5e" />
      </mesh>

      {/* Neon Underglow Ambient Plate */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 4.0]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>

      {/* WHEEL 1: Front-Left */}
      <group position={[-0.9, 0.35, 1.15]} ref={frontLeftWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.22, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        {/* Neon Rim Ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* WHEEL 2: Front-Right */}
      <group position={[0.9, 0.35, 1.15]} ref={frontRightWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.22, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* WHEEL 3: Rear-Left */}
      <group position={[-0.9, 0.35, -1.15]} ref={rearLeftWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* WHEEL 4: Rear-Right */}
      <group position={[0.9, 0.35, -1.15]} ref={rearRightWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 24]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Dual Side Mirrors */}
      <mesh position={[-0.85, 0.85, 0.4]}>
        <boxGeometry args={[0.2, 0.08, 0.12]} />
        <meshStandardMaterial color="#0b1322" metalness={0.9} />
      </mesh>
      <mesh position={[0.85, 0.85, 0.4]}>
        <boxGeometry args={[0.2, 0.08, 0.12]} />
        <meshStandardMaterial color="#0b1322" metalness={0.9} />
      </mesh>
    </group>
  );
};

export default CyberCar3D;
