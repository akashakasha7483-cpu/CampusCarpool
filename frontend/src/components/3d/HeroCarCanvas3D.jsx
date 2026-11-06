import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles, Html } from '@react-three/drei';
import { FuturisticHeroCar } from './FuturisticHeroCar';
import { AnimatedRoadHorizon } from './AnimatedRoadHorizon';
import { Car, RefreshCw } from '../Icons';

/**
 * Loading fallback inside Three.js canvas
 */
function HeroCanvasLoader() {
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(7, 11, 20, 0.92)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          borderRadius: '16px',
          padding: '18px 28px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.25)',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3B82F6',
            borderRadius: '50%',
            animation: 'heroSpin 0.75s linear infinite',
          }}
        />
        <style>
          {`@keyframes heroSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <span
          style={{
            color: '#93C5FD',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          STREAMING 3D MOBILITY ASSETS...
        </span>
      </div>
    </Html>
  );
}

/**
 * WebGL Fallback Card when WebGL is unavailable or fails
 */
function WebGLHeroFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, #070B14 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '24px',
        padding: '32px',
        textAlign: 'center',
        color: '#94A3B8',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: '#38BDF8',
        }}
      >
        <Car size={32} />
      </div>
      <h3 style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
        CampusCarpool Cyber Cruiser
      </h3>
      <p style={{ maxWidth: '360px', fontSize: '0.88rem', lineHeight: 1.5, color: '#94A3B8' }}>
        Intelligent campus corridor ride matching with real-time transit telemetry.
      </p>
      <div
        style={{
          marginTop: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#38BDF8',
          fontSize: '0.78rem',
          fontWeight: 600,
        }}
      >
        <span>•</span> Hardware Acceleration Recommended
      </div>
    </div>
  );
}

/**
 * HeroCarCanvas3D
 * Dedicated interactive 3D hero showcase
 */
export default function HeroCarCanvas3D({
  className = '',
  height = '500px',
  speed = 10,
}) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [controlsKey, setControlsKey] = useState(0);
  const controlsRef = useRef();

  useEffect(() => {
    // 1. Verify WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }

    // 2. Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    } else {
      setControlsKey((k) => k + 1);
    }
  };

  if (!hasWebGL) {
    return (
      <div className={className} style={{ width: '100%', height }}>
        <WebGLHeroFallback />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 35%, rgba(15, 23, 42, 0.95) 0%, #070B14 100%)',
        border: '1px solid rgba(59, 130, 246, 0.18)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(59, 130, 246, 0.05)',
      }}
    >
      <Canvas
        key={controlsKey}
        camera={{ position: [3.8, 1.8, 4.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Scene Fog for depth falloff */}
        <fog attach="fog" args={['#070B14', 12, 38]} />

        {/* Cinematic Multi-point + Metallic Facet Lighting */}
        <ambientLight intensity={1.15} color="#1E293B" />
        {/* Key Light: Electric Blue */}
        <directionalLight
          position={[6, 7, 5]}
          intensity={2.6}
          color="#60A5FA"
          castShadow
        />
        {/* Front 3/4 Metallic Fill Light */}
        <directionalLight
          position={[2.5, 4, 4.2]}
          intensity={2.2}
          color="#93C5FD"
        />
        {/* Top/Rear Rim Light: Neon Violet */}
        <directionalLight
          position={[-5, 6, -4]}
          intensity={2.8}
          color="#C084FC"
        />
        {/* Front Nose Projector Fill: Ice Cyan */}
        <pointLight position={[0, 1.8, 3.8]} intensity={1.6} color="#E0F2FE" />
        {/* Underbody Ground Neon Bounce */}
        <pointLight position={[0, -0.2, 0]} intensity={2.2} color="#3B82F6" distance={6} />

        {/* Atmospheric Floating Sparkles */}
        {!reducedMotion && (
          <Sparkles
            count={32}
            scale={12}
            size={2.2}
            speed={0.35}
            opacity={0.3}
            color="#38BDF8"
          />
        )}

        <Suspense fallback={<HeroCanvasLoader />}>
          {/* Procedural Cyber Mobility Cruiser */}
          <FuturisticHeroCar
            primaryNeon="#3B82F6"
            secondaryNeon="#8B5CF6"
            headlightColor="#E0F2FE"
          />

          {/* Infinite Animated Cyber Road Horizon */}
          <AnimatedRoadHorizon
            speed={reducedMotion ? 0 : speed}
            primaryColor="#3B82F6"
            accentColor="#8B5CF6"
            reducedMotion={reducedMotion}
          />

          {/* Ground Soft Contact Shadow */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.7}
            scale={12}
            blur={2.4}
            far={4}
            color="#000000"
          />
        </Suspense>

        {/* Constrained Smooth Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.65}
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 - 0.04}
        />
      </Canvas>

      {/* Floating HUD Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'rgba(7, 11, 20, 0.75)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            backdropFilter: 'blur(10px)',
            color: '#93C5FD',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 8px #38BDF8',
              display: 'inline-block',
            }}
          />
          INTERACTIVE 3D • DRAG TO ROTATE
        </div>

        <button
          type="button"
          onClick={resetView}
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'rgba(7, 11, 20, 0.75)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            backdropFilter: 'blur(10px)',
            color: '#CBD5E1',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title="Reset camera position"
        >
          <RefreshCw size={12} />
          Reset View
        </button>
      </div>
    </div>
  );
}

