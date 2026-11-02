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
  Zap,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  PieChart,
  Bell,
  Globe,
  Activity,
  Layers,
  ChevronDown,
  Clock,
  MapPin,
  Calendar,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import VehicleCanvas3D from '../components/3d/VehicleCanvas3D';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    myRidesCount: 0,
    myRequestsCount: 0,
    receivedPendingCount: 0,
  });
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('Weekly');
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

  const userVehicleType =
    user?.vehicleInfo?.vehicleType && user.vehicleInfo.vehicleType !== 'None'
      ? user.vehicleInfo.vehicleType
      : 'Car';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-rides?source=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/find-rides');
    }
  };

  return (
    <div className="aether-dashboard-container">
      {/* Soft Ambient Neon Glows matching Dribbble reference */}
      <div className="aether-glow-backdrop" />

      {/* Success Toast */}
      {successToast && (
        <div
          className="alert alert-success"
          style={{ position: 'sticky', top: '80px', zIndex: 100, marginBottom: '1.5rem' }}
        >
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main 3-Column Glassmorphism Architecture */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(250px, 280px) 1fr minmax(250px, 280px)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ============================================================ */}
        {/* 1. LEFT AUXILIARY COLUMN                                      */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: MRR / Total Commute Savings */}
          <div className="aether-glass-card aether-glass-card-glow-green" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                COMMUTE SAVINGS (MRR)
              </span>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <TrendingUp size={11} /> +18.4%
              </div>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              ₹14,850
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px', marginBottom: '1.25rem' }}>
              vs ₹12,540 last semester
            </p>

            {/* Glowing Neon Area Sparkline Chart */}
            <div style={{ width: '100%', height: '70px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 240 70" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,55 Q30,60 60,40 T120,45 T180,20 T240,10 L240,70 L0,70 Z"
                  fill="url(#mrrGrad)"
                />
                <path
                  d="M0,55 Q30,60 60,40 T120,45 T180,20 T240,10"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="2.5"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.8))' }}
                />
                <circle cx="240" cy="10" r="4" fill="#ffffff" stroke="#00ff88" strokeWidth="2" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: '#64748b' }}>
              <span>Updated 2m ago</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>Live Sync</span>
            </div>
          </div>

          {/* Card 2: System Health / Student Safety Radial Gauge */}
          <div className="aether-glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                SAFETY & TRUST SCORE
              </span>
              <ShieldCheck size={16} color="#10b981" />
            </div>

            {/* Circular Progress Gauge */}
            <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1.25rem' }}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r="52"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="10"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="52"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="10"
                  strokeDasharray="326"
                  strokeDashoffset="8"
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.8))' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
                  98.6%
                </span>
                <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                  OPTIMAL
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#34d399',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '0.74rem',
                fontWeight: 800,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
              All Systems Operational
            </div>
          </div>

          {/* Card 3: Quick Navigation Shortcuts & Upgrade CTA */}
          <div
            className="aether-glass-card aether-glass-card-glow-purple"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(180deg, rgba(23, 20, 48, 0.85) 0%, rgba(13, 17, 34, 0.9) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                }}
              >
                <Zap size={16} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                Instant Ride Match
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Automated waypoint detection matches peer student routes with up to 95% corridor accuracy.
            </p>
            <Link
              to="/post-ride"
              className="btn btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                fontSize: '0.84rem',
                borderRadius: '12px',
              }}
            >
              Post A Ride Now <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. CENTER MAIN CONSOLE (The Main Dribbble Board)             */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Console Bar: Logo + Search + Date Filters + User Profile */}
          <div
            className="aether-glass-card"
            style={{
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Brand Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Car size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  CampusCarpool
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 800, letterSpacing: '0.04em' }}>
                  SMART MOBILITY ANALYTICS
                </span>
              </div>
            </div>

            {/* Global Search Bar with ⌘K Badge */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: '1 1 240px', maxWidth: '340px' }}>
              <Search
                size={15}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="aether-search-input"
                placeholder="Search corridors, stops, rides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', maxWidth: '100%' }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  color: '#94a3b8',
                  fontWeight: 700,
                }}
              >
                ⌘K
              </span>
            </form>

            {/* User Profile Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <Bell size={16} />
                {stats.receivedPendingCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 8px #ef4444',
                    }}
                  >
                    {stats.receivedPendingCount}
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(8, 13, 24, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  padding: '4px 12px 4px 6px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    color: '#062619',
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                    {user?.name || 'AKASH M R'}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>
                    ID: {user?.studentId || '2102508522'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Nav Pill Tabs + Filters */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Overview', 'Hosted Rides', 'Seat Requests', '3D Corridors', 'Garage'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'Hosted Rides') navigate('/my-rides');
                    if (tab === 'Seat Requests') navigate('/my-requests');
                    if (tab === '3D Corridors') navigate('/route-explorer');
                    if (tab === 'Garage') navigate('/garage');
                  }}
                  className={`aether-nav-pill ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab === 'Overview' && <Activity size={14} />}
                  {tab === 'Hosted Rides' && <Car size={14} />}
                  {tab === 'Seat Requests' && <Send size={14} />}
                  {tab === '3D Corridors' && <Compass size={14} />}
                  {tab === 'Garage' && <Layers size={14} />}
                  <span>{tab}</span>
                </button>
              ))}
            </div>

            {/* Time Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: 'rgba(8, 13, 24, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Calendar size={13} color="#10b981" />
                <span>Semester Autumn 2026</span>
              </div>
              <div
                style={{
                  background: 'rgba(8, 13, 24, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setTimeFilter(timeFilter === 'Weekly' ? 'Daily' : 'Weekly')}
              >
                <span>{timeFilter}</span>
                <ChevronDown size={12} />
              </div>
            </div>
          </div>

          {/* Row 1: 4 Key Metric Glass Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Metric 1 */}
            <div className="aether-glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Total Savings
                </span>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  ₹
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                ₹48.2K
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                <TrendingUp size={11} /> +12.6% <span style={{ color: '#64748b', fontWeight: 500 }}>vs ₹42.8K last month</span>
              </div>
              {/* Mini Sparkline */}
              <div style={{ marginTop: '0.75rem', height: '24px' }}>
                <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0,20 Q20,15 40,18 T70,8 T100,4" fill="none" stroke="#38bdf8" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="aether-glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Campus Commuters
                </span>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                  <Users size={14} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                18,642
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                <TrendingUp size={11} /> +8.4% <span style={{ color: '#64748b', fontWeight: 500 }}>vs 17,185 last term</span>
              </div>
              <div style={{ marginTop: '0.75rem', height: '24px' }}>
                <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0,18 Q30,22 50,14 T80,10 T100,5" fill="none" stroke="#00ff88" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="aether-glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Hosted Rides
                </span>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                  <Car size={14} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                {user?.ridesHosted ?? stats.myRidesCount}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                <TrendingUp size={11} /> +5.3% <span style={{ color: '#64748b', fontWeight: 500 }}>verified trips</span>
              </div>
              <div style={{ marginTop: '0.75rem', height: '24px' }}>
                <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0,22 Q25,12 50,18 T75,6 T100,3" fill="none" stroke="#c084fc" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="aether-glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Seat Fill Efficiency
                </span>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
                  <Zap size={14} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                84.6%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                <TrendingUp size={11} /> +6.7% <span style={{ color: '#64748b', fontWeight: 500 }}>vs 78.2% avg</span>
              </div>
              <div style={{ marginTop: '0.75rem', height: '24px' }}>
                <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0,19 Q30,16 60,10 T85,14 T100,2" fill="none" stroke="#fb7185" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: Dual Main Area Mountain Charts & Mode Share Donut */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Chart 1: Revenue / Cost Offset Overview */}
            <div className="aether-glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Commute Cost Offset
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc' }}>₹48.2M</span>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800 }}>+12.6%</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  Peak: ₹4.81K
                </div>
              </div>

              {/* Glowing Mountain Area Chart */}
              <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 320 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartTealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#064e3b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#080d18" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="35" x2="320" y2="35" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
                  <line x1="0" y1="70" x2="320" y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
                  <line x1="0" y1="105" x2="320" y2="105" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />

                  {/* Gradient Area */}
                  <path
                    d="M0,120 Q40,110 80,75 T160,85 T240,40 T320,25 L320,140 L0,140 Z"
                    fill="url(#chartTealGrad)"
                  />
                  {/* Wave Line */}
                  <path
                    d="M0,120 Q40,110 80,75 T160,85 T240,40 T320,25"
                    fill="none"
                    stroke="#00ff88"
                    strokeWidth="3"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.7))' }}
                  />
                  <circle cx="240" cy="40" r="5" fill="#ffffff" stroke="#00ff88" strokeWidth="2" />
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: '6px' }}>
                <span>Nov 02</span>
                <span>Nov 09</span>
                <span>Nov 16</span>
                <span>Nov 23</span>
                <span>Nov 30</span>
              </div>
            </div>

            {/* Chart 2: Top Commute Channels Donut */}
            <div className="aether-glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Commute Mode Share
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>View All</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Donut Visualizer */}
                <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#38bdf8" strokeWidth="12" strokeDasharray="128 150" strokeDashoffset="0" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#00ff88" strokeWidth="12" strokeDasharray="78 200" strokeDashoffset="-128" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#fbbf24" strokeWidth="12" strokeDasharray="42 235" strokeDashoffset="-206" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#c084fc" strokeWidth="12" strokeDasharray="28 250" strokeDashoffset="-248" />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total</span>
                    <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>124.6K</strong>
                  </div>
                </div>

                {/* Legend List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                      Electric Car
                    </span>
                    <strong style={{ color: '#f8fafc' }}>46.2%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88' }} />
                      Carpool Shared
                    </span>
                    <strong style={{ color: '#f8fafc' }}>28.1%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
                      College Shuttle
                    </span>
                    <strong style={{ color: '#f8fafc' }}>15.3%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc' }} />
                      EV Scooter
                    </span>
                    <strong style={{ color: '#f8fafc' }}>10.4%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Two Data Tables / Feed Panels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Table 1: Top Performing Campus Corridors */}
            <div className="aether-glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Top Campus Corridors
                </span>
                <Link to="/find-rides" style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  View All Rides &rarr;
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="aether-table">
                  <thead>
                    <tr>
                      <th>Route Corridor</th>
                      <th>Fare</th>
                      <th>Open Seats</th>
                      <th>Fill Rate</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRides.slice(0, 4).map((ride, idx) => (
                      <tr key={ride._id || idx}>
                        <td>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>
                            {ride.source.split(' ')[0]} &rarr; {ride.destination.split(' ')[0]}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {ride.driver?.name || 'Fellow Student'} &bull; {ride.vehicleType || 'Car'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800, color: '#34d399' }}>₹{ride.pricePerSeat}</td>
                        <td>{ride.availableSeats} of {ride.seatsTotal}</td>
                        <td>
                          <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                            {Math.round(((ride.seatsTotal - ride.availableSeats) / ride.seatsTotal) * 100)}%
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedRide(ride)}
                            className="btn btn-outline-green"
                            style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '8px' }}
                          >
                            Book Seat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Live Ride Activity Feed */}
            <div className="aether-glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Live Ride Activity & Approvals
                </span>
                <Link to="/received-requests" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  Manage ({stats.receivedPendingCount}) &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                        Pending Seat Approvals
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {stats.receivedPendingCount} passenger requests waiting in queue
                      </span>
                    </div>
                  </div>
                  <Link to="/received-requests" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                    Review
                  </Link>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                        3D Smart Corridor Synchronization
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        Silk Board &bull; HSR Layout &bull; Campus Gate
                      </span>
                    </div>
                  </div>
                  <Link to="/route-explorer" className="btn btn-outline-green btn-sm" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                    Map
                  </Link>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc', boxShadow: '0 0 8px #c084fc' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                        Verified Student Badge Active
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        Trust Rating: {user?.rating || '4.8'}/5.0 &bull; Akash M R
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 800 }}>
                    100% Legit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. RIGHT AUXILIARY COLUMN                                     */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Live Users / Active Commuters with Audio Equalizer Bars */}
          <div className="aether-glass-card aether-glass-card-glow-green" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                LIVE COMMUTERS
              </span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                2,476
              </div>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                +23.6%
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', marginBottom: '1.25rem' }}>
              Active right now across campus corridors
            </p>

            {/* Glowing Soundwave / Frequency Equalizer Bars (Dribbble Visual Parity) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '42px',
                padding: '4px 8px',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              {[12, 24, 18, 36, 28, 40, 20, 32, 16, 28, 38, 22, 34, 14, 26, 36].map((h, i) => (
                <div
                  key={i}
                  className="eq-bar"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                    animationDuration: `${1.2 + (i % 4) * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 2: Global / Campus Corridor Reach Breakdown */}
          <div className="aether-glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                CORRIDOR REACH
              </span>
              <Globe size={15} color="#38bdf8" />
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '1rem' }}>
              Top Transit Junctions
            </p>

            {/* Mini Geographic Hub Distribution */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
              {[
                { name: 'Koramangala Sony World', pct: '32.6%', color: '#00ff88' },
                { name: 'Silk Board Junction', pct: '28.2%', color: '#38bdf8' },
                { name: 'HSR Layout 5th Sector', pct: '18.4%', color: '#fbbf24' },
                { name: 'Indiranagar 100ft Road', pct: '12.8%', color: '#c084fc' },
                { name: 'Electronic City Phase 1', pct: '8.0%', color: '#fb7185' },
              ].map((hub) => (
                <div key={hub.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: hub.color }} />
                    {hub.name}
                  </span>
                  <span style={{ fontWeight: 800, color: '#f8fafc' }}>{hub.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: 3D Vehicle Garage Preview */}
          <div className="aether-glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                VEHICLE GARAGE
              </span>
              <Link to="/garage" style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>
                Garage &rarr;
              </Link>
            </div>

            <div style={{ width: '100%', height: '170px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
              <VehicleCanvas3D
                vehicleType={userVehicleType}
                color="#10b981"
                autoRotate={true}
                interactive={false}
                height="170px"
                cameraDistance={4.2}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>
                {user?.vehicleInfo?.model || 'Cyber Electric Car'}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#34d399', display: 'block' }}>
                Zero Emissions &bull; Shared Mobility
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Seat Picker Modal */}
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
