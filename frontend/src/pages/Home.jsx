import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Car,
  Search,
  Sparkles,
  ShieldCheck,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  Compass,
  ChevronRight,
  TrendingUp,
} from '../components/Icons';
import { api } from '../api/client';
import RideCard from '../components/RideCard';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import HeroCarCanvas3D from '../components/3d/HeroCarCanvas3D';
import { useAuth } from '../context/AuthContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Preset corridors frequently traveled by students
const QUICK_CORRIDORS = [
  { label: 'Silk Board → Campus', source: 'Silk Board', destination: 'Campus Main Gate' },
  { label: 'Whitefield → Campus', source: 'Whitefield', destination: 'Engineering Campus' },
  { label: 'Electronic City → Campus', source: 'Electronic City', destination: 'Campus Gate 2' },
  { label: 'Metro Gate → Campus', source: 'Metro Station Gate 1', destination: 'University Quad' },
];

export const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);

  // 1. Fetch live active rides
  useEffect(() => {
    let mounted = true;
    const fetchRecentRides = async () => {
      try {
        const res = await api.getActiveRides();
        if (mounted && res.success && res.rides) {
          setRecentRides(res.rides.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load recent rides:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRecentRides();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Cinematic entrance & scroll animations (respects reduced motion)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Fade in hero elements
      gsap.from('.cinematic-hero-content > *', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
      });

      // Animate step cards on scroll
      if (stepsRef.current) {
        gsap.from('.cinematic-step-card', {
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
        });
      }

      // Animate feature cards on scroll
      if (featuresRef.current) {
        gsap.from('.cinematic-feature-card', {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 82%',
          },
          opacity: 0,
          y: 28,
          duration: 0.65,
          stagger: 0.14,
          ease: 'power2.out',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (source.trim()) query.append('source', source.trim());
    if (destination.trim()) query.append('destination', destination.trim());
    navigate(`/find-rides?${query.toString()}`);
  };

  const handleApplyPreset = (corridor) => {
    setSource(corridor.source);
    setDestination(corridor.destination);
  };

  const handleRequestSeat = (ride) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedRide(ride);
  };

  return (
    <div className="home-cinematic-wrapper" style={{ paddingBottom: '5rem' }}>
      {/* Toast Notification */}
      {successToast && (
        <div
          className="alert alert-success"
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            maxWidth: '420px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. CINEMATIC 3D HERO SECTION                                 */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        style={{
          minHeight: '580px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          padding: '2rem 0 3rem',
        }}
      >
        {/* Left Column: Hero Narrative, CTAs & Live Trust Badges */}
        <div className="cinematic-hero-content">
          {/* Sub-badge pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60A5FA',
              padding: '0.4rem 0.95rem',
              borderRadius: '999px',
              fontSize: 'clamp(0.68rem, 2vw, 0.76rem)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
              maxWidth: '100%',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sparkles size={14} color="#8B5CF6" style={{ flexShrink: 0 }} />
            <span>3D SMART MOBILITY • VERIFIED ACADEMIC TRANSIT</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.6rem, 5.8vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#F8FAFC',
              marginBottom: '0.75rem',
            }}
          >
            CAMPUS
            <span
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                marginLeft: '0.15rem',
              }}
            >
              CARPOOL
            </span>
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)',
              fontWeight: 700,
              color: '#93C5FD',
              marginBottom: '1.25rem',
              letterSpacing: '-0.015em',
            }}
          >
            Intelligent Corridor Mobility for University Students
          </p>

          {/* Description */}
          <p
            style={{
              fontSize: '1.02rem',
              color: '#94A3B8',
              lineHeight: 1.7,
              marginBottom: '2.25rem',
              maxWidth: '540px',
            }}
          >
            Share your daily university commute. Slash fuel costs by up to 70%. Connect with verified classmates
            through intelligent approximate route matching and interactive 3D vehicle visualization.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            <Link to="/find-rides" className="btn btn-primary btn-lg">
              <Search size={18} />
              Explore Rides
            </Link>
            <Link to="/post-ride" className="btn btn-secondary btn-lg">
              <Car size={18} />
              Host a Ride
            </Link>
            <Link to="/route-explorer" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.4)' }}>
              <Compass size={18} color="#38BDF8" />
              3D Map
            </Link>
          </div>

          {/* Live Trust Metrics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(59, 130, 246, 0.18)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#F8FAFC' }}>100%</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>Student Verified</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <Zap size={16} color="#38BDF8" />
                <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#60A5FA' }}>95%</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>Corridor Match</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#F8FAFC' }}>₹0</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>Platform Cut</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Cyber Car Showcase */}
        <div style={{ width: '100%', position: 'relative' }}>
          <HeroCarCanvas3D height="clamp(380px, 48vh, 520px)" speed={10} />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ELEVATED CORRIDOR SEARCH CONSOLE WITH PRESETS            */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div
          className="card"
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 11, 20, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.28)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.1)',
            padding: '2.25rem',
            borderRadius: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <TrendingUp size={18} color="#38BDF8" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  Instant Corridor & Route Search
                </h3>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0 }}>
                Discover classmate drivers traveling along your campus route, bus junction, or metro station.
              </p>
            </div>

            {/* Quick Route Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Frequent Corridors:</span>
              {QUICK_CORRIDORS.map((corridor) => (
                <button
                  key={corridor.label}
                  type="button"
                  onClick={() => handleApplyPreset(corridor)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#93C5FD',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)';
                  }}
                >
                  {corridor.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr)) auto',
                gap: '1.25rem',
                alignItems: 'flex-end',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} color="#38BDF8" /> Pickup Location / Junction
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Silk Board, Electronic City, HSR"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} color="#C084FC" /> Destination Campus / Gate
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Campus Main Gate, Engineering Block"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    height: '48px',
                    width: '100%',
                    padding: '0 2.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  <Search size={18} />
                  Match Rides
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CINEMATIC 3-STEP CORRIDOR STORYTELLING                    */}
      {/* ============================================================ */}
      <section ref={stepsRef} style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#38BDF8',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            <span>•</span> HOW CAMPUSCARPOOL OPERATES <span>•</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Commuting Together in Three Intuitive Steps
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Zero middleman markups. Guaranteed seat locking with atomic concurrency control.
          </p>
        </div>

        <div className="cinematic-steps-grid">
          {/* Step 01 */}
          <div
            className="card cinematic-step-card"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(59, 130, 246, 0.22)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1.25rem',
                fontSize: '3.5rem',
                fontWeight: 900,
                color: 'rgba(59, 130, 246, 0.1)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              01
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60A5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(59, 130, 246, 0.35)',
              }}
            >
              <Search size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Discover Shared Corridors
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65 }}>
              Enter your pickup stop. Our intelligent Dice string coefficient automatically pairs you with drivers
              passing through your intermediate junction even if spelling differs slightly.
            </p>
          </div>

          {/* Step 02 */}
          <div
            className="card cinematic-step-card"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(139, 92, 246, 0.22)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1.25rem',
                fontSize: '3.5rem',
                fontWeight: 900,
                color: 'rgba(139, 92, 246, 0.1)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              02
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#C084FC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(139, 92, 246, 0.35)',
              }}
            >
              <Car size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Atomic Seat Reservation
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65 }}>
              Choose your exact seat inside the interactive vehicle cabin. Database-level atomic transactions guarantee
              no double-bookings or race conditions when multiple riders reserve concurrently.
            </p>
          </div>

          {/* Step 03 */}
          <div
            className="card cinematic-step-card"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(16, 185, 129, 0.22)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1.25rem',
                fontSize: '3.5rem',
                fontWeight: 900,
                color: 'rgba(16, 185, 129, 0.1)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              03
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(16, 185, 129, 0.35)',
              }}
            >
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Split Fuel & Commute Greener
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65 }}>
              Meet at your campus designated pickup point, share fuel expenses directly without corporate cuts, and
              reach lectures relaxed and on schedule.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SMART MOBILITY ARCHITECTURE FEATURE GRID                  */}
      {/* ============================================================ */}
      <section ref={featuresRef} style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Next-Gen Smart Mobility Architecture
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Intelligent algorithmic matchmaking backed by atomic database concurrency
          </p>
        </div>

        <div className="cinematic-features-grid">
          <div className="card cinematic-feature-card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60A5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(59, 130, 246, 0.35)',
              }}
            >
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Intelligent Dice Matching
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Calculates bi-gram dice coefficients and token overlap to discover rides even when riders board at intermediate bus stops, metro gates, or junctions.
            </p>
          </div>

          <div className="card cinematic-feature-card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#C084FC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(139, 92, 246, 0.35)',
              }}
            >
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Geospatial 3D Map
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Vector map explorer powered by MapLibre GL JS renders animated neon route polylines, 3D camera pitches, and pickup markers with accurate coordinates.
            </p>
          </div>

          <div className="card cinematic-feature-card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(16, 185, 129, 0.35)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Atomic Overbooking Control
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Database-level atomic find-and-modify queries guarantee seat availability integrity, preventing double bookings and race conditions upon confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ACTIVE CAMPUS RIDES SHOWCASE                              */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#F8FAFC' }}>
              Active Campus Rides
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Real-time student carpools with open seat capacity
            </p>
          </div>

          <Link to="/find-rides" className="btn btn-secondary">
            View All Rides <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 0', color: '#94A3B8' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(59, 130, 246, 0.2)',
                borderTopColor: '#3B82F6',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Streaming live campus rides...</span>
          </div>
        ) : recentRides.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {recentRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                onRequestSeat={handleRequestSeat}
                isCurrentUserDriver={user?._id === ride.driver?._id}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <Car size={44} color="#64748B" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              No Open Rides Found Right Now
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Be the first student to publish a ride offer today!
            </p>
            <Link to="/post-ride" className="btn btn-primary">
              Post Your First Ride
            </Link>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 6. HIGH-IMPACT CINEMATIC CTA FOOTER BANNER                  */}
      {/* ============================================================ */}
      <section>
        <div
          className="card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.18) 0%, rgba(15, 23, 42, 0.95) 75%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '28px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.12)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#38BDF8',
              fontSize: '0.76rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={13} />
            <span>CAMPUS MOBILITY REINVENTED</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
              fontWeight: 900,
              color: '#F8FAFC',
              marginBottom: '1rem',
              letterSpacing: '-0.025em',
            }}
          >
            Ready to Upgrade Your Daily Campus Commute?
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#94A3B8',
              maxWidth: '600px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.65,
            }}
          >
            Join verified students and faculty saving hours, cutting travel expenses, and moving cleanly along university corridors.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/register" className="btn btn-primary btn-lg">
              <Zap size={18} />
              Register with University Email
            </Link>
            <Link to="/find-rides" className="btn btn-secondary btn-lg">
              <Search size={18} />
              Browse Active Routes
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* INTERACTIVE SEAT PICKER MODAL (PRESERVED FUNCTIONALITY)     */}
      {/* ============================================================ */}
      {selectedRide && (
        <InteractiveSeatPicker
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onSuccess={(msg, bookedRideId, seatsBooked) => {
            setSuccessToast(msg);
            if (bookedRideId && seatsBooked) {
              setRecentRides((prev) =>
                prev.map((r) =>
                  r._id === bookedRideId
                    ? {
                        ...r,
                        availableSeats: Math.max(0, (r.availableSeats || 0) - seatsBooked),
                      }
                    : r
                )
              );
            }
            setTimeout(() => setSuccessToast(''), 5000);
          }}
        />
      )}
    </div>
  );
};

export default Home;
