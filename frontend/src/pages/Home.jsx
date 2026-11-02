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
} from '../components/Icons';
import { api } from '../api/client';
import RideCard from '../components/RideCard';
import RequestModal from '../components/RequestModal';
import { useAuth } from '../context/AuthContext';

const Home = () => {
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
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 90 }}>
          <ShieldCheck size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(16, 185, 129, 0.15), transparent 50%), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          marginBottom: '3rem',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: '#34d399',
              padding: '0.35rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={15} />
            <span>Academic Capstone &bull; AKASH M R (2102508522)</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            Intelligent Student Carpooling Along <span style={{ color: '#34d399' }}>Similar Routes</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '700px',
              margin: '0 auto 2.5rem',
            }}
          >
            Connect with campus commuters travelling your way. Cut daily travel costs, find instant compatible rides
            via approximate route matching, and share empty seats safely.
          </p>

          {/* Quick Search Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25)',
              textAlign: 'left',
              color: '#0f172a',
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto',
                  gap: '1rem',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} color="#10b981" />
                    Pickup / From
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Silk Board, Electronic City"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} color="#1e3a8a" />
                    Drop-off / To
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Campus Main Gate, Tech Block"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: '48px', width: '100%', padding: '0 1.75rem' }}
                  >
                    <Search size={18} />
                    Find Compatible Rides
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Built Specifically For College Commuters
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Solving uncoordinated travel with intelligent algorithmic matchmaking
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Intelligent Route Matching
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Uses token-based and bi-gram dice proximity algorithms to identify compatible intermediate pickups,
              waypoints, and travel time windows.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Atomic Overbooking Control
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Database-level atomic find-and-modify operations prevent duplicate requests and seat overbooking,
              safely decrementing available seats upon confirmation.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Student-to-Student Trust
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Registered students with roll numbers, departments, vehicle details, and community ratings for
              peace of mind on every commute.
            </p>
          </div>
        </div>
      </section>

      {/* Available Rides Showcase */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Active Upcoming Rides</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Browse recently posted student rides with available capacity
            </p>
          </div>
          <Link to="/find-rides" className="btn btn-secondary">
            View All Rides <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
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
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: '#ffffff',
            }}
          >
            <Car size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              No Active Rides Posted Yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Be the first student to post a ride and offer spare seats along your route!
            </p>
            <Link to="/post-ride" className="btn btn-primary">
              Post Your First Ride
            </Link>
          </div>
        )}
      </section>

      {/* Request Modal */}
      {selectedRide && (
        <RequestModal
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
