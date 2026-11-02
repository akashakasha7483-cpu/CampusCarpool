import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CyberCar3D - Procedural High-Fidelity Futuristic Electric Sports Car
 * Visual styling aligned with reference image (media_1793605701593_0fbae567.jpg):
 * - Sleek metallic slate/graphite bodywork with clear highlights
 * - Continuous front hood emerald LED light bar
 * - Vertical C-shaped front bumper air intake neon blades
 * - Lower front splitter lip
 * - Side skirt rocker neon light bars with rear kick
 * - Dual projector headlights (ice-white/cyan)
 * - Aerodynamic turbine wheels with neon rim accents
 */
export const CyberCar3D = ({ color = '#10b981', autoRotate = true, interactive = true }) => {
  const carGroup = useRef();
  const flWheel = useRef();
  const frWheel = useRef();
  const rlWheel = useRef();
  const rrWheel = useRef();

  useFrame((state, delta) => {
    if (!carGroup.current) return;

    // Idle suspension float
    const t = state.clock.getElapsedTime();
    carGroup.current.position.y = Math.sin(t * 1.5) * 0.025;

    // Smooth turntable rotation
    if (autoRotate) {
      carGroup.current.rotation.y += delta * 0.25;
    }

    // Wheel spin
    const spin = delta * 2.0;
    if (flWheel.current) flWheel.current.rotation.x += spin;
    if (frWheel.current) frWheel.current.rotation.x += spin;
    if (rlWheel.current) rlWheel.current.rotation.x += spin;
    if (rrWheel.current) rrWheel.current.rotation.x += spin;
  });

  // Metallic Slate/Graphite Body Paint Material (Vividly visible & reflective)
  const bodyPaintMaterial = (
    <meshStandardMaterial
      color="#223044"
      metalness={0.7}
      roughness={0.25}
    />
  );

  const darkTrimMaterial = (
    <meshStandardMaterial
      color="#0f1622"
      metalness={0.5}
      roughness={0.5}
    />
  );

  const glassMaterial = (
    <meshPhysicalMaterial
      color="#08101a"
      metalness={0.9}
      roughness={0.05}
      transmission={0.65}
      transparent
      opacity={0.85}
      reflectivity={0.9}
    />
  );

  const neonGreenMaterial = (
    <meshStandardMaterial
      color="#00ff88"
      emissive="#00ff88"
      emissiveIntensity={3.5}
      toneMapped={false}
    />
  );

  const headlightMaterial = (
    <meshStandardMaterial
      color="#e6fff7"
      emissive="#a7f3d0"
      emissiveIntensity={4.0}
      toneMapped={false}
    />
  );

  return (
    <group ref={carGroup} position={[0, 0, 0]} rotation={[0, 2.2, 0]} scale={[0.95, 0.95, 0.95]}>
      {/* ============================================================ */}
      {/* 1. SCULPTED CAR CHASSIS & AERODYNAMIC BODYWORK               */}
      {/* ============================================================ */}

      {/* Lower Chassis / Battery Base */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.72, 0.22, 4.1]} />
        {darkTrimMaterial}
      </mesh>

      {/* Main Mid-Body Hull */}
      <mesh position={[0, 0.48, 0.05]}>
        <boxGeometry args={[1.7, 0.32, 3.8]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Front Sculpted Hood Slope */}
      <mesh position={[0, 0.54, 1.25]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[1.62, 0.16, 1.35]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Front Nose Cone / Bumper Center */}
      <mesh position={[0, 0.42, 1.95]}>
        <boxGeometry args={[1.56, 0.26, 0.25]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Lower Front Air Dam / Honeycomb Center Grill */}
      <mesh position={[0, 0.28, 1.98]}>
        <boxGeometry args={[1.1, 0.14, 0.08]} />
        <meshStandardMaterial color="#080c14" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Left Front Flared Fender */}
      <mesh position={[-0.82, 0.48, 1.15]}>
        <boxGeometry args={[0.12, 0.32, 1.2]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Right Front Flared Fender */}
      <mesh position={[0.82, 0.48, 1.15]}>
        <boxGeometry args={[0.12, 0.32, 1.2]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Left Rear Muscular Quarter Panel */}
      <mesh position={[-0.82, 0.54, -1.15]}>
        <boxGeometry args={[0.14, 0.36, 1.3]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Right Rear Muscular Quarter Panel */}
      <mesh position={[0.82, 0.54, -1.15]}>
        <boxGeometry args={[0.14, 0.36, 1.3]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Cabin Greenhouse / Windshield Slope */}
      <mesh position={[0, 0.82, -0.05]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[1.36, 0.44, 2.0]} />
        {glassMaterial}
      </mesh>

      {/* Aerodynamic Roof Panel */}
      <mesh position={[0, 1.05, -0.22]}>
        <boxGeometry args={[1.28, 0.06, 1.45]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Rear Sloping Fastback Trunk / Decklid */}
      <mesh position={[0, 0.65, -1.55]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[1.54, 0.16, 0.95]} />
        {bodyPaintMaterial}
      </mesh>

      {/* Rear Diffuser Trim */}
      <mesh position={[0, 0.3, -2.0]}>
        <boxGeometry args={[1.6, 0.2, 0.2]} />
        {darkTrimMaterial}
      </mesh>

      {/* ============================================================ */}
      {/* 2. SIGNATURE NEON EMERALD ACCENTS MATCHING REFERENCE IMAGE   */}
      {/* ============================================================ */}

      {/* Front Full-Width Continuous Hood LED Light Bar */}
      <mesh position={[0, 0.56, 2.0]}>
        <boxGeometry args={[1.48, 0.035, 0.04]} />
        {neonGreenMaterial}
      </mesh>

      {/* Front Left Headlight Twin Projector Lamps */}
      <mesh position={[-0.56, 0.52, 1.98]}>
        <boxGeometry args={[0.26, 0.08, 0.05]} />
        {headlightMaterial}
      </mesh>
      {/* Front Right Headlight Twin Projector Lamps */}
      <mesh position={[0.56, 0.52, 1.98]}>
        <boxGeometry args={[0.26, 0.08, 0.05]} />
        {headlightMaterial}
      </mesh>

      {/* Left Front Bumper Vertical C-Intake Neon Blade */}
      <mesh position={[-0.74, 0.38, 1.98]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.028, 0.26, 0.03]} />
        {neonGreenMaterial}
      </mesh>
      <mesh position={[-0.67, 0.26, 1.98]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.16, 0.026, 0.03]} />
        {neonGreenMaterial}
      </mesh>
      <mesh position={[-0.69, 0.5, 1.98]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.12, 0.024, 0.03]} />
        {neonGreenMaterial}
      </mesh>

      {/* Right Front Bumper Vertical C-Intake Neon Blade */}
      <mesh position={[0.74, 0.38, 1.98]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.028, 0.26, 0.03]} />
        {neonGreenMaterial}
      </mesh>
      <mesh position={[0.67, 0.26, 1.98]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.16, 0.026, 0.03]} />
        {neonGreenMaterial}
      </mesh>
      <mesh position={[0.69, 0.5, 1.98]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.12, 0.024, 0.03]} />
        {neonGreenMaterial}
      </mesh>

      {/* Lower Front Splitter Chin Neon Strip */}
      <mesh position={[0, 0.2, 2.02]}>
        <boxGeometry args={[1.3, 0.02, 0.04]} />
        {neonGreenMaterial}
      </mesh>

      {/* Left Side Skirt Neon Bar */}
      <mesh position={[-0.88, 0.21, 0.05]}>
        <boxGeometry args={[0.03, 0.032, 2.3]} />
        {neonGreenMaterial}
      </mesh>
      {/* Left Side Skirt Rear Kick */}
      <mesh position={[-0.88, 0.26, -1.15]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.028, 0.16]} />
        {neonGreenMaterial}
      </mesh>

      {/* Right Side Skirt Neon Bar */}
      <mesh position={[0.88, 0.21, 0.05]}>
        <boxGeometry args={[0.03, 0.032, 2.3]} />
        {neonGreenMaterial}
      </mesh>
      {/* Right Side Skirt Rear Kick */}
      <mesh position={[0.88, 0.26, -1.15]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.028, 0.16]} />
        {neonGreenMaterial}
      </mesh>

      {/* Left Side Mirror + Neon Indicator */}
      <mesh position={[-0.92, 0.76, 0.62]}>
        <boxGeometry args={[0.18, 0.08, 0.1]} />
        {bodyPaintMaterial}
      </mesh>
      <mesh position={[-0.94, 0.76, 0.62]}>
        <boxGeometry args={[0.14, 0.016, 0.02]} />
        {neonGreenMaterial}
      </mesh>

      {/* Right Side Mirror + Neon Indicator */}
      <mesh position={[0.92, 0.76, 0.62]}>
        <boxGeometry args={[0.18, 0.08, 0.1]} />
        {bodyPaintMaterial}
      </mesh>
      <mesh position={[0.94, 0.76, 0.62]}>
        <boxGeometry args={[0.14, 0.016, 0.02]} />
        {neonGreenMaterial}
      </mesh>

      {/* Rear Full-Width LED Tail Light Bar */}
      <mesh position={[0, 0.62, -2.04]}>
        <boxGeometry args={[1.5, 0.04, 0.03]} />
        <meshStandardMaterial
          color="#ff1e42"
          emissive="#ff1e42"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>

      {/* Emerald Underglow Floor Reflector */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 4.2]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.36}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight position={[0, 0.15, 0]} intensity={4.5} distance={5} color="#00ff88" />

      {/* ============================================================ */}
      {/* 3. HIGH-TECH AERODYNAMIC TURBINE WHEELS                      */}
      {/* ============================================================ */}

      {/* Front-Left Wheel */}
      <group position={[-0.86, 0.35, 1.2]} ref={flWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.22, 28]} />
          <meshStandardMaterial color="#11141a" roughness={0.88} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.1, 0, 0]}>
          <torusGeometry args={[0.26, 0.016, 16, 32]} />
          {neonGreenMaterial}
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.08, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 8]} />
          <meshStandardMaterial color="#2c3b4f" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* Front-Right Wheel */}
      <group position={[0.86, 0.35, 1.2]} ref={frWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.22, 28]} />
          <meshStandardMaterial color="#11141a" roughness={0.88} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.1, 0, 0]}>
          <torusGeometry args={[0.26, 0.016, 16, 32]} />
          {neonGreenMaterial}
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 8]} />
          <meshStandardMaterial color="#2c3b4f" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* Rear-Left Wheel */}
      <group position={[-0.86, 0.35, -1.2]} ref={rlWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 28]} />
          <meshStandardMaterial color="#11141a" roughness={0.88} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.11, 0, 0]}>
          <torusGeometry args={[0.27, 0.016, 16, 32]} />
          {neonGreenMaterial}
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.09, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 8]} />
          <meshStandardMaterial color="#2c3b4f" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* Rear-Right Wheel */}
      <group position={[0.86, 0.35, -1.2]} ref={rrWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 28]} />
          <meshStandardMaterial color="#11141a" roughness={0.88} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.11, 0, 0]}>
          <torusGeometry args={[0.27, 0.016, 16, 32]} />
          {neonGreenMaterial}
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.09, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 8]} />
          <meshStandardMaterial color="#2c3b4f" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};

export default CyberCar3D;
