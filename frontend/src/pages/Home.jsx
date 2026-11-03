import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '../components/Icons';
import { api } from '../api/client';
import RideCard from '../components/RideCard';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import VehicleCanvas3D from '../components/3d/VehicleCanvas3D';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const res = await api.getActiveRides();
        if (res.success && res.rides) {
          setRecentRides(res.rides.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load recent rides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRides();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (source.trim()) query.append('source', source.trim());
    if (destination.trim()) query.append('destination', destination.trim());
    navigate(`/find-rides?${query.toString()}`);
  };

  const handleRequestSeat = (ride) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedRide(ride);
  };

  return (
    <div>
      {/* Toast */}
      {successToast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 100 }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Cinematic 3D Hero Section */}
      <section
        style={{
          minHeight: '620px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '4rem',
          padding: '2rem 0',
        }}
      >
        {/* Left Column: Hero Typography & CTA */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#34d399',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} />
            <span>FUTURISTIC 3D SMART MOBILITY &bull; SUSTAINABLE CAMPUS TRANSIT</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#f8fafc',
              marginBottom: '1rem',
            }}
          >
            CAMPUS<span style={{ color: '#10b981' }}>CARPOOL</span>
          </h1>

          <p
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#34d399',
              marginBottom: '1.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            Move Together. Travel Smarter.
          </p>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              lineHeight: 1.7,
              marginBottom: '2rem',
              maxWidth: '520px',
            }}
          >
            Share your journey. Reduce travel costs. Connect with fellow students through intelligent approximate
            route matching and live 3D geospatial mobility.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/find-rides" className="btn btn-primary btn-lg">
              <Search size={18} />
              Explore Rides
            </Link>
            <Link to="/post-ride" className="btn btn-secondary btn-lg">
              <Car size={18} />
              Post a Ride
            </Link>
            <Link to="/route-explorer" className="btn btn-outline-green btn-lg">
              <Compass size={18} />
              3D Route Explorer
            </Link>
          </div>

          {/* Floating Metric Badges */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc' }}>100%</p>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Student Verified</span>
            </div>
            <div>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>95%</p>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Route Accuracy</span>
            </div>
            <div>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc' }}>₹0</p>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Middleman Commission</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Cyber Car */}
        <div style={{ width: '100%', position: 'relative' }}>
          <VehicleCanvas3D
            vehicleType="Car"
            color="#10b981"
            autoRotate={true}
            interactive={true}
            height="480px"
          />
        </div>
      </section>

      {/* Futuristic Route Search Bar */}
      <section style={{ marginBottom: '4rem' }}>
        <div
          className="card"
          style={{
            background: 'rgba(17, 28, 46, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.1)',
            padding: '2rem',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Instant Route & Corridor Search
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Find peer drivers traveling along your campus route, bus stand or metro stop.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr)) auto',
                gap: '1.25rem',
                alignItems: 'flex-end',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="#10b981" /> Pickup Location
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
                  <MapPin size={14} color="#38bdf8" /> Destination
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Campus Main Gate"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ height: '48px', width: '100%', padding: '0 2rem' }}
                >
                  <Search size={18} />
                  Match Rides
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Next-Gen Smart Mobility Architecture
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Intelligent algorithmic matchmaking backed by atomic database concurrency
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(52, 211, 153, 0.3)',
              }}
            >
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Intelligent Dice Matching
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Calculates bi-gram dice coefficients and token overlap to discover rides even when riders board at intermediate bus stops, metro gates, or junctions.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Geospatial 3D Map
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Vector map explorer powered by MapLibre GL JS renders animated neon route polylines, 3D camera pitches, and pickup markers with accurate coordinates.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Atomic Overbooking Control
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Database-level atomic find-and-modify queries guarantee seat availability integrity, preventing double bookings and race conditions upon confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Available Rides Showcase */}
      <section style={{ marginBottom: '4rem' }}>
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
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc' }}>
              Active Campus Rides
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Real-time student carpools with open seat capacity
            </p>
          </div>

          <Link to="/find-rides" className="btn btn-secondary">
            View All Rides <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
            Loading available rides...
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
            <Car size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              No Open Rides Found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Be the first student to publish a ride offer today!
            </p>
            <Link to="/post-ride" className="btn btn-primary">
              Post Your First Ride
            </Link>
          </div>
        )}
      </section>

      {/* Interactive Seat Picker Modal */}
      {selectedRide && (
        <InteractiveSeatPicker
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onSuccess={(msg) => {
            setSuccessToast(msg);
            setTimeout(() => setSuccessToast(''), 5000);
          }}
        />
      )}
    </div>
  );
};

export default Home;
