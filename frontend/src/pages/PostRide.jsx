import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Car,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
} from '../components/Icons';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const PostRide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    source: '',
    destination: 'Campus Main Gate',
    waypoints: [''],
    date: defaultDateStr,
    time: '08:30',
    seatsTotal: 3,
    pricePerSeat: 30,
    vehicleType: user?.vehicleInfo?.vehicleType !== 'None' ? user?.vehicleInfo?.vehicleType : 'Car',
    vehicleModel: user?.vehicleInfo?.model || '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.source.trim() || !formData.destination.trim()) {
      setError('Please provide pickup and destination locations.');
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
          state: { message: 'Ride successfully posted! You can now manage passenger requests.' },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  // Preset quick route fill
  const handleFillQuickRoute = (preset) => {
    if (preset === 'silkboard') {
      setFormData((prev) => ({
        ...prev,
        source: 'Silk Board Junction',
        destination: 'Campus Main Gate',
        waypoints: ['HSR Layout 5th Sector', 'Koramangala Sony World'],
        pricePerSeat: 35,
        notes: 'AC car, leaving on time. Light music and smooth ride.',
      }));
    } else if (preset === 'whitefield') {
      setFormData((prev) => ({
        ...prev,
        source: 'Whitefield TTMC',
        destination: 'Campus Engineering Block',
        waypoints: ['Marathahalli Bridge', 'HAL Main Gate'],
        pricePerSeat: 40,
        notes: 'Commuting daily for 9:00 AM lab sessions.',
      }));
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '1rem auto 3rem' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Post a Ride Offer
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Share your daily commute with students along your route and reduce petrol expenses.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center' }}>Quick routes:</span>
          <button
            type="button"
            onClick={() => handleFillQuickRoute('silkboard')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            <Sparkles size={12} color="#10b981" /> Silk Board &rarr; Campus
          </button>
          <button
            type="button"
            onClick={() => handleFillQuickRoute('whitefield')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            <Sparkles size={12} color="#1e3a8a" /> Whitefield &rarr; Campus
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '2.25rem' }}>
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Pickup and Destination */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#10b981" /> Starting Point (Source) *
              </label>
              <input
                type="text"
                name="source"
                className="form-control"
                placeholder="e.g. Silk Board Junction / Electronic City"
                value={formData.source}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#1e3a8a" /> Destination *
              </label>
              <input
                type="text"
                name="destination"
                className="form-control"
                placeholder="e.g. Campus Main Gate"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Intermediate Stops (Waypoints) */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Intermediate Waypoints / Stops along Route
                </label>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Enables intelligent route matching for students boarding mid-way
                </p>
              </div>
              {formData.waypoints.length < 5 && (
                <button
                  type="button"
                  onClick={addWaypoint}
                  className="btn btn-outline-green btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Plus size={13} /> Add Stop
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {formData.waypoints.map((wp, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', width: '22px' }}>
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`e.g. Stop ${index + 1} (HSR Layout, Metro, etc.)`}
                    value={wp}
                    onChange={(e) => handleWaypointChange(index, e.target.value)}
                  />
                  {formData.waypoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWaypoint(index)}
                      style={{ color: '#ef4444', padding: '0.4rem' }}
                      title="Remove Stop"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="#10b981" /> Travel Date *
              </label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} color="#10b981" /> Departure Time *
              </label>
              <input
                type="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Seats and Pricing */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={14} color="#10b981" /> Available Seats (1-8) *
              </label>
              <select
                name="seatsTotal"
                className="form-control"
                value={formData.seatsTotal}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Seat' : 'Seats'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <IndianRupee size={14} color="#059669" /> Price Contribution per Seat (₹) *
              </label>
              <input
                type="number"
                name="pricePerSeat"
                className="form-control"
                min="0"
                max="500"
                value={formData.pricePerSeat}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Vehicle Type and Model */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select
                name="vehicleType"
                className="form-control"
                value={formData.vehicleType}
                onChange={handleChange}
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike (Pillion)</option>
                <option value="Scooter">Scooter</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Model (Optional)</label>
              <input
                type="text"
                name="vehicleModel"
                className="form-control"
                placeholder="e.g. Honda City / Swift"
                value={formData.vehicleModel}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Ride Notes */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={14} color="#64748b" /> Driver Notes & Instructions
            </label>
            <textarea
              name="notes"
              className="form-control"
              rows={2}
              placeholder="e.g. Leaving punctually at 8:30 AM from Silk Board. No detours."
              value={formData.notes}
              onChange={handleChange}
              maxLength={300}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Publishing Ride...' : 'Publish Campus Ride Offer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRide;
