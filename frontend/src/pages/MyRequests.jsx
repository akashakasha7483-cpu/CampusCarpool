import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  ArrowRight,
  ShieldCheck,
  Compass,
  Car,
  TrendingUp,
  Mail,
  Zap,
} from '../components/Icons';
import { api } from '../api/client';
import StudentVerificationBadge from '../components/StudentVerificationBadge';

export const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

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

    setCancellingId(requestId);
    try {
      const res = await api.cancelRequest(requestId);
      if (res.success) {
        setSuccessToast('Seat request cancelled successfully.');
        setTimeout(() => setSuccessToast(''), 5000);
        fetchRequests();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel request');
    } finally {
      setCancellingId(null);
    }
  };

  // Metrics
  const totalRequests = requests.length;
  const pendingRequests = useMemo(() => requests.filter((r) => r.status === 'pending'), [requests]);
  const acceptedRequests = useMemo(() => requests.filter((r) => r.status === 'accepted'), [requests]);
  const rejectedRequests = useMemo(
    () => requests.filter((r) => r.status === 'rejected' || r.status === 'cancelled'),
    [requests]
  );

  const totalContribution = useMemo(() => {
    return acceptedRequests.reduce((acc, r) => {
      const p = r.ride?.pricePerSeat || 0;
      return acc + p * (r.seatsRequested || 1);
    }, 0);
  }, [acceptedRequests]);

  // Tab Filtering
  const filteredRequests = useMemo(() => {
    switch (activeTab) {
      case 'accepted':
        return acceptedRequests;
      case 'pending':
        return pendingRequests;
      case 'rejected':
        return rejectedRequests;
      default:
        return requests;
    }
  }, [requests, activeTab, acceptedRequests, pendingRequests, rejectedRequests]);

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
            <Send size={14} />
            PASSENGER MOBILITY & BOARDING HUB
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', margin: '0 0 0.4rem 0' }}>
            My Requests & Boarding Passes
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.94rem', margin: 0 }}>
            Track pending seat requests, review approved digital boarding passes, and contact your verified drivers.
          </p>
        </div>

        <Link
          to="/find-rides"
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
          <Search size={18} />
          Discover New Rides
        </Link>
      </div>

      {/* Passenger KPI Telemetry Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Confirmed Rides
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
            {acceptedRequests.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
            Active boarding passes ready
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Awaiting Approval
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
            {pendingRequests.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
            Host drivers currently reviewing
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Total Commute Contribution
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>
            ₹{totalContribution}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>
            Shared student fuel offset
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Total Requests Sent
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            {totalRequests}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Lifetime transit inquiries
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `All Requests (${requests.length})` },
          { id: 'accepted', label: `Confirmed Pass (${acceptedRequests.length})`, highlight: acceptedRequests.length > 0 },
          { id: 'pending', label: `Pending Approval (${pendingRequests.length})` },
          { id: 'rejected', label: `Declined (${rejectedRequests.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background:
                activeTab === tab.id
                  ? 'rgba(59, 130, 246, 0.25)'
                  : 'rgba(15, 23, 42, 0.65)',
              border:
                activeTab === tab.id
                  ? '1.5px solid #3b82f6'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
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
          Loading your seat requests...
        </div>
      ) : filteredRequests.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredRequests.map((req) => {
            const isAccepted = req.status === 'accepted';
            const isPending = req.status === 'pending';
            const isRejected = req.status === 'rejected' || req.status === 'cancelled';
            const totalFare = (req.ride?.pricePerSeat || 30) * (req.seatsRequested || 1);
            const ticketRef = `CC-${req._id.slice(-6).toUpperCase()}`;

            return (
              <div
                key={req._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '24px',
                  background: isAccepted
                    ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.35), rgba(15, 23, 42, 0.95))'
                    : isPending
                    ? 'rgba(15, 23, 42, 0.85)'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: isAccepted
                    ? '1.5px solid #10b981'
                    : isPending
                    ? '1.5px solid #f59e0b'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isAccepted
                    ? '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.2)'
                    : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Boarding Pass Header Ribbon */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: isAccepted
                          ? 'rgba(16, 185, 129, 0.2)'
                          : isPending
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(239, 68, 68, 0.15)',
                        border: isAccepted
                          ? '1px solid rgba(16, 185, 129, 0.4)'
                          : isPending
                          ? '1px solid rgba(245, 158, 11, 0.4)'
                          : '1px solid rgba(239, 68, 68, 0.3)',
                        color: isAccepted ? '#34d399' : isPending ? '#fbbf24' : '#ef4444',
                      }}
                    >
                      {isAccepted ? 'Confirmed Pass' : isPending ? 'Awaiting Approval' : 'Declined'}
                    </span>

                    <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 800, letterSpacing: '0.05em' }}>
                      {ticketRef}
                    </span>
                  </div>

                  {/* Route Corridor */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                      <span style={{ color: '#10b981' }}>{req.ride?.source || 'Origin'}</span>
                      <ArrowRight size={16} color="#3b82f6" />
                      <span style={{ color: '#38bdf8' }}>{req.ride?.destination || 'Campus'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                      <span>
                        <Calendar size={13} color="#38bdf8" /> {req.ride?.date}
                      </span>
                      <span>
                        <Clock size={13} color="#38bdf8" /> {req.ride?.time}
                      </span>
                      <span style={{ color: '#f8fafc', fontWeight: 700 }}>
                        {req.seatsRequested} Seat{req.seatsRequested > 1 ? 's' : ''} (₹{totalFare})
                      </span>
                    </div>
                  </div>

                  {/* Host Driver Dossier */}
                  <div
                    style={{
                      background: 'rgba(7, 11, 20, 0.75)',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                          }}
                        >
                          {req.ride?.driver?.name ? req.ride.driver.name.charAt(0).toUpperCase() : 'D'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                            {req.ride?.driver?.name || 'Fellow Student'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {req.ride?.vehicleModel || req.ride?.vehicleType || 'Vehicle Registered'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Star size={13} fill="#fbbf24" />
                        {req.ride?.driver?.rating ? req.ride.driver.rating.toFixed(1) : '5.0'}
                      </div>
                    </div>

                    {/* Revealed Contact for Confirmed Passenger */}
                    {isAccepted && (
                      <div
                        style={{
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                          Driver Contact Coordinates:
                        </span>
                        {req.ride?.driver?.phone ? (
                          <a
                            href={`tel:${req.ride.driver.phone}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#38bdf8',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              textDecoration: 'none',
                            }}
                          >
                            <Phone size={12} /> {req.ride.driver.phone}
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{req.ride?.driver?.email}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {req.driverResponse && (
                    <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '8px', fontStyle: 'italic' }}>
                      Driver note: "{req.driverResponse}"
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  {isAccepted ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/route-explorer?source=${encodeURIComponent(req.ride?.source || '')}&destination=${encodeURIComponent(req.ride?.destination || '')}`}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', textAlign: 'center', fontSize: '0.75rem' }}
                      >
                        Inspect Route in 3D &rarr;
                      </Link>
                    </div>
                  ) : isPending ? (
                    <button
                      onClick={() => handleCancelRequest(req._id)}
                      disabled={cancellingId === req._id}
                      className="btn btn-secondary btn-sm"
                      style={{
                        width: '100%',
                        color: '#ef4444',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      {cancellingId === req._id ? 'Cancelling...' : 'Cancel Seat Request'}
                    </button>
                  ) : (
                    <Link to="/find-rides" className="btn btn-secondary btn-sm" style={{ width: '100%', textAlign: 'center', fontSize: '0.75rem' }}>
                      Book Another Corridor
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', borderRadius: '24px' }}>
          <p style={{ color: '#94a3b8', margin: '0 0 1.25rem 0' }}>No requests found in this category.</p>
          <Link to="/find-rides" className="btn btn-primary btn-sm">
            Search Campus Rides
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
