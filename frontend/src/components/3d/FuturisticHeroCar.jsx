import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FuturisticHeroCar - Premium Cyber Mobility Cruiser
 * Refined 3D Model:
 * - Rich midnight metallic blue paint with crisp specular highlights
 * - Glowing cockpit interior HUD glow
 * - Electric blue & neon violet LED lightbars and side runners
 * - Spinning aerodynamic turbine wheels
 * - Subtle idle floating suspension motion
 */
export const FuturisticHeroCar = ({
  primaryNeon = '#3B82F6',   // Electric Blue
  secondaryNeon = '#8B5CF6', // Neon Violet
  headlightColor = '#E0F2FE', // Ice White/Cyan
  autoRotate = false,
}) => {
  const carGroup = useRef();
  const flWheel = useRef();
  const frWheel = useRef();
  const rlWheel = useRef();
  const rrWheel = useRef();

  useFrame((state, delta) => {
    if (!carGroup.current) return;

    const t = state.clock.getElapsedTime();
    // Idle float breathing motion
    carGroup.current.position.y = Math.sin(t * 1.8) * 0.035;

    // Gentle aerodynamic sway
    carGroup.current.rotation.z = Math.sin(t * 1.2) * 0.008;

    // Wheel spin simulation for highway speed
    const spin = delta * 4.5;
    if (flWheel.current) flWheel.current.rotation.x += spin;
    if (frWheel.current) frWheel.current.rotation.x += spin;
    if (rlWheel.current) rlWheel.current.rotation.x += spin;
    if (rrWheel.current) rrWheel.current.rotation.x += spin;
  });

  return (
    <group ref={carGroup} position={[0, 0, 0]}>
      {/* --- 1. MAIN LOWER CHASSIS & AERODYNAMIC BODY --- */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.78, 0.36, 4.2]} />
        <meshStandardMaterial
          color="#162032"
          metalness={0.7}
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* --- 2. AERODYNAMIC NOSE / FRONT HOOD --- */}
      <mesh position={[0, 0.48, 1.3]} rotation={[0.07, 0, 0]} castShadow>
        <boxGeometry args={[1.74, 0.24, 1.62]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.75}
          roughness={0.22}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Hood Center Aerodynamic Ridge */}
      <mesh position={[0, 0.61, 1.25]} rotation={[0.07, 0, 0]}>
        <boxGeometry args={[0.32, 0.04, 1.4]} />
        <meshStandardMaterial
          color="#2563EB"
          emissive="#1D4ED8"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* --- 3. SLEEK COCKPIT & CANOPY --- */}
      <mesh position={[0, 0.86, -0.15]} castShadow>
        <boxGeometry args={[1.44, 0.48, 2.1]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.85}
          roughness={0.12}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Interior Cockpit Dashboard Glow */}
      <pointLight position={[0, 0.8, 0.2]} intensity={1.2} color="#38BDF8" distance={2.5} />
      <mesh position={[0, 0.76, 0.35]}>
        <boxGeometry args={[0.8, 0.08, 0.3]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* --- 4. WINDSHIELD GLASS PANELS --- */}
      {/* Front Windshield */}
      <mesh position={[0, 0.84, 0.77]} rotation={[-0.42, 0, 0]}>
        <boxGeometry args={[1.38, 0.46, 0.05]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.08}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* Rear Fastback Glass */}
      <mesh position={[0, 0.84, -1.06]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[1.38, 0.46, 0.05]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#6D28D9"
          emissiveIntensity={0.35}
          metalness={0.9}
          roughness={0.08}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* --- 5. NEON SIGNATURE LIGHTING (ELECTRIC BLUE & VIOLET) --- */}
      {/* Full-width front hood LED lightbar */}
      <mesh position={[0, 0.52, 2.12]}>
        <boxGeometry args={[1.7, 0.06, 0.04]} />
        <meshStandardMaterial
          color={primaryNeon}
          emissive={primaryNeon}
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>

      {/* Dual projector headlights */}
      <mesh position={[-0.68, 0.44, 2.13]}>
        <boxGeometry args={[0.26, 0.1, 0.05]} />
        <meshStandardMaterial
          color={headlightColor}
          emissive={headlightColor}
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.68, 0.44, 2.13]}>
        <boxGeometry args={[0.26, 0.1, 0.05]} />
        <meshStandardMaterial
          color={headlightColor}
          emissive={headlightColor}
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>

      {/* Side Skirt Neon Runners (Left & Right) */}
      <mesh position={[-0.9, 0.22, 0]}>
        <boxGeometry args={[0.04, 0.04, 3.4]} />
        <meshStandardMaterial
          color={secondaryNeon}
          emissive={secondaryNeon}
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.9, 0.22, 0]}>
        <boxGeometry args={[0.04, 0.04, 3.4]} />
        <meshStandardMaterial
          color={secondaryNeon}
          emissive={secondaryNeon}
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>

      {/* Rear Cyber Light Bar */}
      <mesh position={[0, 0.62, -2.12]}>
        <boxGeometry args={[1.66, 0.06, 0.04]} />
        <meshStandardMaterial
          color={secondaryNeon}
          emissive={secondaryNeon}
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>

      {/* Rear Lower Aerodynamic Diffuser */}
      <mesh position={[0, 0.24, -2.09]}>
        <boxGeometry args={[1.44, 0.12, 0.12]} />
        <meshStandardMaterial
          color={primaryNeon}
          emissive={primaryNeon}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* --- 6. TURBINE WHEELS WITH EMISSIVE RIM RINGS --- */}
      {/* Front Left */}
      <group position={[-0.93, 0.32, 1.3]}>
        <mesh ref={flWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[-0.12, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.22, 0.28, 24]} />
          <meshStandardMaterial
            color={primaryNeon}
            emissive={primaryNeon}
            emissiveIntensity={2.8}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[0.93, 0.32, 1.3]}>
        <mesh ref={frWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.12, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.22, 0.28, 24]} />
          <meshStandardMaterial
            color={primaryNeon}
            emissive={primaryNeon}
            emissiveIntensity={2.8}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Rear Left */}
      <group position={[-0.93, 0.32, -1.3]}>
        <mesh ref={rlWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.24, 24]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[-0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.22, 0.29, 24]} />
          <meshStandardMaterial
            color={secondaryNeon}
            emissive={secondaryNeon}
            emissiveIntensity={2.8}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Rear Right */}
      <group position={[0.93, 0.32, -1.3]}>
        <mesh ref={rrWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.24, 24]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.22, 0.29, 24]} />
          <meshStandardMaterial
            color={secondaryNeon}
            emissive={secondaryNeon}
            emissiveIntensity={2.8}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* --- 7. AERODYNAMIC REAR SPOILER WING --- */}
      <group position={[0, 0.98, -1.9]}>
        <mesh castShadow>
          <boxGeometry args={[1.68, 0.05, 0.34]} />
          <meshStandardMaterial
            color="#1E293B"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Left Stanchion */}
        <mesh position={[-0.58, -0.16, 0]}>
          <boxGeometry args={[0.06, 0.28, 0.22]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Right Stanchion */}
        <mesh position={[0.58, -0.16, 0]}>
          <boxGeometry args={[0.06, 0.28, 0.22]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Trailing Spoiler Neon Edge */}
        <mesh position={[0, 0.02, -0.17]}>
          <boxGeometry args={[1.66, 0.03, 0.03]} />
          <meshStandardMaterial
            color={secondaryNeon}
            emissive={secondaryNeon}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
};
export default FuturisticHeroCar;
