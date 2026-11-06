import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  Filter,
  ArrowRight,
  ShieldCheck,
  Star,
  Check,
  X,
  MessageSquare,
} from '../components/Icons';
import { api } from '../api/client';
import StudentVerificationBadge from '../components/StudentVerificationBadge';

export const ReceivedRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const rideIdFilter = searchParams.get('rideId') || '';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState(statusFilter || 'pending');
  const [responseNotes, setResponseNotes] = useState({});

  const fetchReceived = async () => {
    setLoading(true);
    try {
      const params = {};
      if (rideIdFilter) params.rideId = rideIdFilter;

      const res = await api.getReceivedRequests(params);
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load received passenger requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceived();
  }, [rideIdFilter]);

  const handleNoteChange = (id, note) => {
    setResponseNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleAccept = async (requestId) => {
    setActionLoadingId(requestId);
    setError('');

    try {
      const note = responseNotes[requestId] || '';
      const res = await api.acceptRequest(requestId, note);
      if (res.success) {
        setSuccessToast('Seat request approved! Passenger confirmed and seats updated atomically.');
        setTimeout(() => setSuccessToast(''), 5000);
        fetchReceived();
      }
    } catch (err) {
      setError(err.message || 'Failed to accept seat request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoadingId(requestId);
    setError('');

    try {
      const note = responseNotes[requestId] || '';
      const res = await api.rejectRequest(requestId, note);
      if (res.success) {
        setSuccessToast('Seat request declined.');
        setTimeout(() => setSuccessToast(''), 5000);
        fetchReceived();
      }
    } catch (err) {
      setError(err.message || 'Failed to decline request');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter requests by tab
  const pendingRequests = useMemo(() => requests.filter((r) => r.status === 'pending'), [requests]);
  const acceptedRequests = useMemo(() => requests.filter((r) => r.status === 'accepted'), [requests]);
  const rejectedRequests = useMemo(
    () => requests.filter((r) => r.status === 'rejected' || r.status === 'cancelled'),
    [requests]
  );

  const displayedRequests = useMemo(() => {
    if (activeTab === 'pending') return pendingRequests;
    if (activeTab === 'accepted') return acceptedRequests;
    if (activeTab === 'rejected') return rejectedRequests;
    return requests;
  }, [requests, activeTab, pendingRequests, acceptedRequests, rejectedRequests]);

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
            <Inbox size={14} />
            PASSENGER REQUEST APPROVAL STATION
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', margin: '0 0 0.4rem 0' }}>
            Received Passenger Requests
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.94rem', margin: 0 }}>
            Inspect student passenger profiles, review pickup notes, and execute atomic seat approvals.
          </p>
        </div>

        {rideIdFilter && (
          <button
            onClick={() => setSearchParams({})}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            Clear Corridor Filter ({requests.length} total)
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'pending', label: `Pending Approvals (${pendingRequests.length})`, highlight: pendingRequests.length > 0 },
          { id: 'accepted', label: `Confirmed Passengers (${acceptedRequests.length})` },
          { id: 'rejected', label: `Declined / Past (${rejectedRequests.length})` },
          { id: 'all', label: `All Requests (${requests.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background:
                activeTab === tab.id
                  ? 'rgba(59, 130, 246, 0.25)'
                  : tab.highlight
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(15, 23, 42, 0.65)',
              border:
                activeTab === tab.id
                  ? '1.5px solid #3b82f6'
                  : tab.highlight
                  ? '1px solid rgba(245, 158, 11, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              color:
                activeTab === tab.id
                  ? '#60a5fa'
                  : tab.highlight
                  ? '#fbbf24'
                  : '#94a3b8',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Stream */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', borderRadius: '24px' }}>
          Loading passenger requests...
        </div>
      ) : displayedRequests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {displayedRequests.map((req) => {
            const isPending = req.status === 'pending';
            const isAccepted = req.status === 'accepted';
            const isRejected = req.status === 'rejected' || req.status === 'cancelled';
            const isLoadingAction = actionLoadingId === req._id;

            return (
              <div
                key={req._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '24px',
                  background: isPending
                    ? 'linear-gradient(135deg, rgba(20, 25, 45, 0.95), rgba(30, 35, 60, 0.85))'
                    : 'rgba(15, 23, 42, 0.75)',
                  border: isPending
                    ? '1.5px solid #f59e0b'
                    : isAccepted
                    ? '1.5px solid #10b981'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isPending
                    ? '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(245, 158, 11, 0.15)'
                    : isAccepted
                    ? '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.15)'
                    : 'none',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1.5rem',
                }}
              >
                {/* Left: Passenger Identity & Corridor Specs */}
                <div style={{ flex: '1 1 360px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      {req.passenger?.name ? req.passenger.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          {req.passenger?.name || 'Verified Student'}
                        </h4>
                        <StudentVerificationBadge
                          verified={true}
                          department={req.passenger?.department}
                          compact={true}
                        />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                        ID: <strong style={{ color: '#60a5fa' }}>{req.passenger?.studentId || 'UNIV-STUDENT'}</strong> &bull; Rating:{' '}
                        <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                          ★ {req.passenger?.rating ? req.passenger.rating.toFixed(1) : '5.0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route Trajectory */}
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#10b981' }}>{req.ride?.source}</span> &rarr;{' '}
                    <span style={{ color: '#38bdf8' }}>{req.ride?.destination}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
                    <span>
                      <Calendar size={13} color="#38bdf8" /> {req.ride?.date}
                    </span>
                    <span>
                      <Clock size={13} color="#38bdf8" /> {req.ride?.time}
                    </span>
                    <span style={{ color: '#fbbf24', fontWeight: 800 }}>
                      Requested: {req.seatsRequested} Seat{req.seatsRequested > 1 ? 's' : ''} (₹{(req.ride?.pricePerSeat || 30) * req.seatsRequested})
                    </span>
                  </div>

                  {req.pickupNote && (
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: '#cbd5e1',
                        background: 'rgba(7, 11, 20, 0.7)',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        fontStyle: 'italic',
                        maxWidth: '480px',
                      }}
                    >
                      "{req.pickupNote}"
                    </div>
                  )}

                  {/* Revealed Phone Number on Acceptance */}
                  {isAccepted && req.passenger?.phone && (
                    <div
                      style={{
                        marginTop: '0.65rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        color: '#34d399',
                        fontWeight: 700,
                      }}
                    >
                      <Phone size={13} />
                      <a href={`tel:${req.passenger.phone}`} style={{ color: '#34d399', textDecoration: 'none' }}>
                        {req.passenger.phone} (Call Passenger)
                      </a>
                    </div>
                  )}
                </div>

                {/* Right: Actions or Decision Badge */}
                <div style={{ flex: '0 0 auto', minWidth: '220px', textAlign: 'right' }}>
                  {isPending ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <input
                        type="text"
                        placeholder="Optional note to rider..."
                        value={responseNotes[req._id] || ''}
                        onChange={(e) => handleNoteChange(req._id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: 'rgba(7, 11, 20, 0.85)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          outline: 'none',
                        }}
                      />

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAccept(req._id)}
                          disabled={isLoadingAction}
                          className="btn btn-primary btn-sm"
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                          }}
                        >
                          <Check size={14} /> {isLoadingAction ? 'Processing...' : 'Approve'}
                        </button>

                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={isLoadingAction}
                          className="btn btn-secondary btn-sm"
                          style={{
                            color: '#ef4444',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <X size={14} /> Decline
                        </button>
                      </div>
                    </div>
                  ) : isAccepted ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#34d399',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                      }}
                    >
                      <CheckCircle2 size={16} /> CONFIRMED PASSENGER
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                      }}
                    >
                      <XCircle size={16} /> REQUEST DECLINED
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', borderRadius: '24px' }}>
          <p style={{ color: '#94a3b8', margin: '0 0 1.25rem 0' }}>No passenger requests found in this view.</p>
          <Link to="/my-rides" className="btn btn-secondary btn-sm">
            View Your Published Corridors
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReceivedRequests;
