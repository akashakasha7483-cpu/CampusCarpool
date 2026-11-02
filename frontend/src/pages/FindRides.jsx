import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from '../components/Icons';
import { api } from '../api/client';
import RideCard from '../components/RideCard';
import InteractiveSeatPicker from '../components/InteractiveSeatPicker';
import { useAuth } from '../context/AuthContext';

const FindRides = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

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
  };

  return (
    <div>
      {successToast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 90 }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Find Compatible Campus Rides
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Intelligent approximate route matching discovers rides along your way, including intermediate stops.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#10b981" /> Pickup Location
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Silk Board, Electronic City"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#1e3a8a" /> Destination
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
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="#10b981" /> Travel Date
              </label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} color="#10b981" /> Approx Time
              </label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={14} color="#10b981" /> Seats Needed
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            {(source || destination || date || time || minSeats !== '1') && (
              <button type="button" onClick={handleClear} className="btn btn-secondary btn-sm">
                <RotateCcw size={14} /> Clear Filters
              </button>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
              <Search size={16} /> Filter & Match Rides
            </button>
          </div>
        </form>
      </div>

      {/* Info Pill on Algorithm */}
      <div
        style={{
          background: 'linear-gradient(90deg, #ecfdf5 0%, #eff6ff 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.86rem',
          color: '#1e293b',
        }}
      >
        <Sparkles size={18} color="#059669" style={{ flexShrink: 0 }} />
        <div>
          <strong>Intelligent Matching Active:</strong> Scoring is calculated using location bigram dice
          coefficient, waypoint proximity detection, and time window differences. Click on any{' '}
          <span style={{ color: '#059669', fontWeight: 700 }}>&ldquo;% Match&rdquo;</span> badge to see the detailed breakdown.
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
          {loading ? 'Searching rides...' : `Found ${rides.length} matching ride(s)`}
        </p>
      </div>

      {/* Rides Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p>Running intelligent route matching algorithm...</p>
        </div>
      ) : rides.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {rides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              onRequestSeat={(r) => setSelectedRide(r)}
              isCurrentUserDriver={user?._id === ride.driver?._id}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Search size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            No Matching Rides Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Try searching for broader landmarks (e.g. &ldquo;Metro&rdquo;, &ldquo;Silk Board&rdquo;, or &ldquo;Campus&rdquo;)
            or clearing the time filter.
          </p>
          <button onClick={handleClear} className="btn btn-secondary">
            View All Open Campus Rides
          </button>
        </div>
      )}

      {/* Interactive Seat Picker */}
      {selectedRide && (
        <InteractiveSeatPicker
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onSuccess={(msg) => {
            setSuccessToast(msg);
            setTimeout(() => setSuccessToast(''), 5000);
            // Refresh list
            executeSearch({
              source,
              destination,
              date,
              time,
              minSeats,
            });
          }}
        />
      )}
    </div>
  );
};

export default FindRides;
