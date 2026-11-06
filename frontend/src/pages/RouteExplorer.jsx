import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Car,
  Zap,
  ChevronRight,
  Navigation,
} from '../components/Icons';
import { api } from '../api/client';
import RouteMap3D from '../components/map/RouteMap3D';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import { useAuth } from '../context/AuthContext';

export const RouteExplorer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingRide, setBookingRide] = useState(null);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [focusedWaypointIndex, setFocusedWaypointIndex] = useState(null);
  const [mobileView, setMobileView] = useState('map'); // 'list' | 'map'

  // Fetch active corridors
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const queryParams = {
          source: searchParams.get('source') || '',
          destination: searchParams.get('destination') || '',
        };
        let ridesList = [];
        const res = await api.searchRides(queryParams);
        if (res.success && res.rides && res.rides.length > 0) {
          ridesList = res.rides;
        } else {
          const allRes = await api.getActiveRides();
          if (allRes.success && allRes.rides) {
            ridesList = allRes.rides;
          }
        }
        setRides(ridesList);
        if (ridesList.length > 0) {
          const srcParam = searchParams.get('source');
          const destParam = searchParams.get('destination');
          const matched = ridesList.find(
            (r) =>
              (!srcParam || r.source.toLowerCase().includes(srcParam.toLowerCase())) &&
              (!destParam || r.destination.toLowerCase().includes(destParam.toLowerCase()))
          );
          setSelectedRide(matched || ridesList[0]);
        }
      } catch (err) {
        console.error('Error fetching route explorer rides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [searchParams]);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter rides based on search term and category tabs
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const matchSearch =
        searchTerm === '' ||
        ride.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ride.waypoints &&
          ride.waypoints.some((wp) => wp.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (ride.driver?.name &&
          ride.driver.name.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchSearch) return false;

      if (activeFilter === 'today') {
        return ride.date === todayStr;
      }
      if (activeFilter === 'multi-stop') {
        return ride.waypoints && ride.waypoints.length > 0;
      }
      if (activeFilter === 'car') {
        return (ride.vehicleType || 'Car').toLowerCase() === 'car';
      }
      if (activeFilter === 'bike') {
        return (
          (ride.vehicleType || '').toLowerCase() === 'bike' ||
          (ride.vehicleType || '').toLowerCase() === 'scooter'
        );
      }
      return true;
    });
  }, [rides, searchTerm, activeFilter, todayStr]);

  // Handle seat reservation success with in-place seat decrement
  const handleBookingSuccess = (msg, bookedRideId, seatsBooked = 1) => {
    setToast(msg);
    setTimeout(() => setToast(''), 5000);

    // Update availableSeats in-place
    setRides((prev) =>
      prev.map((r) => {
        if (r._id === bookedRideId) {
          const updatedSeats = Math.max(0, r.availableSeats - seatsBooked);
          return { ...r, availableSeats: updatedSeats };
        }
        return r;
      })
    );

    if (selectedRide && selectedRide._id === bookedRideId) {
      setSelectedRide((prev) => ({
        ...prev,
        availableSeats: Math.max(0, prev.availableSeats - seatsBooked),
      }));
    }
  };

  const handleOpenBooking = (ride) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/route-explorer' } } });
      return;
    }
    setBookingRide(ride);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '3rem' }}>
      {toast && (
        <div
          className="alert alert-success"
          style={{
            position: 'sticky',
            top: '80px',
            zIndex: 100,
            background: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Flight Control Dashboard Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1.25rem',
          marginBottom: '1.75rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              padding: '5px 14px',
              borderRadius: '999px',
              marginBottom: '0.75rem',
              letterSpacing: '0.05em',
            }}
          >
            <Compass size={14} />
            GEOSPATIAL FLIGHT CONTROL DECK &bull; 3D CORRIDORS
          </div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.025em',
              margin: '0 0 0.4rem 0',
            }}
          >
            Campus Transit Corridor Explorer
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.94rem', margin: 0, maxWidth: '640px' }}>
            Real-time road geometry, intermediate metro/bus transit stops, and live vehicle simulation across university commute corridors.
          </p>
        </div>

        {/* Corridor Metric Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '10px 18px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Corridors Online
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
              {rides.length} Routes
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Routing Engine
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
              OSRM 3D
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Corridors (${rides.length})` },
            { id: 'today', label: 'Leaving Today' },
            { id: 'multi-stop', label: 'Intermediate Stops' },
            { id: 'car', label: 'Cars' },
            { id: 'bike', label: 'Bikes / Scooters' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                background:
                  activeFilter === tab.id
                    ? 'rgba(59, 130, 246, 0.25)'
                    : 'rgba(15, 23, 42, 0.65)',
                border:
                  activeFilter === tab.id
                    ? '1.5px solid #3b82f6'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeFilter === tab.id ? '#60a5fa' : '#94a3b8',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search pickup, stops or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '999px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Mobile Screen View Switcher (< 960px) */}
      <div
        className="mobile-view-toggle"
        style={{
          display: 'none',
          marginBottom: '1rem',
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '12px',
          padding: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          onClick={() => setMobileView('list')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            background: mobileView === 'list' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
            border: mobileView === 'list' ? '1px solid #3b82f6' : 'none',
            color: mobileView === 'list' ? '#60a5fa' : '#94a3b8',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          📋 Corridors ({filteredRides.length})
        </button>
        <button
          onClick={() => setMobileView('map')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            background: mobileView === 'map' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
            border: mobileView === 'map' ? '1px solid #8b5cf6' : 'none',
            color: mobileView === 'map' ? '#c084fc' : '#94a3b8',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          🗺️ 3D Flight Map
        </button>
      </div>

      {/* Main Grid: Left Corridor Selector Dossier / Right 3D Map */}
      <div
        className="route-explorer-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 460px) 1fr',
          gap: '1.75rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Corridor List & Detailed Dossier */}
        <div
          className={`route-explorer-list-col ${mobileView === 'map' ? 'hide-mobile' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxHeight: 'calc(100vh - 180px)',
            overflowY: 'auto',
            paddingRight: '6px',
          }}
        >
          {loading ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                color: '#94a3b8',
                borderRadius: '20px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid #3b82f6',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  margin: '0 auto 1rem auto',
                  animation: 'spin 1s linear infinite',
                }}
              />
              Loading active campus transit corridors...
            </div>
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride) => {
              const isSelected = selectedRide?._id === ride._id;
              const isDriver = user?._id === ride.driver?._id;
              const isFull = ride.availableSeats === 0;

              return (
                <div
                  key={ride._id}
                  onClick={() => {
                    setSelectedRide(ride);
                    setFocusedWaypointIndex(null);
                  }}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    padding: '1.25rem',
                    borderRadius: '20px',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))'
                      : 'rgba(15, 23, 42, 0.65)',
                    border: isSelected
                      ? '1.5px solid #3b82f6'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected
                      ? '0 0 24px rgba(59, 130, 246, 0.25), 0 10px 30px rgba(0, 0, 0, 0.5)'
                      : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Top Bar: Driver Pill + Price */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
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
                          {ride.driver?.name || 'Verified Student'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {ride.vehicleType || 'Car'} &bull; {ride.vehicleModel || 'Campus Verified'}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: '#38bdf8',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        ₹{ride.pricePerSeat}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>
                        per seat
                      </span>
                    </div>
                  </div>

                  {/* Route Corridor Arrow */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        color: '#f8fafc',
                      }}
                    >
                      <span style={{ color: '#10b981' }}>{ride.source}</span>
                      <ArrowRight size={14} color="#3b82f6" />
                      <span style={{ color: '#38bdf8' }}>{ride.destination}</span>
                    </div>
                  </div>

                  {/* Intermediate Stops Tag Ribbon */}
                  {ride.waypoints && ride.waypoints.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        marginBottom: '0.85rem',
                      }}
                    >
                      {ride.waypoints.map((wp, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRide(ride);
                            setFocusedWaypointIndex(idx + 1);
                          }}
                          style={{
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fbbf24',
                            borderRadius: '999px',
                            padding: '2px 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          title={`Click to focus map camera on Stop ${idx + 1}: ${wp}`}
                        >
                          Stop {idx + 1}: {wp}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Schedule & Capacity Ribbon */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem',
                      color: '#94a3b8',
                      paddingTop: '0.65rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} color="#38bdf8" /> {ride.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="#38bdf8" /> {ride.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={13} color="#10b981" />
                      <span style={{ fontWeight: 800, color: isFull ? '#ef4444' : '#10b981' }}>
                        {isFull ? 'Full' : `${ride.availableSeats} seat${ride.availableSeats > 1 ? 's' : ''} open`}
                      </span>
                    </div>
                  </div>

                  {/* Selected Corridor Action Button */}
                  {isSelected && (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px dashed rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(ride);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: isFull
                            ? 'rgba(255, 255, 255, 0.08)'
                            : isDriver
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          cursor: isFull || isDriver ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isFull || isDriver}
                      >
                        {isDriver ? (
                          'You are the Host Driver'
                        ) : isFull ? (
                          'Corridor Fully Booked'
                        ) : (
                          <>
                            <Zap size={14} /> Reserve Seat on this Route &rarr;
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', borderRadius: '20px' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 1rem 0' }}>No active corridors found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="btn btn-secondary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Next-Gen 3D Map Flight Control Deck */}
        <div
          className={`route-explorer-map-col ${mobileView === 'list' ? 'hide-mobile' : ''}`}
          style={{
            height: 'calc(100vh - 180px)',
            minHeight: '620px',
            position: 'sticky',
            top: '90px',
          }}
        >
          <RouteMap3D
            selectedRide={selectedRide}
            focusedWaypointIndex={focusedWaypointIndex}
          />
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

export default RouteExplorer;
