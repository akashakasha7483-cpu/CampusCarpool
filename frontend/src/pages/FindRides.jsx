import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Users,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Car,
  Compass,
  PlusCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List as ListIcon,
  Star,
} from '../components/Icons';
import { api } from '../api/client';
import RideCard from '../components/RideCard';
import RideComparisonTable from '../components/RideComparisonTable';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import { useAuth } from '../context/AuthContext';

export const FindRides = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [time, setTime] = useState(searchParams.get('time') || '');
  const [minSeats, setMinSeats] = useState(searchParams.get('minSeats') || '1');

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // View & Filter States
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'high-match' | 'multi-seat' | 'leaving-today'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [filterKeyword, setFilterKeyword] = useState('');

  const gridContainerRef = useRef(null);

  const executeSearch = async (paramsObj) => {
    setLoading(true);
    setError('');

    try {
      const res = await api.searchRides(paramsObj);
      if (res.success) {
        setRides(res.rides || []);
      }
    } catch (err) {
      setError(err.message || 'Error executing search');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = {
      source: searchParams.get('source') || '',
      destination: searchParams.get('destination') || '',
      date: searchParams.get('date') || '',
      time: searchParams.get('time') || '',
      minSeats: searchParams.get('minSeats') || '1',
    };

    setSource(currentParams.source);
    setDestination(currentParams.destination);
    setDate(currentParams.date);
    setTime(currentParams.time);
    setMinSeats(currentParams.minSeats);

    executeSearch(currentParams);
  }, [searchParams]);

  // Entrance animation on data update
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || loading) return;

    if (gridContainerRef.current) {
      gsap.fromTo(
        gridContainerRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [rides, activeTab, viewMode, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (source.trim()) params.source = source.trim();
    if (destination.trim()) params.destination = destination.trim();
    if (date.trim()) params.date = date.trim();
    if (time.trim()) params.time = time.trim();
    if (minSeats) params.minSeats = minSeats;

    setSearchParams(params);
  };

  const handleClear = () => {
    setSource('');
    setDestination('');
    setDate('');
    setTime('');
    setMinSeats('1');
    setSearchParams({});
    setActiveTab('all');
    setFilterKeyword('');
  };

  // Live KPI Statistics from Backend Data
  const totalRidesCount = rides.length;
  const totalAvailableSeats = useMemo(() => {
    return rides.reduce((acc, r) => acc + (r.availableSeats || 0), 0);
  }, [rides]);

  const highMatchCount = useMemo(() => {
    return rides.filter((r) => (r.compatibility?.score || 0) >= 75).length;
  }, [rides]);

  const multiSeatCount = useMemo(() => {
    return rides.filter((r) => (r.availableSeats || 0) >= 2).length;
  }, [rides]);

  // Filter Tabs & Keyword Filtering
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      // Tab filter
      if (activeTab === 'high-match' && (ride.compatibility?.score || 0) < 75) {
        return false;
      }
      if (activeTab === 'multi-seat' && (ride.availableSeats || 0) < 2) {
        return false;
      }
      if (activeTab === 'leaving-today') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (ride.date && !ride.date.startsWith(todayStr)) {
          return false;
        }
      }

      // Keyword filter
      if (filterKeyword.trim()) {
        const q = filterKeyword.toLowerCase();
        const src = (ride.source || '').toLowerCase();
        const dst = (ride.destination || '').toLowerCase();
        const drv = (ride.driver?.name || '').toLowerCase();
        const veh = (ride.vehicleModel || ride.vehicleType || '').toLowerCase();
        return src.includes(q) || dst.includes(q) || drv.includes(q) || veh.includes(q);
      }

      return true;
    });
  }, [rides, activeTab, filterKeyword]);

  const handleRequestSeat = (ride) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedRide(ride);
  };

  // Callback from InteractiveSeatPicker on confirmed booking
  const handleBookingSuccess = (msg, bookedRideId, seatsBooked) => {
    setSuccessToast(msg);
    if (bookedRideId && seatsBooked) {
      setRides((prev) =>
        prev.map((r) =>
          r._id === bookedRideId
            ? {
                ...r,
                availableSeats: Math.max(0, (r.availableSeats || 0) - seatsBooked),
              }
            : r
        )
      );
    }
    setTimeout(() => setSuccessToast(''), 6000);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Toast Notification */}
      {successToast && (
        <div
          className="alert alert-success"
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 9999,
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)',
            maxWidth: '440px',
          }}
        >
          <CheckCircle2 size={18} color="#10B981" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. CINEMATIC DIRECTORY HEADER                                */}
      {/* ============================================================ */}
      <div className="saas-page-header" style={{ marginBottom: '2rem' }}>
        <div className="saas-header-title-group">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.28)',
              color: '#60A5FA',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '0.4rem',
            }}
          >
            <Sparkles size={12} color="#8B5CF6" />
            <span>AI CORRIDOR MATCHING &bull; REAL-TIME TRANSIT</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 900, color: '#F8FAFC', margin: '0 0 0.35rem 0' }}>
            Campus Mobility Directory
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: 0 }}>
            Discover verified campus commutes with approximate Dice waypoint detection & atomic seat reservations.
          </p>
        </div>

        <div className="saas-header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/route-explorer" className="btn btn-secondary btn-sm" style={{ borderColor: 'rgba(59, 130, 246, 0.35)' }}>
            <Compass size={15} color="#38BDF8" /> 3D Route Map
          </Link>
          {isAuthenticated && (
            <Link to="/post-ride" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> + Post Campus Ride
            </Link>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 4-COLUMN SAAS KPI METRIC CARDS                            */}
      {/* ============================================================ */}
      <div className="saas-stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="saas-stat-card">
          <div className="saas-stat-header">
            <div className="saas-stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
              <Car size={18} />
            </div>
            <span className="saas-stat-pill" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#93C5FD' }}>
              Live Corridors
            </span>
          </div>
          <div className="saas-stat-value" style={{ color: '#F8FAFC' }}>{totalRidesCount}</div>
          <div className="saas-stat-label">Active Campus Rides</div>
        </div>

        <div className="saas-stat-card">
          <div className="saas-stat-header">
            <div className="saas-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <Users size={18} />
            </div>
            <span className="saas-stat-pill success">
              Available
            </span>
          </div>
          <div className="saas-stat-value" style={{ color: '#34D399' }}>{totalAvailableSeats}</div>
          <div className="saas-stat-label">Open Seats Ready</div>
        </div>

        <div className="saas-stat-card">
          <div className="saas-stat-header">
            <div className="saas-stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC' }}>
              <Sparkles size={18} />
            </div>
            <span className="saas-stat-pill" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#C084FC' }}>
              {highMatchCount} Top Matches
            </span>
          </div>
          <div className="saas-stat-value" style={{ color: '#60A5FA' }}>
            {totalRidesCount > 0 ? `${Math.round((highMatchCount / totalRidesCount) * 100)}%` : '100%'}
          </div>
          <div className="saas-stat-label">High Proximity Corridors</div>
        </div>

        <div className="saas-stat-card">
          <div className="saas-stat-header">
            <div className="saas-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
              <ShieldCheck size={18} />
            </div>
            <span className="saas-stat-pill success">100% Verified</span>
          </div>
          <div className="saas-stat-value" style={{ color: '#F8FAFC' }}>₹0 Fee</div>
          <div className="saas-stat-label">Direct Peer Cost Split</div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ELEVATED CORRIDOR SEARCH CONSOLE                         */}
      {/* ============================================================ */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          padding: '1.75rem',
          borderRadius: '20px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(7, 11, 20, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="#38BDF8" /> Pickup Location
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Silk Board, Metro, Gate 1"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="#C084FC" /> Destination
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Campus Main Gate"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} color="#38BDF8" /> Travel Date
              </label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="#C084FC" /> Approx Time
              </label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={14} color="#34D399" /> Seats Needed
              </label>
              <select
                className="form-control"
                value={minSeats}
                onChange={(e) => setMinSeats(e.target.value)}
              >
                <option value="1">1 Seat</option>
                <option value="2">2 Seats</option>
                <option value="3">3 Seats</option>
                <option value="4">4+ Seats</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(59, 130, 246, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#94A3B8' }}>
              <Sparkles size={14} color="#38BDF8" />
              <span>Includes fuzzy Dice bigram string matching on intermediate stops.</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {(source || destination || date || time || minSeats !== '1') && (
                <button type="button" onClick={handleClear} className="btn btn-secondary btn-sm">
                  <RotateCcw size={14} /> Reset
                </button>
              )}
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.55rem 1.4rem' }}>
                <Search size={15} /> Match Corridors
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SAAS FILTER TABS & DUAL VIEW SWITCHER                     */}
      {/* ============================================================ */}
      <div className="saas-filter-panel" style={{ marginBottom: '1.75rem' }}>
        <div className="saas-tabs-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Filter Tabs */}
          <div className="saas-tab-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`saas-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Corridors <span className="saas-tab-count">{totalRidesCount}</span>
            </button>
            <button
              type="button"
              className={`saas-tab-btn ${activeTab === 'high-match' ? 'active' : ''}`}
              onClick={() => setActiveTab('high-match')}
            >
              <Sparkles size={13} /> High Match (75%+) <span className="saas-tab-count">{highMatchCount}</span>
            </button>
            <button
              type="button"
              className={`saas-tab-btn ${activeTab === 'multi-seat' ? 'active' : ''}`}
              onClick={() => setActiveTab('multi-seat')}
            >
              <Users size={13} /> 2+ Seats Available <span className="saas-tab-count">{multiSeatCount}</span>
            </button>
            <button
              type="button"
              className={`saas-tab-btn ${activeTab === 'leaving-today' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaving-today')}
            >
              <Clock size={13} /> Today's Rides
            </button>
          </div>

          {/* Quick Keyword Search + View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Filter route, driver..."
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                className="aether-search-input"
                style={{
                  paddingLeft: '32px',
                  width: '210px',
                  height: '36px',
                  fontSize: '0.82rem',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '10px',
                  color: '#F8FAFC',
                }}
              />
              <Search
                size={14}
                color="#64748B"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* View Mode Switcher (Grid vs Table) */}
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(8, 13, 24, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '10px',
                padding: '3px',
                gap: '2px',
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`saas-tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
                style={{
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  background: viewMode === 'grid' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                  color: viewMode === 'grid' ? '#38BDF8' : '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                }}
                title="Grid Card View"
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`saas-tab-btn ${viewMode === 'table' ? 'active' : ''}`}
                style={{
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  background: viewMode === 'table' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                  color: viewMode === 'table' ? '#38BDF8' : '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                }}
                title="Comparison Table View"
              >
                <ListIcon size={14} /> Table
              </button>
            </div>
          </div>
        </div>

        {/* Counter Summary */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#94A3B8',
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div>
            Showing <strong style={{ color: '#F8FAFC' }}>{filteredRides.length}</strong> of{' '}
            <strong style={{ color: '#F8FAFC' }}>{totalRidesCount}</strong> corridor rides
            {filterKeyword && ` matching "${filterKeyword}"`}
          </div>
          <span className="saas-status-badge active" style={{ fontSize: '0.68rem' }}>
            <span className="saas-status-dot" /> Instant Atomic Booking Active
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. MAIN RESULTS: GRID OR COMPARISON TABLE                   */}
      {/* ============================================================ */}
      {loading ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '20px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              border: '3px solid rgba(59, 130, 246, 0.2)',
              borderTopColor: '#3B82F6',
              borderRadius: '50%',
              margin: '0 auto 1.25rem',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.4rem' }}>
            Scanning Campus Carpool Network...
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Evaluating waypoint approximations, driver schedules, and open seats.
          </p>
        </div>
      ) : filteredRides.length > 0 ? (
        viewMode === 'grid' ? (
          /* Grid View Mode */
          <div
            ref={gridContainerRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                onRequestSeat={handleRequestSeat}
                isCurrentUserDriver={user?._id === ride.driver?._id}
              />
            ))}
          </div>
        ) : (
          /* Comparison Table View Mode */
          <RideComparisonTable
            rides={filteredRides}
            onRequestSeat={handleRequestSeat}
            currentUserId={user?._id}
          />
        )
      ) : (
        /* Empty Results Fallback */
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(7, 11, 20, 0.95) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <Car size={48} color="#64748B" style={{ margin: '0 auto 1.25rem' }} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
            No Corridors Match Your Filters
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.75rem' }}>
            {filterKeyword || activeTab !== 'all'
              ? 'Try relaxing your filter criteria or clearing the search keyword.'
              : 'Be the first student to publish a ride along this corridor today!'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={handleClear} className="btn btn-secondary">
              <RotateCcw size={15} /> Reset Filters
            </button>
            <Link to="/post-ride" className="btn btn-primary">
              <PlusCircle size={15} /> Post a Ride
            </Link>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. INTERACTIVE SEAT PICKER MODAL                             */}
      {/* ============================================================ */}
      {selectedRide && (
        <InteractiveSeatPicker
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default FindRides;
