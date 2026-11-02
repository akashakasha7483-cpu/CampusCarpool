import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows, Html } from '@react-three/drei';
import RealisticCar3D from './RealisticCar3D';
import CyberBike3D from './CyberBike3D';
import CyberScooter3D from './CyberScooter3D';
import NeonLightTrails from './NeonLightTrails';
import { Car } from '../Icons';

/**
 * 3D Loading Fallback Component
 */
function LoadingVehicleSpinner() {
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(8, 13, 24, 0.92)',
          border: '1px solid rgba(52, 211, 153, 0.45)',
          borderRadius: '16px',
          padding: '16px 26px',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 0 35px rgba(16, 185, 129, 0.3)',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            border: '3px solid rgba(16, 185, 129, 0.25)',
            borderTopColor: '#00ff88',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <span
          style={{
            color: '#34d399',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
          }}
        >
          INITIALIZING 3D SMART MOBILITY...
        </span>
      </div>
    </Html>
  );
}

/**
 * WebGL Detection Fallback Card
 */
function FallbackVehicleCard({ type, color }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(8, 13, 24, 0.95) 70%)',
        borderRadius: '24px',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '84px',
          height: '84px',
          borderRadius: '22px',
          background: 'rgba(16, 185, 129, 0.18)',
          border: '1px solid rgba(52, 211, 153, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color || '#10b981',
          marginBottom: '1rem',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)',
        }}
      >
        <Car size={44} strokeWidth={2} />
      </div>
      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
        Smart Electric {type || 'Vehicle'}
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '360px' }}>
        Interactive 3D mobility active &bull; Shared campus transit &bull; Verified student rides
      </p>
    </div>
  );
}

export const VehicleCanvas3D = ({
  vehicleType = 'Car',
  color = '#10b981',
  autoRotate = true,
  interactive = true,
  cameraDistance = 5.0,
  height = '480px',
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Responsive screen listener
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebGL support detection
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  const isMobile = screenWidth < 768;
  const responsiveScale = isMobile ? 0.8 : 0.95;
  const responsiveCamDistance = isMobile ? cameraDistance * 1.15 : cameraDistance;

  if (!hasWebGL) {
    return <FallbackVehicleCard type={vehicleType} color={color} />;
  }

  const renderVehicle = () => {
    switch (vehicleType) {
      case 'Bike':
        return <CyberBike3D color={color} autoRotate={autoRotate} />;
      case 'Scooter':
        return <CyberScooter3D color={color} autoRotate={autoRotate} />;
      case 'Car':
      default:
        return (
          <RealisticCar3D
            color={color}
            autoRotate={autoRotate}
            interactive={interactive}
            scale={responsiveScale}
          />
        );
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 40%, #17243b 0%, #0c1526 55%, #060a14 100%)',
        border: '1px solid rgba(16, 185, 129, 0.28)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 45px rgba(16, 185, 129, 0.15)',
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [responsiveCamDistance * 0.7, 1.6, responsiveCamDistance * 0.85],
          fov: 42,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* ============================================================ */}
        {/* AUTOMOTIVE STUDIO ILLUMINATION (High visibility & contrast)  */}
        {/* ============================================================ */}

        {/* Ambient base lighting to reveal body volume */}
        <ambientLight intensity={1.8} color="#e2e8f0" />

        {/* Studio Key Light: Bright white specular glints on metallic body */}
        <directionalLight
          position={[6, 9, 6]}
          intensity={3.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Front Three-Quarter Fill Light */}
        <directionalLight position={[-6, 5, 5]} intensity={2.8} color="#bae6fd" />

        {/* Overhead Softbox Ceiling Light */}
        <directionalLight position={[0, 9, 0]} intensity={2.2} color="#ffffff" />

        {/* Signature Emerald Studio Rim Light (matching reference image) */}
        <directionalLight position={[-3, 6, -7]} intensity={4.2} color="#00ff88" />

        {/* Front Projector Ground Fill */}
        <directionalLight position={[0, 1.2, 5]} intensity={2.0} color="#6ee7b7" />

        {/* Dynamic Glowing Neon Light Trails */}
        {vehicleType === 'Car' && <NeonLightTrails color="#00ff88" />}

        {/* Floating atmospheric cyber particles */}
        <Sparkles count={42} scale={7.5} size={2.4} speed={0.35} color="#00ff88" opacity={0.7} />

        {/* Wet Reflective Dark Studio Floor */}
        <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[9.5, 64]} />
          <meshStandardMaterial
            color="#09101d"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Soft Contact Shadows beneath car */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.85}
          scale={8.0}
          blur={1.6}
          far={3.5}
          color="#020408"
        />

        {/* Orbit Controls with Smooth Damping */}
        {interactive && (
          <OrbitControls
            enableZoom={true}
            minDistance={2.6}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 2 - 0.04}
            minPolarAngle={0.15}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.06}
            rotateSpeed={0.85}
          />
        )}

        {/* Progressive Loading Fallback */}
        <Suspense fallback={<LoadingVehicleSpinner />}>
          <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.1}>
            {renderVehicle()}
          </Float>
        </Suspense>
      </Canvas>

      {/* Floating 3D Interaction Pill */}
      {interactive && (
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '18px',
            background: 'rgba(8, 13, 24, 0.88)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '0.72rem',
            color: '#34d399',
            fontWeight: 800,
            letterSpacing: '0.06em',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 10px #00ff88',
            }}
          />
          INTERACTIVE 3D &bull; DRAG TO ROTATE &bull; SCROLL TO ZOOM
        </div>
      )}

      {/* Vehicle Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '18px',
          background: 'rgba(8, 13, 24, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          padding: '4px 14px',
          fontSize: '0.72rem',
          color: '#cbd5e1',
          fontWeight: 800,
          letterSpacing: '0.04em',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ color: '#00ff88' }}>⚡</span>
        <span>CAMPUSCARPOOL 3D SMART EV</span>
      </div>
    </div>
  );
};

export default VehicleCanvas3D;
