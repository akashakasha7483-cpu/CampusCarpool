import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
} from '../components/Icons';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const QUICK_LANDMARKS = [
  'Silk Board',
  'HSR Layout',
  'Koramangala',
  'Whitefield',
  'Indiranagar',
  'Electronic City',
  'Marathahalli',
  'Bellandur',
];

export const PostRide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split('T')[0];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    source: '',
    destination: 'Campus Main Gate',
    waypoints: [''],
    date: defaultDateStr,
    time: '08:30',
    seatsTotal: 3,
    pricePerSeat: 30,
    vehicleType: user?.vehicleInfo?.vehicleType !== 'None' ? user?.vehicleInfo?.vehicleType || 'Car' : 'Car',
    vehicleModel: user?.vehicleInfo?.model || '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-sync vehicle info if profile updates
  useEffect(() => {
    if (user?.vehicleInfo && user.vehicleInfo.vehicleType !== 'None') {
      setFormData((prev) => ({
        ...prev,
        vehicleType: user.vehicleInfo.vehicleType,
        vehicleModel: prev.vehicleModel || user.vehicleInfo.model || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWaypointChange = (index, value) => {
    const updated = [...formData.waypoints];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, waypoints: updated }));
  };

  const addWaypoint = () => {
    if (formData.waypoints.length < 5) {
      setFormData((prev) => ({ ...prev, waypoints: [...prev.waypoints, ''] }));
    }
  };

  const removeWaypoint = (index) => {
    const updated = formData.waypoints.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, waypoints: updated }));
  };

  const handleQuickSource = (landmark) => {
    setFormData((prev) => ({ ...prev, source: landmark }));
  };

  const handleQuickDate = (dStr) => {
    setFormData((prev) => ({ ...prev, date: dStr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.source.trim() || !formData.destination.trim()) {
      setError('Please provide pickup origin and destination.');
      setCurrentStep(1);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        waypoints: formData.waypoints.map((w) => w.trim()).filter(Boolean),
        date: formData.date,
        time: formData.time,
        seatsTotal: parseInt(formData.seatsTotal, 10),
        pricePerSeat: parseFloat(formData.pricePerSeat),
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel.trim(),
        notes: formData.notes.trim(),
      };

      const res = await api.postRide(payload);
      if (res.success) {
        navigate('/my-rides', {
          state: { message: 'Transit corridor published successfully! You can now receive passenger requests.' },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to publish corridor');
    } finally {
      setLoading(false);
    }
  };

  const totalPotentialOffset = useMemo(() => {
    return (formData.seatsTotal || 0) * (formData.pricePerSeat || 0);
  }, [formData.seatsTotal, formData.pricePerSeat]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
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
          <Zap size={14} />
          HOST DRIVER CORRIDOR DISPATCHER
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', margin: '0 0 0.4rem 0' }}>
          Publish Campus Transit Corridor
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.94rem', margin: 0 }}>
          Offer empty seats along your daily university commute, split fuel costs, and help fellow students travel safely.
        </p>
      </div>

      {error && (
        <div
          className="alert alert-danger"
          style={{
            marginBottom: '1.5rem',
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#ffffff',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Step Indicator Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '8px 16px',
          marginBottom: '2rem',
        }}
      >
        {[
          { num: 1, title: 'Corridor & Stops' },
          { num: 2, title: 'Schedule & Seats' },
          { num: 3, title: 'Vehicle & Fuel Split' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentStep === s.num ? '#38bdf8' : currentStep > s.num ? '#10b981' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: currentStep === s.num ? '#38bdf8' : currentStep > s.num ? '#10b981' : 'rgba(255,255,255,0.1)',
                color: currentStep === s.num || currentStep > s.num ? '#070b14' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              {s.num}
            </span>
            {s.title}
          </button>
        ))}
      </div>

      {/* Main Grid: Form Steps + Live Summary Blueprint */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(320px, 380px)', gap: '2rem', alignItems: 'start' }}>
        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Corridor & Stops */}
          {currentStep === 1 && (
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 1.25rem 0' }}>
                Step 1: Commute Origin & Waypoints
              </h3>

              {/* Source Input */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                  Departure Point / Pickup Origin
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g. Silk Board Junction, HSR Layout"
                />

                {/* Quick Landmark Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, alignSelf: 'center' }}>
                    Quick Hubs:
                  </span>
                  {QUICK_LANDMARKS.map((lm) => (
                    <button
                      key={lm}
                      type="button"
                      onClick={() => handleQuickSource(lm)}
                      style={{
                        background: formData.source === lm ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                        border: formData.source === lm ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: formData.source === lm ? '#60a5fa' : '#94a3b8',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {lm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Waypoints Builder */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>
                    Intermediate Transit Waypoints (Optional, max 5)
                  </label>
                  {formData.waypoints.length < 5 && (
                    <button
                      type="button"
                      onClick={addWaypoint}
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.35)',
                        color: '#38bdf8',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Add Stop
                    </button>
                  )}
                </div>

                {formData.waypoints.map((wp, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={wp}
                      onChange={(e) => handleWaypointChange(idx, e.target.value)}
                      className="form-input"
                      placeholder={`Stop #${idx + 1} (e.g. Metro Station, Bus Shelter)`}
                    />
                    <button
                      type="button"
                      onClick={() => removeWaypoint(idx)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '0 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Destination Input */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                  Destination / Drop-off Point
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g. Campus Main Gate"
                />
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Proceed to Schedule & Capacity &rarr;
              </button>
            </div>
          )}

          {/* Step 2: Schedule & Capacity */}
          {currentStep === 2 && (
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 1.25rem 0' }}>
                Step 2: Commute Schedule & Available Seats
              </h3>

              {/* Travel Date */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>
                    Travel Date
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleQuickDate(todayStr)}
                      style={{
                        background: formData.date === todayStr ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: formData.date === todayStr ? '#60a5fa' : '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDate(defaultDateStr)}
                      style={{
                        background: formData.date === defaultDateStr ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: formData.date === defaultDateStr ? '#60a5fa' : '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Departure Time */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                  Departure Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Total Seats Offered */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                  Seats Offered: <strong style={{ color: '#38bdf8' }}>{formData.seatsTotal} Passenger Seats</strong>
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, seatsTotal: num }))}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '12px',
                        background: formData.seatsTotal === num ? 'rgba(59, 130, 246, 0.3)' : 'rgba(15, 23, 42, 0.8)',
                        border: formData.seatsTotal === num ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: formData.seatsTotal === num ? '#60a5fa' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Proceed to Vehicle & Fuel Split &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Specs & Fuel Contribution */}
          {currentStep === 3 && (
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 1.25rem 0' }}>
                Step 3: Vehicle Specs & Fuel Share
              </h3>

              {/* Vehicle Type Toggle */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  Commute Vehicle
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {['Car', 'Bike', 'Scooter'].map((vt) => (
                    <button
                      key={vt}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, vehicleType: vt }))}
                      style={{
                        padding: '10px',
                        borderRadius: '12px',
                        background: formData.vehicleType === vt ? 'rgba(59, 130, 246, 0.3)' : 'rgba(15, 23, 42, 0.8)',
                        border: formData.vehicleType === vt ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: formData.vehicleType === vt ? '#60a5fa' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {vt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Model */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Honda City i-VTEC, Royal Enfield"
                />
              </div>

              {/* Fuel Contribution per Seat */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                  Shared Fuel Contribution: <strong style={{ color: '#38bdf8' }}>₹{formData.pricePerSeat} per passenger</strong>
                </label>
                <input
                  type="range"
                  name="pricePerSeat"
                  min="0"
                  max="150"
                  step="5"
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                  <span>₹0 (Free / Goodwill)</span>
                  <span>₹30 (Recommended campus avg)</span>
                  <span>₹150 (Long corridor)</span>
                </div>
              </div>

              {/* Driver Notes */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                  Commute Notes for Passengers
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="form-input"
                  placeholder="e.g. Leaving on time from metro exit 2, boot space available for backpacks."
                  maxLength={250}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.35)',
                  }}
                >
                  {loading ? 'Publishing Corridor...' : 'Publish Transit Corridor Now &rarr;'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Right Column: Live Corridor Blueprint Preview */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
            border: '1.5px solid rgba(59, 130, 246, 0.35)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.12)',
            position: 'sticky',
            top: '90px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
              Live Corridor Preview
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: 800,
              }}
            >
              Ready to Publish
            </span>
          </div>

          {/* Route Arrow */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
              <span style={{ color: '#10b981' }}>{formData.source || 'Pickup Point'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0', color: '#3b82f6' }}>
                <ArrowRight size={14} />
              </div>
              <span style={{ color: '#38bdf8' }}>{formData.destination}</span>
            </div>

            {formData.waypoints.filter(Boolean).length > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                Stops: {formData.waypoints.filter(Boolean).join(' &bull; ')}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              fontSize: '0.8rem',
              color: '#94a3b8',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '0.85rem',
            }}
          >
            <span>
              <Calendar size={13} color="#38bdf8" /> {formData.date}
            </span>
            <span>
              <Clock size={13} color="#38bdf8" /> {formData.time}
            </span>
            <span>
              <Users size={13} color="#10b981" /> {formData.seatsTotal} seats
            </span>
          </div>

          {/* Vehicle & Fare Offset Box */}
          <div
            style={{
              background: 'rgba(7, 11, 20, 0.8)',
              borderRadius: '16px',
              padding: '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Vehicle Specs:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                {formData.vehicleModel || `${formData.vehicleType} Registered`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Max Potential Offset:</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>
                ₹{totalPotentialOffset}
              </span>
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: 0 }}>
            Geographic coordinates for your origin, stops, and campus destination are automatically resolved via our road network engine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostRide;
