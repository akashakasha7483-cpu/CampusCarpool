import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * RealisticCar3D - Premium Futuristic Electric Car
 * Visual design matching reference image (media_1793605701593_0fbae567.jpg):
 * - Obsidian metallic paint with clearcoat reflections
 * - Signature continuous emerald LED light bar across front hood
 * - Vertical C-shaped front bumper air intake neon blades
 * - Lower front splitter neon lip
 * - Side skirt rocker panel neon light bars
 * - Side mirror neon indicator strips
 * - Aerodynamic wheel rim neon accents
 * - Synchronized wheel spin and smooth idle turntable rotation
 */
export const RealisticCar3D = ({
  color = '#10b981',
  autoRotate = true,
  interactive = true,
  scale = 1.0,
}) => {
  const groupRef = useRef();
  const wheelsRef = useRef([]);

  // Load the realistic 3D vehicle model
  const { scene } = useGLTF('/models/car.glb');

  // Clone scene and apply high-end automotive materials matching reference
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    wheelsRef.current = [];

    // Traverse and apply premium metallic obsidian and emerald accents
    clone.traverse((child) => {
      if (!child.isMesh) {
        // Collect wheel nodes for animation
        if (
          child.name === 'wheel_fl' ||
          child.name === 'wheel_fr' ||
          child.name === 'wheel_rl' ||
          child.name === 'wheel_rr'
        ) {
          wheelsRef.current.push(child);
        }
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      const matName = child.material?.name || '';
      const meshName = child.name || '';

      // Main Car Body: Dark Obsidian Metallic Graphite Paint with High Clearcoat
      if (
        matName.includes('Body_Color') ||
        meshName === 'body' ||
        matName.includes('DodgerBlue') ||
        matName.includes('Ferrari_Yellow')
      ) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#0d121c'),
          metalness: 0.9,
          roughness: 0.18,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          reflectivity: 0.95,
          envMapIntensity: 1.6,
        });
      }
      // Glass & Panoramic Windshield: Deep tinted automotive glass
      else if (matName.includes('Glass') || meshName === 'glass') {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#050811'),
          metalness: 0.9,
          roughness: 0.05,
          transmission: 0.7,
          transparent: true,
          opacity: 0.8,
          ior: 1.52,
        });
      }
      // Front LED Headlights: Crisp Ice-White / Cyan Projectors
      else if (
        matName.includes('Turn_Signal_LED') ||
        matName.includes('Projector_Glass') ||
        meshName === 'lights' ||
        meshName === 'leds'
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#e0fff5'),
          emissive: new THREE.Color('#00ff88'),
          emissiveIntensity: 2.5,
          roughness: 0.1,
          metalness: 0.8,
        });
      }
      // Rear LED Taillight Strip: Cyber Crimson / Ruby
      else if (
        matName.includes('Taillight') ||
        meshName === 'lights_red' ||
        meshName.includes('red_lights')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#ff0b37'),
          emissive: new THREE.Color('#ff0b37'),
          emissiveIntensity: 2.2,
          roughness: 0.1,
        });
      }
      // Tires: Premium Matte Rubber
      else if (matName.includes('Tires') || meshName === 'tire') {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#101317'),
          roughness: 0.88,
          metalness: 0.12,
        });
      }
      // Alloy Rims: Polished Dark Anthracite Chrome
      else if (meshName.includes('rim') || matName.includes('metal_chrome')) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#1e2634'),
          metalness: 0.94,
          roughness: 0.15,
        });
      }
      // Brake Calipers: Neon Emerald Green
      else if (meshName.includes('brake') || matName.includes('brakes')) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.8,
          metalness: 0.7,
          roughness: 0.25,
        });
      }
      // Carbon fiber / Grills / Trims
      else if (
        matName.includes('Carbon') ||
        meshName.includes('carbon') ||
        meshName.includes('grill')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#0a0c10'),
          roughness: 0.6,
          metalness: 0.4,
        });
      }
    });

    return clone;
  }, [scene, color]);

  // Frame loop for idle breathing, rotation and wheel spin
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth turntable auto-rotation
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }

    // Subtle suspension hover / breathing
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.4) * 0.02;

    // Synchronize wheel rotation
    if (wheelsRef.current.length > 0) {
      const rot = delta * 1.8;
      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.x += rot;
      });
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0, 0]}>
      {/* Base 3D Model */}
      <primitive object={clonedScene} />

      {/* ============================================================ */}
      {/* SIGNATURE FUTURISTIC NEON ACCENTS MATCHING REFERENCE IMAGE   */}
      {/* ============================================================ */}

      {/* 1. FRONT CONTINUOUS HOOD LED LIGHT BAR */}
      <mesh position={[0, 0.62, -2.16]}>
        <boxGeometry args={[1.56, 0.024, 0.04]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>

      {/* Front Light Bar Projector Glow Point Light */}
      <pointLight position={[0, 0.62, -2.25]} intensity={2.5} distance={3.5} color="#00ff88" />

      {/* 2. FRONT BUMPER C-SHAPED AIR INTAKE NEON BLADES (LEFT & RIGHT) */}
      {/* Left Intake C-Bracket Vertical */}
      <mesh position={[-0.78, 0.42, -2.12]} rotation={[0, 0.12, 0.08]}>
        <boxGeometry args={[0.025, 0.28, 0.03]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>
      {/* Left Intake C-Bracket Bottom Curve */}
      <mesh position={[-0.72, 0.28, -2.12]} rotation={[0, 0.12, -0.4]}>
        <boxGeometry args={[0.16, 0.025, 0.03]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>
      {/* Left Intake C-Bracket Top Curve */}
      <mesh position={[-0.74, 0.55, -2.12]} rotation={[0, 0.12, 0.3]}>
        <boxGeometry args={[0.12, 0.022, 0.03]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>

      {/* Right Intake C-Bracket Vertical */}
      <mesh position={[0.78, 0.42, -2.12]} rotation={[0, -0.12, -0.08]}>
        <boxGeometry args={[0.025, 0.28, 0.03]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>
      {/* Right Intake C-Bracket Bottom Curve */}
      <mesh position={[0.72, 0.28, -2.12]} rotation={[0, -0.12, 0.4]}>
        <boxGeometry args={[0.16, 0.025, 0.03]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>
      {/* Right Intake C-Bracket Top Curve */}
      <mesh position={[0.74, 0.55, -2.12]} rotation={[0, -0.12, -0.3]}>
        <boxGeometry args={[0.12, 0.022, 0.03]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>

      {/* 3. LOWER FRONT CHIN SPLITTER NEON LIP */}
      <mesh position={[0, 0.21, -2.18]}>
        <boxGeometry args={[1.32, 0.018, 0.03]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>

      {/* 4. SIDE SKIRT ROCKER PANEL NEON LIGHT BARS */}
      {/* Left Side Skirt Neon Bar */}
      <mesh position={[-0.88, 0.23, 0.15]}>
        <boxGeometry args={[0.03, 0.028, 2.2]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
      {/* Left Side Skirt Rear Upward Flick */}
      <mesh position={[-0.88, 0.27, 1.28]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.025, 0.15]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>

      {/* Right Side Skirt Neon Bar */}
      <mesh position={[0.88, 0.23, 0.15]}>
        <boxGeometry args={[0.03, 0.028, 2.2]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
      {/* Right Side Skirt Rear Upward Flick */}
      <mesh position={[0.88, 0.27, 1.28]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.025, 0.15]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>

      {/* 5. SIDE MIRROR NEON INDICATOR BLADES */}
      {/* Left Mirror Indicator */}
      <mesh position={[-0.94, 0.84, -0.58]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.14, 0.016, 0.02]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>
      {/* Right Mirror Indicator */}
      <mesh position={[0.94, 0.84, -0.58]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.14, 0.016, 0.02]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>

      {/* 6. AERODYNAMIC NEON RIM ACCENT RINGS */}
      {/* Front-Left Wheel Rim Neon Accent */}
      <mesh position={[-0.85, 0.358, -1.155]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.26, 0.014, 16, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Front-Right Wheel Rim Neon Accent */}
      <mesh position={[0.85, 0.358, -1.155]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.26, 0.014, 16, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Rear-Left Wheel Rim Neon Accent */}
      <mesh position={[-0.85, 0.358, 1.496]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.27, 0.014, 16, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Rear-Right Wheel Rim Neon Accent */}
      <mesh position={[0.85, 0.358, 1.496]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.27, 0.014, 16, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* 7. CHASSIS NEON UNDERGLOW POOL */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 4.4]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight position={[0, 0.15, 0]} intensity={4.5} distance={5} color="#00ff88" />
    </group>
  );
};

// Preload the GLB model for instantaneous rendering
useGLTF.preload('/models/car.glb');

export default RealisticCar3D;
