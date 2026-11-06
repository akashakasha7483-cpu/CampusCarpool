import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Car,
  Calendar,
  Clock,
  Users,
  Inbox,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Compass,
  Sparkles,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Zap,
} from '../components/Icons';
import { api } from '../api/client';

export const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessToast(location.state.message);
      setTimeout(() => setSuccessToast(''), 5000);
    }
  }, [location.state]);

  const fetchMyRides = async () => {
    setLoading(true);
    try {
      const res = await api.getMyRides();
      if (res.success) {
        setRides(res.rides || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your published rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleCancelRide = async (rideId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this transit corridor? Passengers with pending or accepted requests will be notified.'
      )
    ) {
      return;
    }

    setCancellingId(rideId);
    try {
      const res = await api.cancelRide(rideId);
      if (res.success) {
        setSuccessToast('Transit corridor cancelled successfully.');
        setTimeout(() => setSuccessToast(''), 5000);
        fetchMyRides();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel corridor');
    } finally {
      setCancellingId(null);
    }
  };

  // Driver Telemetry Metrics
  const totalRides = rides.length;
  const activeRides = useMemo(() => rides.filter((r) => r.status === 'active'), [rides]);
  const fullRides = useMemo(() => rides.filter((r) => r.status === 'full'), [rides]);
  const cancelledRides = useMemo(() => rides.filter((r) => r.status === 'cancelled'), [rides]);

  const totalOfferedSeats = useMemo(() => {
    return rides.reduce((acc, r) => acc + (r.seatsTotal || 0), 0);
  }, [rides]);

  const totalBookedSeats = useMemo(() => {
    return rides.reduce((acc, r) => {
      if (r.status === 'cancelled') return acc;
      const booked = (r.seatsTotal || 0) - (r.availableSeats || 0);
      return acc + Math.max(0, booked);
    }, 0);
  }, [rides]);

  const totalFuelEarnings = useMemo(() => {
    return rides.reduce((acc, r) => {
      if (r.status === 'cancelled') return acc;
      const booked = (r.seatsTotal || 0) - (r.availableSeats || 0);
      return acc + Math.max(0, booked) * (r.pricePerSeat || 0);
    }, 0);
  }, [rides]);

  // Tab Filtering
  const filteredRides = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return activeRides;
      case 'full':
        return fullRides;
      case 'cancelled':
        return cancelledRides;
      default:
        return rides;
    }
  }, [rides, activeTab, activeRides, fullRides, cancelledRides]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Alerts */}
      {successToast && (
        <div
          className="alert alert-success"
          style={{
            position: 'sticky',
            top: '80px',
            zIndex: 100,
            background: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger"
          style={{
            position: 'sticky',
            top: '80px',
            zIndex: 100,
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#ffffff',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1.25rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '0.5rem',
              letterSpacing: '0.04em',
            }}
          >
            <Car size={14} />
            DRIVER DISPATCH WORKSTATION
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', margin: '0 0 0.4rem 0' }}>
            My Published Corridors
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.94rem', margin: 0 }}>
            Manage daily transit corridors, monitor real-time seat occupancies, and review incoming student bookings.
          </p>
        </div>

        <Link
          to="/post-ride"
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.35)',
          }}
        >
          <PlusCircle size={18} />
          Post New Corridor
        </Link>
      </div>

      {/* Driver KPI Telemetry Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Active Corridors
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            {activeRides.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>
            {totalRides} lifetime corridors posted
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Seats Booked
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
            {totalBookedSeats} / {totalOfferedSeats}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
            {totalOfferedSeats > 0 ? `${((totalBookedSeats / totalOfferedSeats) * 100).toFixed(0)}% occupancy rate` : '0% occupancy'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Fuel Contributions
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', margin: '4px 0' }}>
            ₹{totalFuelEarnings}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6' }}>
            Direct shared commute offset
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Pending Action
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
            {fullRides.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
            Fully booked corridors
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `All Corridors (${rides.length})` },
          { id: 'active', label: `Active (${activeRides.length})` },
          { id: 'full', label: `Fully Booked (${fullRides.length})` },
          { id: 'cancelled', label: `Cancelled (${cancelledRides.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.65)',
              border: activeTab === tab.id ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Corridors Grid */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', borderRadius: '24px' }}>
          Loading your published corridors...
        </div>
      ) : filteredRides.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredRides.map((ride) => {
            const isCancelled = ride.status === 'cancelled';
            const isFull = ride.status === 'full' || ride.availableSeats === 0;
            const bookedSeats = Math.max(0, (ride.seatsTotal || 0) - (ride.availableSeats || 0));

            return (
              <div
                key={ride._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '24px',
                  background: isCancelled
                    ? 'rgba(15, 23, 42, 0.45)'
                    : 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.75))',
                  border: isCancelled
                    ? '1px solid rgba(239, 68, 68, 0.2)'
                    : isFull
                    ? '1.5px solid rgba(245, 158, 11, 0.4)'
                    : '1.5px solid rgba(59, 130, 246, 0.35)',
                  boxShadow: isCancelled
                    ? 'none'
                    : '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(59, 130, 246, 0.1)',
                  opacity: isCancelled ? 0.75 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  {/* Top Status & Price Pill */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: isCancelled
                          ? 'rgba(239, 68, 68, 0.15)'
                          : isFull
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)',
                        border: isCancelled
                          ? '1px solid rgba(239, 68, 68, 0.35)'
                          : isFull
                          ? '1px solid rgba(245, 158, 11, 0.35)'
                          : '1px solid rgba(16, 185, 129, 0.35)',
                        color: isCancelled ? '#ef4444' : isFull ? '#fbbf24' : '#34d399',
                      }}
                    >
                      {isCancelled ? 'Cancelled' : isFull ? 'Fully Booked' : 'Active Corridor'}
                    </span>

                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                      ₹{ride.pricePerSeat}
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}> / seat</span>
                    </span>
                  </div>

                  {/* Route Trajectory */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                      <span style={{ color: '#10b981' }}>{ride.source}</span>
                      <ArrowRight size={16} color="#3b82f6" />
                      <span style={{ color: '#38bdf8' }}>{ride.destination}</span>
                    </div>

                    {ride.waypoints && ride.waypoints.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                        Stops: {ride.waypoints.join(' &bull; ')}
                      </div>
                    )}
                  </div>

                  {/* Schedule & Vehicle */}
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#38bdf8" /> {ride.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="#38bdf8" /> {ride.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                      <Car size={13} /> {ride.vehicleModel || ride.vehicleType}
                    </span>
                  </div>

                  {/* Visual Seat Capacity Gauge */}
                  <div
                    style={{
                      background: 'rgba(7, 11, 20, 0.8)',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.75rem' }}>
                      <span style={{ color: '#94a3b8', fontWeight: 700 }}>Seat Occupancy</span>
                      <span style={{ color: isFull ? '#fbbf24' : '#10b981', fontWeight: 800 }}>
                        {bookedSeats} booked / {ride.availableSeats} available
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {Array.from({ length: ride.seatsTotal || 3 }).map((_, idx) => {
                        const isOccupied = idx < bookedSeats;
                        return (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              height: '8px',
                              borderRadius: '4px',
                              background: isOccupied
                                ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                                : 'rgba(255, 255, 255, 0.1)',
                              boxShadow: isOccupied ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Ribbon */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <Link
                    to={`/received-requests?rideId=${ride._id}`}
                    className="btn btn-primary btn-sm"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Inbox size={14} /> Manage Passenger Bookings
                  </Link>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      to={`/route-explorer?source=${encodeURIComponent(ride.source)}&destination=${encodeURIComponent(ride.destination)}`}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}
                    >
                      Inspect in 3D Map
                    </Link>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelRide(ride._id)}
                        disabled={cancellingId === ride._id}
                        className="btn btn-secondary btn-sm"
                        style={{
                          color: '#ef4444',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {cancellingId === ride._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', borderRadius: '24px' }}>
          <p style={{ color: '#94a3b8', margin: '0 0 1.25rem 0' }}>No corridors found in this category.</p>
          <Link to="/post-ride" className="btn btn-primary btn-sm">
            Post Your First Corridor
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRides;
