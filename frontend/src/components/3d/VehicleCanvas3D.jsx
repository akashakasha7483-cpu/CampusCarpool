import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows, Html } from '@react-three/drei';
import RealisticCar3D from './RealisticCar3D';
import CyberCar3D from './CyberCar3D';
import CyberBike3D from './CyberBike3D';
import CyberScooter3D from './CyberScooter3D';
import NeonLightTrails from './NeonLightTrails';
import { Car, AlertCircle, RefreshCw } from '../Icons';

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
          background: 'rgba(8, 13, 24, 0.88)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: '16px',
          padding: '16px 24px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(16, 185, 129, 0.2)',
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
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
          }}
        >
          INITIALIZING 3D SMART CAR...
        </span>
      </div>
    </Html>
  );
}

/**
 * Error Boundary Fallback for WebGL / Model Loading
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
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(8, 13, 24, 0.95) 70%)',
        borderRadius: '20px',
        border: '1px solid rgba(52, 211, 153, 0.25)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color || '#10b981',
          marginBottom: '1rem',
          boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)',
        }}
      >
        <Car size={42} strokeWidth={2} />
      </div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
        Smart Electric {type || 'Vehicle'}
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '340px' }}>
        Interactive 3D mobility active &bull; Low carbon campus transport &bull; Verified student rides
      </p>
    </div>
  );
}

export const VehicleCanvas3D = ({
  vehicleType = 'Car',
  color = '#10b981',
  autoRotate = true,
  interactive = true,
  cameraDistance = 5.2,
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

  // Compute responsive vehicle scale and camera position
  const isMobile = screenWidth < 768;
  const responsiveScale = isMobile ? 0.76 : 0.92;
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
        background: 'radial-gradient(circle at 50% 45%, #0d1527 0%, #070c17 65%, #050811 100%)',
        border: '1px solid rgba(16, 185, 129, 0.22)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.1)',
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [responsiveCamDistance * 0.72, 1.9, responsiveCamDistance * 0.9],
          fov: 44,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Dark Studio Environment Lights */}
        <ambientLight intensity={0.7} color="#cbd5e1" />

        {/* Studio Key Light: White Crisp Highlights on Car Body */}
        <directionalLight
          position={[6, 9, 6]}
          intensity={2.4}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Soft Cool Fill Light */}
        <directionalLight position={[-6, 4, -4]} intensity={1.3} color="#93c5fd" />

        {/* Signature Emerald Studio Rim Light (matching reference image) */}
        <directionalLight position={[0, 6, -7]} intensity={3.0} color="#00ff88" />

        {/* Front Projector Fill */}
        <directionalLight position={[0, 1.5, 6]} intensity={1.1} color="#6ee7b7" />

        {/* Dynamic Glowing Neon Light Trails (matching reference) */}
        {vehicleType === 'Car' && <NeonLightTrails color="#00ff88" />}

        {/* Floating atmospheric cyber particles */}
        <Sparkles count={38} scale={7} size={2.2} speed={0.35} color="#00ff88" opacity={0.65} />

        {/* Wet Reflective Dark Studio Floor */}
        <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[9, 64]} />
          <meshStandardMaterial
            color="#070c16"
            roughness={0.22}
            metalness={0.82}
          />
        </mesh>

        {/* Realistic Soft Contact Shadows beneath car */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.8}
          scale={7.5}
          blur={1.8}
          far={3.5}
          color="#03060c"
        />

        {/* Orbit Controls with Damping for Smooth Mouse Drag Rotation */}
        {interactive && (
          <OrbitControls
            enableZoom={true}
            minDistance={2.8}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 2 - 0.04} // Keep above floor
            minPolarAngle={0.15}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.06}
            rotateSpeed={0.85}
          />
        )}

        {/* Progressive Loading Fallback */}
        <Suspense fallback={<LoadingVehicleSpinner />}>
          <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.12}>
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
            background: 'rgba(8, 13, 24, 0.85)',
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
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
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

      {/* Futuristic Vehicle Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '18px',
          background: 'rgba(8, 13, 24, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '0.7rem',
          color: '#94a3b8',
          fontWeight: 700,
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
