import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Inbox,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Filter,
} from '../components/Icons';
import { api } from '../api/client';

const ReceivedRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const rideIdFilter = searchParams.get('rideId') || '';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [responseNotes, setResponseNotes] = useState({});

  const fetchReceived = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (rideIdFilter) params.rideId = rideIdFilter;

      const res = await api.getReceivedRequests(params);
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load received requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceived();
  }, [statusFilter, rideIdFilter]);

  const handleNoteChange = (id, note) => {
    setResponseNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleAccept = async (requestId) => {
    setActionLoadingId(requestId);
    setError('');
    const note = responseNotes[requestId] || 'Seat confirmed! See you at pickup.';

    try {
      const res = await api.acceptRequest(requestId, note);
      if (res.success) {
        setSuccessToast(res.message);
        setTimeout(() => setSuccessToast(''), 5000);
        fetchReceived();
      }
    } catch (err) {
      setError(err.message || 'Failed to accept request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoadingId(requestId);
    setError('');
    const note = responseNotes[requestId] || 'Sorry, cannot accommodate this trip.';

    try {
      const res = await api.rejectRequest(requestId, note);
      if (res.success) {
        setSuccessToast(res.message);
        setTimeout(() => setSuccessToast(''), 5000);
        fetchReceived();
      }
    } catch (err) {
      setError(err.message || 'Failed to reject request');
    } finally {
      setActionLoadingId(null);
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
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            Received Booking Requests
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Review and approve peer passenger requests for your hosted rides
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSearchParams(rideIdFilter ? { rideId: rideIdFilter } : {})}
            className={`btn btn-sm ${!statusFilter ? 'btn-primary' : 'btn-secondary'}`}
          >
            All
          </button>
          <button
            onClick={() => setSearchParams({ ...(rideIdFilter ? { rideId: rideIdFilter } : {}), status: 'pending' })}
            className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Pending Only
          </button>
          <button
            onClick={() => setSearchParams({ ...(rideIdFilter ? { rideId: rideIdFilter } : {}), status: 'accepted' })}
            className={`btn btn-sm ${statusFilter === 'accepted' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Accepted
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          Loading booking requests...
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
                    : '#ef4444'
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className={`status-badge ${req.status}`}>{req.status}</span>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Requested: <strong>{req.seatsRequested} Seat(s)</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Ride: {req.ride?.source || 'Origin'} &rarr; {req.ride?.destination || 'Destination'}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Remaining Seats on Ride: <strong>{req.ride?.availableSeats ?? 'N/A'}</strong>
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                    ₹{(req.ride?.pricePerSeat || 0) * req.seatsRequested}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                    Fare Contribution
                  </span>
                </div>
              </div>

              {/* Passenger Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Student Passenger
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <User size={14} color="#1e3a8a" />
                    <strong>{req.passenger?.name || 'Student'}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      ({req.passenger?.studentId})
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {req.passenger?.department}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Contact Details
                  </span>
                  {req.passenger?.phone ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', color: '#059669' }}>
                      <Phone size={13} />
                      <span>{req.passenger.phone}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block' }}>No phone shared</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', color: '#1e3a8a' }}>
                    <Mail size={13} />
                    <span>{req.passenger?.email}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Passenger Pickup Note
                  </span>
                  <p style={{ marginTop: '0.2rem', color: '#334155', fontStyle: req.pickupNote ? 'normal' : 'italic' }}>
                    {req.pickupNote || 'No specific pickup note provided'}
                  </p>
                </div>
              </div>

              {/* Action Section for Pending Requests */}
              {req.status === 'pending' ? (
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add an optional note to student (e.g. 'See you at Sony World bus stop')"
                      value={responseNotes[req._id] || ''}
                      onChange={(e) => handleNoteChange(req._id, e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => handleReject(req._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                      disabled={actionLoadingId === req._id}
                    >
                      <XCircle size={15} /> Reject Request
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAccept(req._id)}
                      className="btn btn-primary btn-sm"
                      disabled={
                        actionLoadingId === req._id ||
                        (req.ride?.availableSeats < req.seatsRequested)
                      }
                    >
                      <CheckCircle size={15} />
                      {actionLoadingId === req._id ? 'Processing...' : 'Accept & Confirm Seat'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    Status Note: <em>{req.responseMessage || 'Processed'}</em>
                  </span>
                  <span style={{ fontWeight: 600, color: req.status === 'accepted' ? '#059669' : '#dc2626' }}>
                    {req.status === 'accepted' ? '✓ Seat Confirmed' : '✗ Request Rejected'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Inbox size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            No Booking Requests Received
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            When other students request seats on your rides, they will appear here for your review and approval.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceivedRequests;
