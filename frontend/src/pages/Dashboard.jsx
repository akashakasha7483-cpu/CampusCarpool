import React, { useState, useEffect } from 'react';
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
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import RideCard from '../components/RideCard';
import RequestModal from '../components/RequestModal';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    myRidesCount: 0,
    myRequestsCount: 0,
    receivedPendingCount: 0,
  });
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
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

        if (ridesRes.success) {
          setActiveRides(ridesRes.rides.slice(0, 4));
        }

        setStats({
          myRidesCount: myRidesRes.count || 0,
          myRequestsCount: myReqRes.count || 0,
          receivedPendingCount: recReqRes.count || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div>
      {successToast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 90 }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090e1a 0%, #0f172a 60%, #1e3a8a 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              STUDENT ID: {user?.studentId || '2102508522'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user?.department}</span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Welcome, {user?.name || 'Student'}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Ready to commute? Search compatible campus routes or share seats on your trip today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/find-rides" className="btn btn-primary">
            <Search size={16} /> Find Rides
          </Link>
          <Link to="/post-ride" className="btn btn-secondary">
            <PlusCircle size={16} /> Post a Ride
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <Link to="/my-rides" className="card card-interactive" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Hosted Rides</span>
            <div style={{ background: '#ecfdf5', color: '#059669', padding: '8px', borderRadius: '10px' }}>
              <Car size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.myRidesCount}</p>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>View all your posted rides &rarr;</span>
        </Link>

        <Link to="/my-requests" className="card card-interactive" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Seat Requests Sent</span>
            <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '8px', borderRadius: '10px' }}>
              <Send size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.myRequestsCount}</p>
          <span style={{ fontSize: '0.78rem', color: '#1e3a8a', fontWeight: 600 }}>Track request status &rarr;</span>
        </Link>

        <Link to="/received-requests" className="card card-interactive" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Pending Approvals</span>
            <div style={{ background: '#fffbeb', color: '#d97706', padding: '8px', borderRadius: '10px' }}>
              <Inbox size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.receivedPendingCount}</p>
          <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600 }}>
            {stats.receivedPendingCount > 0 ? 'Requires your action &rarr;' : 'All caught up &rarr;'}
          </span>
        </Link>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Student Trust Rating</span>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px', borderRadius: '10px' }}>
              <Star size={18} fill="#d97706" />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{user?.rating || '4.8'}/5.0</p>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Verified College Commuter</span>
        </div>
      </div>

      {/* Live Campus Feed */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Latest Campus Rides Available
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Real-time routes posted by peer students
            </p>
          </div>
          <Link to="/find-rides" className="btn btn-secondary btn-sm">
            Explore All Rides <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            Loading available rides...
          </div>
        ) : activeRides.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {activeRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                onRequestSeat={(r) => setSelectedRide(r)}
                isCurrentUserDriver={user?._id === ride.driver?._id}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <Car size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No open rides right now.</p>
            <Link to="/post-ride" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Post A Ride
            </Link>
          </div>
        )}
      </div>

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

export default Dashboard;
