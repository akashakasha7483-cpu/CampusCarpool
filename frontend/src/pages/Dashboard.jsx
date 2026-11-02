import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import RideCard from '../components/RideCard';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import VehicleCanvas3D from '../components/3d/VehicleCanvas3D';

export const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    myRidesCount: 0,
    myRequestsCount: 0,
    receivedPendingCount: 0,
  });
  const [recommendedRides, setRecommendedRides] = useState([]);
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
          setRecommendedRides(ridesRes.rides.slice(0, 4));
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

  const userVehicleType = user?.vehicleInfo?.vehicleType !== 'None' ? user?.vehicleInfo?.vehicleType : 'Car';

  return (
    <div>
      {successToast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 100 }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Futuristic 3D Welcome Hero */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 28, 46, 0.95) 0%, rgba(8, 13, 24, 0.98) 100%)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '24px',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(16, 185, 129, 0.15)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Welcome Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  color: '#34d399',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em',
                }}
              >
                STUDENT ID: {user?.studentId || '2102508522'}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {user?.department || 'Information Technology'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Welcome Back, {user?.name || 'Student'}!
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              Your campus mobility portal is synchronized. Track seat requests, explore real-time routes, or post
              an empty seat offer in seconds.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/find-rides" className="btn btn-primary">
                <Search size={16} /> Find Rides
              </Link>
              <Link to="/post-ride" className="btn btn-secondary">
                <PlusCircle size={16} /> Post Ride
              </Link>
              <Link to="/route-explorer" className="btn btn-outline-green">
                <Compass size={16} /> 3D Route Map
              </Link>
              <Link to="/garage" className="btn btn-navy">
                <Car size={16} /> Vehicle Garage
              </Link>
            </div>
          </div>

          {/* 3D Vehicle Preview Thumbnail */}
          <div style={{ width: '100%', position: 'relative' }}>
            <VehicleCanvas3D
              vehicleType={userVehicleType}
              color="#10b981"
              autoRotate={true}
              interactive={true}
              height="260px"
              cameraDistance={4.2}
            />
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Active Vehicle: <strong style={{ color: '#34d399' }}>Cyber {userVehicleType}</strong> ({user?.vehicleInfo?.model || 'Configured'})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animated Counters Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}
      >
        <Link to="/my-rides" className="card card-interactive" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>Hosted Rides</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '8px', borderRadius: '12px' }}>
              <Car size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc' }}>
            {user?.ridesHosted ?? stats.myRidesCount}
          </p>
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>Manage active rides &rarr;</span>
        </Link>

        <Link to="/my-requests" className="card card-interactive" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>Joined Rides</span>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '8px', borderRadius: '12px' }}>
              <Send size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc' }}>
            {user?.ridesJoined ?? stats.myRequestsCount}
          </p>
          <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>Track seat requests &rarr;</span>
        </Link>

        <Link to="/received-requests" className="card card-interactive" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>Pending Approvals</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '8px', borderRadius: '12px' }}>
              <Inbox size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc' }}>{stats.receivedPendingCount}</p>
          <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
            {stats.receivedPendingCount > 0 ? 'Requires your review &rarr;' : 'All caught up &rarr;'}
          </span>
        </Link>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>Trust Rating</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '8px', borderRadius: '12px' }}>
              <Star size={18} fill="#fbbf24" />
            </div>
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc' }}>{user?.rating || '4.8'}/5.0</p>
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>Verified Student Commuter</span>
        </div>
      </div>

      {/* Recommended Campus Rides */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc' }}>
              Recommended Campus Corridors
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Peer student rides traveling along major college commute routes
            </p>
          </div>
          <Link to="/find-rides" className="btn btn-secondary btn-sm">
            View All Rides <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
            Loading recommendations...
          </div>
        ) : recommendedRides.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {recommendedRides.map((ride) => (
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
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No open rides right now.</p>
            <Link to="/post-ride" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Post A Ride
            </Link>
          </div>
        )}
      </div>

      {/* Interactive Seat Picker */}
      {selectedRide && (
        <InteractiveSeatPicker
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
