import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * NeonLightTrails
 * Futuristic emerald light trails curving around the vehicle,
 * matching the signature visual flow from the reference image.
 */
export const NeonLightTrails = ({ color = '#00ff88' }) => {
  const trailGroupRef = useRef();

  // Create sweeping 3D arc trail curving up behind the car
  const { ribbonCurve, groundCircuit } = useMemo(() => {
    // Dynamic sweeping curve that wraps around the car and arcs upward
    const ribbonPoints = [
      new THREE.Vector3(-3.2, 0.08, 0.8),
      new THREE.Vector3(-2.8, 0.12, -1.6),
      new THREE.Vector3(-1.6, 0.2, -2.8),
      new THREE.Vector3(0.4, 0.35, -3.3),
      new THREE.Vector3(2.4, 0.65, -2.6),
      new THREE.Vector3(3.1, 1.2, -0.6),
      new THREE.Vector3(2.6, 1.7, 1.8),
      new THREE.Vector3(1.2, 2.2, 2.9),
      new THREE.Vector3(-0.6, 2.5, 2.7),
      new THREE.Vector3(-2.0, 2.6, 1.8),
    ];
    const ribbonCurve = new THREE.CatmullRomCurve3(ribbonPoints, false, 'centripetal', 0.5);

    // Floor neon circuit ring on wet pavement
    const floorPoints = [
      new THREE.Vector3(-2.4, 0.03, 0.0),
      new THREE.Vector3(-1.9, 0.03, -2.4),
      new THREE.Vector3(0.0, 0.03, -3.1),
      new THREE.Vector3(1.9, 0.03, -2.4),
      new THREE.Vector3(2.4, 0.03, 0.0),
      new THREE.Vector3(1.9, 0.03, 2.4),
      new THREE.Vector3(0.0, 0.03, 3.1),
      new THREE.Vector3(-1.9, 0.03, 2.4),
    ];
    const groundCircuit = new THREE.CatmullRomCurve3(floorPoints, true, 'centripetal', 0.5);

    return { ribbonCurve, groundCircuit };
  }, []);

  useFrame((state) => {
    if (!trailGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle floating shimmer
    trailGroupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group ref={trailGroupRef}>
      {/* Dynamic 3D Sweeping Ribbon Trail */}
      <mesh>
        <tubeGeometry args={[ribbonCurve, 100, 0.03, 8, false]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ribbon Outer Soft Glow Sleeve */}
      <mesh>
        <tubeGeometry args={[ribbonCurve, 80, 0.075, 8, false]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floor Neon Pavement Ring */}
      <mesh>
        <tubeGeometry args={[groundCircuit, 90, 0.02, 6, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floor Glow Halo */}
      <mesh>
        <tubeGeometry args={[groundCircuit, 70, 0.06, 6, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default NeonLightTrails;
