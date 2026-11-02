import React, { useState } from 'react';
import { X, Users, MapPin, AlertCircle, CheckCircle } from './Icons';
import { api } from '../api/client';

const RequestModal = ({ ride, onClose, onSuccess }) => {
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [pickupNote, setPickupNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!ride) return null;

  const totalFare = seatsRequested * ride.pricePerSeat;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.sendSeatRequest(ride._id, seatsRequested, pickupNote);
      if (res.success) {
        onSuccess(res.message);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit seat request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '1.75rem',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#64748b',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Request Ride Seat
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Booking ride from <strong>{ride.source}</strong> to <strong>{ride.destination}</strong>
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Number of Seats Requested (Max: {ride.availableSeats})
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                className="form-control"
                value={seatsRequested}
                onChange={(e) => setSeatsRequested(parseInt(e.target.value, 10))}
              >
                {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Seat' : 'Seats'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Spot / Note for Driver (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Near gate 2 / metro exit / carrying light backpack"
              value={pickupNote}
              onChange={(e) => setPickupNote(e.target.value)}
              maxLength={200}
            />
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Price per seat:</span>
              <span>₹{ride.pricePerSeat}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Seats:</span>
              <span>&times; {seatsRequested}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#059669',
              }}
            >
              <span>Total Estimated Contribution:</span>
              <span>₹{totalFare}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
