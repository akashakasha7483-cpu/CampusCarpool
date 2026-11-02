import React, { useState, useEffect } from 'react';
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
} from '../components/Icons';
import { api } from '../api/client';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

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
      setError(err.message || 'Failed to load your rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride? Passengers with pending requests will be notified.')) {
      return;
    }

    try {
      const res = await api.cancelRide(rideId);
      if (res.success) {
        setSuccessToast('Ride cancelled successfully.');
        setTimeout(() => setSuccessToast(''), 5000);
        fetchMyRides();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel ride');
    }
  };

  return (
    <div>
      {successToast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 90 }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            My Hosted Rides
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Manage the carpools and bike shares you have published as a driver
          </p>
        </div>

        <Link to="/post-ride" className="btn btn-primary">
          <PlusCircle size={16} /> Post Another Ride
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          Loading your posted rides...
        </div>
      ) : rides.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="card"
              style={{
                borderLeft: `5px solid ${
                  ride.status === 'active'
                    ? '#10b981'
                    : ride.status === 'full'
                    ? '#f59e0b'
                    : '#94a3b8'
                }`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className={`status-badge ${ride.status}`}>{ride.status}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {ride.vehicleType} {ride.vehicleModel ? `(${ride.vehicleModel})` : ''}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    {ride.source} &rarr; {ride.destination}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                    ₹{ride.pricePerSeat}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / seat</span>
                </div>
              </div>

              {/* Waypoints */}
              {ride.waypoints && ride.waypoints.length > 0 && (
                <div style={{ marginBottom: '1rem', fontSize: '0.82rem', color: '#475569' }}>
                  <span style={{ fontWeight: 600 }}>Stops: </span>
                  {ride.waypoints.join(' &bull; ')}
                </div>
              )}

              {/* Ride Meta Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  color: '#334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} color="#10b981" />
                  <span>{ride.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} color="#10b981" />
                  <span>{ride.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={15} color="#10b981" />
                  <span>
                    <strong>{ride.availableSeats}</strong> of {ride.seatsTotal} seats open
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Inbox size={15} color={ride.pendingRequestsCount > 0 ? '#d97706' : '#64748b'} />
                  <span>
                    <strong style={{ color: ride.pendingRequestsCount > 0 ? '#d97706' : '#0f172a' }}>
                      {ride.pendingRequestsCount}
                    </strong>{' '}
                    pending request(s)
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  {ride.pendingRequestsCount > 0 && (
                    <Link
                      to={`/received-requests?rideId=${ride._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Inbox size={14} /> View & Accept {ride.pendingRequestsCount} Request(s)
                    </Link>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    to={`/received-requests?rideId=${ride._id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    All Passenger Requests
                  </Link>

                  {ride.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => handleCancelRide(ride._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={14} /> Cancel Ride
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Car size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            You haven&apos;t posted any rides yet
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Offer empty seats in your car or bike to peers traveling the same route.
          </p>
          <Link to="/post-ride" className="btn btn-primary">
            Post Your First Ride Offer
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRides;
