import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Search,
  PlusCircle,
  Inbox,
  Send,
  Star,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronRight,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import StudentVerificationBadge from '../components/StudentVerificationBadge';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    myRidesCount: 0,
    myRequestsCount: 0,
    receivedPendingCount: 0,
    totalFuelSaved: 0,
  });
  const [activeRides, setActiveRides] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRide, setBookingRide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ridesRes, myRidesRes, myReqRes, recReqRes] = await Promise.all([
          api.getActiveRides(),
          api.getMyRides(),
          api.getMyRequests(),
          api.getReceivedRequests({ status: 'pending' }),
        ]);

        if (ridesRes.success && ridesRes.rides) {
          setActiveRides(ridesRes.rides);
        }

        const myRequests = myReqRes.requests || [];
        const confirmedBookings = myRequests.filter((r) => r.status === 'accepted');
        const fuelSaved = confirmedBookings.reduce((sum, req) => {
          const fare = req.ride?.pricePerSeat || 0;
          return sum + fare * (req.seatsRequested || 1);
        }, 0);

        setStats({
          myRidesCount: myRidesRes.count || (myRidesRes.rides ? myRidesRes.rides.length : 0),
          myRequestsCount: myReqRes.count || myRequests.length,
          receivedPendingCount: recReqRes.count || (recReqRes.requests ? recReqRes.requests.length : 0),
          totalFuelSaved: fuelSaved,
        });

        if (recReqRes.requests) {
          setPendingRequests(recReqRes.requests.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-rides?source=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/find-rides');
    }
  };

  const handleBookingSuccess = (msg, bookedRideId, seatsBooked = 1) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 5000);

    // Update activeRides in place
    setActiveRides((prev) =>
      prev.map((r) => {
        if (r._id === bookedRideId) {
          return { ...r, availableSeats: Math.max(0, r.availableSeats - seatsBooked) };
        }
        return r;
      })
    );
  };

  const hasVehicle = user?.vehicleInfo?.vehicleType && user.vehicleInfo.vehicleType !== 'None';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Notification */}
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

      {/* Personalized Mobility Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          {/* Student Profile Overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: '#f8fafc',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome back, {user?.name || 'Fellow Student'}
                </h1>
                <StudentVerificationBadge
                  verified={user?.verified !== false}
                  department={user?.department || 'University Mobility'}
                  studentId={user?.studentId}
                  compact={true}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginTop: '0.45rem',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <strong>{user?.rating ? user.rating.toFixed(1) : '5.0'}</strong> Peer Rating
                </span>
                <span>&bull;</span>
                <span style={{ color: '#cbd5e1' }}>
                  {hasVehicle
                    ? `Registered Host (${user.vehicleInfo.vehicleType}: ${user.vehicleInfo.model || 'Verified'})`
                    : 'Commuter / Passenger'}
                </span>
                <span>&bull;</span>
                <span style={{ color: '#38bdf8' }}>{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/post-ride" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={16} /> Post Corridor
            </Link>
            <Link to="/find-rides" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Search size={16} /> Find Rides
            </Link>
            <Link to="/route-explorer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} /> 3D Flight Deck
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Column KPI Telemetry Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* KPI 1: Host Corridors */}
        <Link
          to="/my-rides"
          className="card"
          style={{
            textDecoration: 'none',
            padding: '1.4rem',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            transition: 'all 0.25s',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Host Corridors
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={18} color="#3b82f6" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            {stats.myRidesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Manage published corridors &rarr;
          </div>
        </Link>

        {/* KPI 2: Incoming Requests (Alert if > 0) */}
        <Link
          to="/received-requests"
          className="card"
          style={{
            textDecoration: 'none',
            padding: '1.4rem',
            borderRadius: '20px',
            background: stats.receivedPendingCount > 0 ? 'rgba(30, 27, 75, 0.85)' : 'rgba(15, 23, 42, 0.75)',
            border: stats.receivedPendingCount > 0 ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.25s',
            boxShadow: stats.receivedPendingCount > 0 ? '0 0 25px rgba(245, 158, 11, 0.25)' : '0 8px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: stats.receivedPendingCount > 0 ? '#fbbf24' : '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Pending Passenger Requests
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox size={18} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: stats.receivedPendingCount > 0 ? '#fbbf24' : '#f8fafc', letterSpacing: '-0.02em' }}>
            {stats.receivedPendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: stats.receivedPendingCount > 0 ? '#f59e0b' : '#94a3b8', marginTop: '0.25rem' }}>
            {stats.receivedPendingCount > 0 ? 'Action required: Review requests &rarr;' : 'All passenger requests cleared'}
          </div>
        </Link>

        {/* KPI 3: My Bookings */}
        <Link
          to="/my-requests"
          className="card"
          style={{
            textDecoration: 'none',
            padding: '1.4rem',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            transition: 'all 0.25s',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              My Requests & Bookings
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            {stats.myRequestsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: '0.25rem' }}>
            View booking passes & status &rarr;
          </div>
        </Link>

        {/* KPI 4: Shared Fuel Offset */}
        <div
          className="card"
          style={{
            padding: '1.4rem',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Shared Fuel Offset
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', letterSpacing: '-0.02em' }}>
            ₹{stats.totalFuelSaved}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>
            Community fuel savings realized
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Action Drawer (if any) + Active Corridors Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: pendingRequests.length > 0 ? 'minmax(340px, 420px) 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Pending Requests Dispatch Preview */}
        {pendingRequests.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Action Required ({pendingRequests.length})
              </span>
              <Link to="/received-requests" style={{ fontSize: '0.78rem', color: '#60a5fa', textDecoration: 'none', fontWeight: 700 }}>
                View All &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: 'rgba(30, 27, 75, 0.75)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                        {req.passenger?.name || 'Fellow Student'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {req.passenger?.department || 'University Student'}
                      </div>
                    </div>
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {req.seatsRequested} Seat{req.seatsRequested > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                    Route: <strong style={{ color: '#f8fafc' }}>{req.ride?.source} &rarr; {req.ride?.destination}</strong>
                  </div>

                  {req.pickupNote && (
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 10px', borderRadius: '8px', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                      "{req.pickupNote}"
                    </div>
                  )}

                  <Link
                    to={`/received-requests?rideId=${req.ride?._id}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}
                  >
                    Review & Respond &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Campus Transit Corridors Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Daily Commute Corridors
              </span>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
                Live departures connecting student residential hubs to campus gates.
              </p>
            </div>
            <Link to="/find-rides" style={{ fontSize: '0.78rem', color: '#60a5fa', textDecoration: 'none', fontWeight: 700 }}>
              Browse All ({activeRides.length}) &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', borderRadius: '20px' }}>
              Loading active transit corridors...
            </div>
          ) : activeRides.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {activeRides.slice(0, 6).map((ride) => {
                const isHost = user?._id === ride.driver?._id;
                const isFull = ride.availableSeats === 0;

                return (
                  <div
                    key={ride._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      borderRadius: '20px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.25s',
                    }}
                  >
                    {/* Driver & Price Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
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
                          {ride.driver?.name ? ride.driver.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                            {ride.driver?.name || 'Fellow Student'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {ride.vehicleType || 'Car'} &bull; {ride.vehicleModel || 'Campus Commuter'}
                          </div>
                        </div>
                      </div>

                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                        ₹{ride.pricePerSeat}
                      </span>
                    </div>

                    {/* Route */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#10b981' }}>{ride.source}</span>
                      <ArrowRight size={14} color="#3b82f6" />
                      <span style={{ color: '#38bdf8' }}>{ride.destination}</span>
                    </div>

                    {/* Schedule & Capacity */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.78rem',
                        color: '#94a3b8',
                        paddingTop: '0.65rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="#38bdf8" /> {ride.time} &bull; {ride.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isFull ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                        <Users size={13} /> {isFull ? 'Full' : `${ride.availableSeats} open`}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setBookingRide(ride)}
                      disabled={isFull || isHost}
                      className="btn btn-primary btn-sm"
                      style={{
                        width: '100%',
                        background: isFull
                          ? 'rgba(255, 255, 255, 0.08)'
                          : isHost
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        cursor: isFull || isHost ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isHost ? 'You are Host' : isFull ? 'Corridor Full' : 'Select Seat & Reserve &rarr;'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderRadius: '20px' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 1rem 0' }}>No active campus transit corridors currently scheduled.</p>
              <Link to="/post-ride" className="btn btn-primary btn-sm">
                Post the First Corridor
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Seat Picker Cabin HUD Modal */}
      {bookingRide && (
        <InteractiveSeatPicker
          ride={bookingRide}
          onClose={() => setBookingRide(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
