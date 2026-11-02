import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import CyberCar3D from './CyberCar3D';
import CyberBike3D from './CyberBike3D';
import CyberScooter3D from './CyberScooter3D';
import { Car, AlertCircle, RefreshCw } from '../Icons';

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
        Cyber {type || 'Vehicle'} System
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '340px' }}>
        Smart electric student mobility preview &bull; Zero emissions &bull; Shared campus transit
      </p>
    </div>
  );
}

export const VehicleCanvas3D = ({
  vehicleType = 'Car',
  color = '#10b981',
  autoRotate = true,
  interactive = true,
  cameraDistance = 5,
  height = '420px',
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

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
        return <CyberCar3D color={color} autoRotate={autoRotate} interactive={interactive} />;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, rgba(8, 13, 24, 0.95) 75%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
      }}
    >
      <Canvas
        camera={{ position: [cameraDistance * 0.7, 2.0, cameraDistance], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Studio Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 8, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-6, 4, -4]} intensity={1.5} color="#34d399" />
        <pointLight position={[0, -0.5, 0]} intensity={3} color={color} distance={4} />

        {/* Floating cyber particles */}
        <Sparkles count={40} scale={6} size={2.5} speed={0.4} color={color} opacity={0.6} />

        {/* Orbit Controls */}
        {interactive && (
          <OrbitControls
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below ground
            minPolarAngle={0.2}
            enablePan={false}
          />
        )}

        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
            {renderVehicle()}
          </Float>
        </Suspense>
      </Canvas>

      {/* Floating 3D Interaction Pill */}
      {interactive && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            background: 'rgba(8, 13, 24, 0.8)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '0.72rem',
            color: '#34d399',
            fontWeight: 700,
            letterSpacing: '0.04em',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          INTERACTIVE 3D &bull; DRAG TO ROTATE
        </div>
      )}
    </div>
  );
};

export default VehicleCanvas3D;
