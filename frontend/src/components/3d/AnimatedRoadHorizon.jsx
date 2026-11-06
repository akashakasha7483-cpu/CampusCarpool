import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AnimatedRoadHorizon
 * Procedural cyber highway for the 3D Hero canvas:
 * - Scrolling dashed lane dividers simulating forward highway velocity
 * - Sweeping curved transit route lines in electric blue & violet
 * - Holographic campus waypoint beacon pins with pulsing ground halos
 * - Dark midnight asphalt corridor with edge glow
 */
export const AnimatedRoadHorizon = ({
  speed = 10,
  primaryColor = '#3B82F6',
  accentColor = '#8B5CF6',
  reducedMotion = false,
}) => {
  const dashesGroup = useRef();
  const routeCurveRef = useRef();
  const beacon1Ref = useRef();
  const beacon2Ref = useRef();
  const halo1Ref = useRef();
  const halo2Ref = useRef();

  // 1. Procedural Dashed Lane Markers (Z: -25 to +15)
  const dashCount = 18;
  const dashSpacing = 2.4;
  const totalSpan = dashCount * dashSpacing;

  const dashes = useMemo(() => {
    return Array.from({ length: dashCount }, (_, i) => ({
      id: i,
      baseZ: -25 + i * dashSpacing,
    }));
  }, [dashCount, dashSpacing]);

  // 2. Sweeping Route Lines (Curving GPS Transit Corridor)
  const { routeCurve, routeCurve2 } = useMemo(() => {
    const points1 = [
      new THREE.Vector3(-1.8, 0.05, 12),
      new THREE.Vector3(-1.4, 0.08, 4),
      new THREE.Vector3(-0.6, 0.12, -4),
      new THREE.Vector3(1.2, 0.22, -12),
      new THREE.Vector3(2.5, 0.45, -20),
      new THREE.Vector3(3.8, 0.9, -28),
    ];
    const curve1 = new THREE.CatmullRomCurve3(points1, false, 'centripetal', 0.5);

    const points2 = [
      new THREE.Vector3(1.8, 0.05, 10),
      new THREE.Vector3(1.5, 0.08, 3),
      new THREE.Vector3(0.8, 0.1, -5),
      new THREE.Vector3(-0.8, 0.2, -13),
      new THREE.Vector3(-1.8, 0.5, -22),
      new THREE.Vector3(-2.6, 1.0, -30),
    ];
    const curve2 = new THREE.CatmullRomCurve3(points2, false, 'centripetal', 0.5);

    return { routeCurve: curve1, routeCurve2: curve2 };
  }, []);

  // Frame animation loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Scroll dashes if motion is enabled
    if (!reducedMotion && dashesGroup.current) {
      dashesGroup.current.children.forEach((child) => {
        child.position.z -= delta * speed;
        if (child.position.z < -28) {
          child.position.z += totalSpan;
        }
      });
    }

    // 2. Shimmer & flow along route curves
    if (routeCurveRef.current) {
      routeCurveRef.current.material.opacity = 0.65 + Math.sin(t * 3) * 0.15;
    }

    // 3. Floating Beacon Pins animation (gentle hover & rotation)
    if (beacon1Ref.current) {
      beacon1Ref.current.position.y = 1.25 + Math.sin(t * 2.5) * 0.12;
      beacon1Ref.current.rotation.y = t * 1.2;
    }
    if (beacon2Ref.current) {
      beacon2Ref.current.position.y = 1.45 + Math.cos(t * 2.2) * 0.12;
      beacon2Ref.current.rotation.y = -t * 1.4;
    }

    // 4. Pulsing ground halo rings
    if (halo1Ref.current) {
      const s1 = 1 + (Math.sin(t * 3) * 0.5 + 0.5) * 0.45;
      halo1Ref.current.scale.set(s1, s1, s1);
      halo1Ref.current.material.opacity = 0.55 - (s1 - 1) * 0.6;
    }
    if (halo2Ref.current) {
      const s2 = 1 + (Math.cos(t * 3.2) * 0.5 + 0.5) * 0.45;
      halo2Ref.current.scale.set(s2, s2, s2);
      halo2Ref.current.material.opacity = 0.55 - (s2 - 1) * 0.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- A0. INFINITE DARK GROUND FLOOR & SUBTLE CYBER GRID --- */}
      <mesh position={[0, -0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial
          color="#070B14"
          roughness={0.92}
          metalness={0.15}
        />
      </mesh>
      <gridHelper args={[60, 36, '#1E293B', '#0A101D']} position={[0, -0.02, 0]} />

      {/* --- A. MAIN HIGHWAY ASPHALT SURFACE --- */}
      <mesh position={[0, -0.01, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.2, 70]} />
        <meshStandardMaterial
          color="#060A13"
          roughness={0.75}
          metalness={0.3}
        />
      </mesh>

      {/* --- B. HIGHWAY SIDE SHOULDER GLOW STRIPS --- */}
      {/* Left glowing border */}
      <mesh position={[-3.6, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 70]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Right glowing border */}
      <mesh position={[3.6, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 70]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* --- C. PROCEDURAL SCROLLING DASHED CENTER LINE --- */}
      <group ref={dashesGroup}>
        {dashes.map((d) => (
          <mesh
            key={d.id}
            position={[0, 0.015, d.baseZ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.18, 1.4]} />
            <meshBasicMaterial
              color="#38BDF8"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* --- D. GLOWING ROUTE TRAJECTORY TUBES --- */}
      {/* Primary Route Line (Electric Blue) */}
      <mesh ref={routeCurveRef}>
        <tubeGeometry args={[routeCurve, 70, 0.035, 8, false]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Outer Soft Halo Sleeve */}
      <mesh>
        <tubeGeometry args={[routeCurve, 50, 0.09, 8, false]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary Feeder Route Line (Neon Violet) */}
      <mesh>
        <tubeGeometry args={[routeCurve2, 70, 0.03, 8, false]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <tubeGeometry args={[routeCurve2, 50, 0.08, 8, false]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* --- E. HOLOGRAPHIC WAYPOINT BEACON 1 (CAMPUS GATEWAY) --- */}
      <group position={[2.5, 0, -18]}>
        {/* Floating Inverted Crystal Pin */}
        <mesh ref={beacon1Ref} position={[0, 1.3, 0]}>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive={primaryColor}
            emissiveIntensity={0.8}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>
        {/* Ground Pulse Halo */}
        <mesh
          ref={halo1Ref}
          position={[0, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.4, 0.52, 32]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Ground Beacon Anchor Disc */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.16, 24]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* --- F. HOLOGRAPHIC WAYPOINT BEACON 2 (TRANSIT HUB) --- */}
      <group position={[-2.2, 0, -12]}>
        {/* Floating Inverted Crystal Pin */}
        <mesh ref={beacon2Ref} position={[0, 1.45, 0]}>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial
            color="#A78BFA"
            emissive={accentColor}
            emissiveIntensity={0.8}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>
        {/* Ground Pulse Halo */}
        <mesh
          ref={halo2Ref}
          position={[0, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.35, 0.46, 32]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Ground Beacon Anchor Disc */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.14, 24]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};

