import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import CyberCar3D from './CyberCar3D';

/**
 * RealisticCar3D - Premium Futuristic Electric Sports Car
 * Loaded from realistic GLB model with local Draco decoder,
 * custom automotive shader materials, front-left 3/4 hero perspective,
 * and glowing neon emerald accents matching the reference image.
 */
function ModelCar({ color = '#10b981', autoRotate = true, scale = 1.0 }) {
  const groupRef = useRef();

  // Load GLB with local Draco decoder path
  const { scene } = useGLTF('/models/car.glb', '/draco/');

  // Clone scene and apply high-contrast automotive materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const matName = child.material?.name || '';
      const meshName = child.name || '';

      // Main Car Body: Sleek Metallic Slate/Graphite Paint with Specular Reflections
      if (
        matName.includes('Body_Color') ||
        meshName === 'body' ||
        matName.includes('DodgerBlue') ||
        matName.includes('Ferrari_Yellow')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#223044'), // Distinct metallic slate/graphite body
          metalness: 0.72,
          roughness: 0.22,
        });
      }
      // Glass & Windshield: Deep tinted automotive glass
      else if (matName.includes('Glass') || meshName === 'glass') {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#0a1320'),
          metalness: 0.85,
          roughness: 0.08,
          transmission: 0.65,
          transparent: true,
          opacity: 0.82,
        });
      }
      // Front LED Projector Headlights
      else if (
        matName.includes('Turn_Signal_LED') ||
        matName.includes('Projector_Glass') ||
        meshName === 'lights' ||
        meshName === 'leds'
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#e0fff5'),
          emissive: new THREE.Color('#00ff88'),
          emissiveIntensity: 3.0,
          roughness: 0.1,
        });
      }
      // Rear LED Taillight Bar
      else if (
        matName.includes('Taillight') ||
        meshName === 'lights_red' ||
        meshName.includes('red_lights')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#ff0b37'),
          emissive: new THREE.Color('#ff0b37'),
          emissiveIntensity: 2.5,
          roughness: 0.1,
        });
      }
      // Tires: Premium Matte Rubber
      else if (matName.includes('Tires') || meshName === 'tire') {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#111419'),
          roughness: 0.85,
          metalness: 0.1,
        });
      }
      // Alloy Rims: Polished Chrome with dark metallic luster
      else if (meshName.includes('rim') || matName.includes('metal_chrome')) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#2a384c'),
          metalness: 0.92,
          roughness: 0.15,
        });
      }
      // Brake Calipers: Neon Emerald
      else if (meshName.includes('brake') || matName.includes('brakes')) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#00ff88'),
          emissive: new THREE.Color('#00ff88'),
          emissiveIntensity: 1.2,
          metalness: 0.6,
          roughness: 0.3,
        });
      }
      // Trims & Grills
      else if (
        matName.includes('Carbon') ||
        meshName.includes('carbon') ||
        meshName.includes('grill') ||
        matName.includes('plastic')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#0f1622'),
          roughness: 0.55,
          metalness: 0.3,
        });
      }
    });

    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth turntable rotation around front 3/4 perspective
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.25;
    }

    // Suspension breathing
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.4) * 0.02;
  });

  return (
    // Initial rotation [0, 2.2, 0] presents the front-left 3/4 hero view matching reference
    <group ref={groupRef} scale={[scale, scale, scale]} rotation={[0, 2.2, 0]} position={[0, 0, 0]}>
      {/* GLB Model Scene */}
      <primitive object={clonedScene} />

      {/* ============================================================ */}
      {/* SIGNATURE NEON EMERALD ACCENTS MATCHING REFERENCE IMAGE     */}
      {/* ============================================================ */}

      {/* 1. FRONT CONTINUOUS HOOD LED LIGHT BAR */}
      <mesh position={[0, 0.62, -2.16]}>
        <boxGeometry args={[1.56, 0.028, 0.04]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0.65, -2.25]} intensity={3.5} distance={4} color="#00ff88" />

      {/* 2. FRONT BUMPER C-SHAPED AIR INTAKE NEON BLADES */}
      {/* Left Blade */}
      <mesh position={[-0.78, 0.42, -2.12]} rotation={[0, 0.12, 0.08]}>
        <boxGeometry args={[0.028, 0.28, 0.03]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.72, 0.28, -2.12]} rotation={[0, 0.12, -0.4]}>
        <boxGeometry args={[0.16, 0.028, 0.03]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.74, 0.55, -2.12]} rotation={[0, 0.12, 0.3]}>
        <boxGeometry args={[0.12, 0.025, 0.03]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>

      {/* Right Blade */}
      <mesh position={[0.78, 0.42, -2.12]} rotation={[0, -0.12, -0.08]}>
        <boxGeometry args={[0.028, 0.28, 0.03]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.72, 0.28, -2.12]} rotation={[0, -0.12, 0.4]}>
        <boxGeometry args={[0.16, 0.028, 0.03]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.74, 0.55, -2.12]} rotation={[0, -0.12, -0.3]}>
        <boxGeometry args={[0.12, 0.025, 0.03]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>

      {/* 3. LOWER FRONT CHIN SPLITTER NEON LIP */}
      <mesh position={[0, 0.21, -2.18]}>
        <boxGeometry args={[1.34, 0.02, 0.03]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>

      {/* 4. SIDE SKIRT ROCKER PANEL NEON LIGHT BARS */}
      <mesh position={[-0.88, 0.23, 0.15]}>
        <boxGeometry args={[0.03, 0.03, 2.2]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
      <mesh position={[-0.88, 0.27, 1.28]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.028, 0.16]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>

      <mesh position={[0.88, 0.23, 0.15]}>
        <boxGeometry args={[0.03, 0.03, 2.2]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
      <mesh position={[0.88, 0.27, 1.28]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.028, 0.16]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>

      {/* 5. SIDE MIRROR INDICATOR STRIPS */}
      <mesh position={[-0.94, 0.84, -0.58]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.15, 0.018, 0.02]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.94, 0.84, -0.58]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.15, 0.018, 0.02]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>

      {/* 6. AERODYNAMIC NEON WHEEL RIM ACCENTS */}
      <mesh position={[-0.85, 0.358, -1.155]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.26, 0.016, 16, 32]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.85, 0.358, -1.155]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.26, 0.016, 16, 32]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.85, 0.358, 1.496]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.27, 0.016, 16, 32]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.85, 0.358, 1.496]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.27, 0.016, 16, 32]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>

      {/* 7. CHASSIS EMERALD UNDERGLOW */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 4.4]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.36} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight position={[0, 0.15, 0]} intensity={5.0} distance={5} color="#00ff88" />
    </group>
  );
}

// Preload GLB with local Draco path
try {
  useGLTF.preload('/models/car.glb', '/draco/');
} catch (e) {
  // Silent catch
}

/**
 * Resilient Error Boundary wrapper
 */
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('GLB load notice, using procedural high-detail cyber vehicle:', err);
  }
  render() {
    if (this.state.hasError) {
      return <CyberCar3D color={this.props.color} autoRotate={this.props.autoRotate} />;
    }
    return this.props.children;
  }
}

export const RealisticCar3D = (props) => {
  return (
    <ModelErrorBoundary color={props.color} autoRotate={props.autoRotate}>
      <ModelCar {...props} />
    </ModelErrorBoundary>
  );
};

export default RealisticCar3D;
