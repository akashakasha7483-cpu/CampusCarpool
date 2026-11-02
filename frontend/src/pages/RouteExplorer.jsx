import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from '../components/Icons';
import { api } from '../api/client';
import RouteMap3D from '../components/map/RouteMap3D';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import CompatibilityBadge from '../components/CompatibilityBadge';
import { useAuth } from '../context/AuthContext';

export const RouteExplorer = () => {
  const [searchParams] = useSearchParams();
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingRide, setBookingRide] = useState(null);
  const [toast, setToast] = useState('');

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const queryParams = {
          source: searchParams.get('source') || '',
          destination: searchParams.get('destination') || '',
        };
        const res = await api.searchRides(queryParams);
        if (res.success && res.rides) {
          setRides(res.rides);
          if (res.rides.length > 0) {
            setSelectedRide(res.rides[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching route explorer rides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [searchParams]);

  return (
    <div>
      {toast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 100 }}>
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '0.5rem',
          }}
        >
          <Compass size={14} />
          GEOSPATIAL 3D SMART MOBILITY
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Interactive 3D Route Explorer
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Visualize dynamic campus travel corridors, intermediate bus & metro pickups, and real-time route geometry.
        </p>
      </div>

      {/* Main Grid: Left Ride Selector / Right 3D Map */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Route List & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '720px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
              AVAILABLE CAMPUS CORRIDORS ({rides.length})
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
              Loading geospatial route data...
            </div>
          ) : rides.length > 0 ? (
            rides.map((ride) => {
              const isSelected = selectedRide?._id === ride._id;
              return (
                <div
                  key={ride._id}
                  onClick={() => setSelectedRide(ride)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: isSelected ? 'rgba(17, 28, 46, 0.95)' : 'rgba(15, 23, 42, 0.65)',
                    border: isSelected
                      ? '1.5px solid #10b981'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none',
                    transition: 'all 0.25s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#34d399',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {ride.vehicleType || 'Car'} &bull; {ride.driver?.name || 'Fellow Student'}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                        {ride.source} &rarr; {ride.destination}
                      </h4>
                    </div>

                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                      ₹{ride.pricePerSeat}
                    </span>
                  </div>

                  {/* Waypoints */}
                  {ride.waypoints && ride.waypoints.length > 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
                      <strong style={{ color: '#cbd5e1' }}>Stops: </strong>
                      {ride.waypoints.join(' &bull; ')}
                    </div>
                  )}

                  {/* Meta Grid */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.78rem',
                      color: '#94a3b8',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#10b981" /> {ride.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="#10b981" /> {ride.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} color="#34d399" /> {ride.availableSeats} open
                    </span>
                  </div>

                  {isSelected && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px dashed rgba(52, 211, 153, 0.25)' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookingRide(ride);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        disabled={ride.availableSeats === 0 || user?._id === ride.driver?._id}
                      >
                        {user?._id === ride.driver?._id
                          ? 'You are the Driver'
                          : ride.availableSeats > 0
                          ? 'Select Seats on This Route &rarr;'
                          : 'Full'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#94a3b8' }}>No active routes found.</p>
            </div>
          )}
        </div>

        {/* Right Column: 3D Map Component */}
        <div style={{ height: '640px', position: 'sticky', top: '100px' }}>
          <RouteMap3D selectedRide={selectedRide} />
        </div>
      </div>

      {/* Interactive Seat Picker Modal */}
      {bookingRide && (
        <InteractiveSeatPicker
          ride={bookingRide}
          onClose={() => setBookingRide(null)}
          onSuccess={(msg) => {
            setToast(msg);
            setTimeout(() => setToast(''), 5000);
          }}
        />
      )}
    </div>
  );
};

export default RouteExplorer;
