import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Calendar,
  Clock,
  Phone,
  User,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
} from '../components/Icons';
import { api } from '../api/client';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getMyRequests();
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch your seat requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this seat request?')) {
      return;
    }

    try {
      const res = await api.cancelRequest(requestId);
      if (res.success) {
        setSuccessToast('Seat request cancelled successfully.');
        setTimeout(() => setSuccessToast(''), 5000);
        fetchRequests();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel request');
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          My Seat Requests
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
          Track the status of rides you have requested to join as a passenger
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          Loading your requests...
        </div>
      ) : requests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div
              key={req._id}
              className="card"
              style={{
                borderLeft: `5px solid ${
                  req.status === 'accepted'
                    ? '#10b981'
                    : req.status === 'pending'
                    ? '#f59e0b'
                    : req.status === 'rejected'
                    ? '#ef4444'
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span className={`status-badge ${req.status}`}>
                      {req.status === 'accepted' ? 'CONFIRMED' : req.status}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Requested: {req.seatsRequested} {req.seatsRequested === 1 ? 'Seat' : 'Seats'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    {req.ride?.source || 'Origin'} &rarr; {req.ride?.destination || 'Destination'}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                    ₹{(req.ride?.pricePerSeat || 0) * req.seatsRequested}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                    Total Contribution
                  </span>
                </div>
              </div>

              {/* Ride & Driver Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Driver Details
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <User size={14} color="#1e3a8a" />
                    <strong>{req.driver?.name || 'Fellow Student'}</strong>
                  </div>
                  {req.driver?.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', color: '#059669' }}>
                      <Phone size={13} />
                      <span>{req.driver.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Schedule
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <Calendar size={14} color="#10b981" />
                    <span>{req.ride?.date || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <Clock size={14} color="#10b981" />
                    <span>{req.ride?.time || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Pickup Note
                  </span>
                  <p style={{ marginTop: '0.2rem', color: '#475569', fontStyle: req.pickupNote ? 'normal' : 'italic' }}>
                    {req.pickupNote || 'No custom pickup note specified'}
                  </p>
                </div>
              </div>

              {/* Driver Response Note if exists */}
              {req.responseMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: req.status === 'accepted' ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${req.status === 'accepted' ? '#a7f3d0' : '#fecaca'}`,
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: req.status === 'accepted' ? '#065f46' : '#991b1b',
                    marginBottom: '1rem',
                  }}
                >
                  <strong>Driver Note: </strong>
                  {req.responseMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                {(req.status === 'pending' || req.status === 'accepted') && (
                  <button
                    onClick={() => handleCancelRequest(req._id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#ef4444' }}
                  >
                    <XCircle size={14} /> Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Send size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            No Ride Requests Sent
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Search for campus rides matching your schedule and request a seat.
          </p>
          <Link to="/find-rides" className="btn btn-primary">
            Find Rides Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
