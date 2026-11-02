import React, { useState } from 'react';
import {
  X,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Car,
} from './Icons';
import { api } from '../api/client';

export const InteractiveSeatPicker = ({ ride, onClose, onSuccess }) => {
  const [selectedSeatIndexes, setSelectedSeatIndexes] = useState([0]); // Default 1 seat selected
  const [pickupNote, setPickupNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!ride) return null;

  const totalSeats = ride.seatsTotal || 3;
  const availableSeats = ride.availableSeats || 0;
  const bookedCount = totalSeats - availableSeats;

  // Generate seat map representations
  // index 0: Front passenger
  // index 1..N: Rear seats
  const seatLayout = [];
  for (let i = 0; i < totalSeats; i++) {
    const isBooked = i < bookedCount;
    seatLayout.push({
      id: i,
      label: i === 0 ? 'Front Seat' : `Rear Seat ${i}`,
      isBooked,
      isAvailable: !isBooked,
    });
  }

  const toggleSeat = (index) => {
    const seat = seatLayout[index];
    if (seat.isBooked) return; // Cannot select booked seats

    if (selectedSeatIndexes.includes(index)) {
      if (selectedSeatIndexes.length === 1) return; // At least 1 must remain selected
      setSelectedSeatIndexes(selectedSeatIndexes.filter((idx) => idx !== index));
    } else {
      if (selectedSeatIndexes.length >= availableSeats) return;
      setSelectedSeatIndexes([...selectedSeatIndexes, index]);
    }
  };

  const seatsRequested = selectedSeatIndexes.length;
  const totalContribution = seatsRequested * (ride.pricePerSeat || 30);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.sendSeatRequest(ride._id, seatsRequested, pickupNote);
      if (res.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          onSuccess(res.message);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Seat booking request failed. Please check capacity.');
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
        backgroundColor: 'rgba(8, 13, 24, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(180deg, #111C2E 0%, #0F172A 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.15)',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {bookingSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1.5px solid #10b981',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
              }}
            >
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
              Seat Request Transmitted!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Your request for {seatsRequested} seat(s) has been sent to the driver for confirmation.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={13} />
                INTERACTIVE CABIN SEATING
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc' }}>
                Select Your Campus Seats
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Route: <strong style={{ color: '#f8fafc' }}>{ride.source}</strong> &rarr;{' '}
                <strong style={{ color: '#f8fafc' }}>{ride.destination}</strong>
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Visual Vehicle Cabin Blueprint */}
            <div
              style={{
                background: 'rgba(8, 13, 24, 0.85)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                }}
              >
                <span>FRONT OF VEHICLE</span>
                <span>{ride.vehicleType || 'Car'} ({ride.vehicleModel || 'Campus Commuter'})</span>
              </div>

              {/* Cabin Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '280px', margin: '0 auto' }}>
                {/* Front Row: Driver (Locked) + Front Passenger */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px dashed rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}
                  >
                    <Car size={16} style={{ margin: '0 auto 4px', display: 'block', opacity: 0.6 }} />
                    Driver (Host)
                  </div>

                  {seatLayout[0] && (
                    <button
                      type="button"
                      onClick={() => toggleSeat(0)}
                      disabled={seatLayout[0].isBooked}
                      style={{
                        background: seatLayout[0].isBooked
                          ? 'rgba(239, 68, 68, 0.15)'
                          : selectedSeatIndexes.includes(0)
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'rgba(17, 28, 46, 0.8)',
                        color: selectedSeatIndexes.includes(0) ? '#042417' : '#f8fafc',
                        border: seatLayout[0].isBooked
                          ? '1px solid rgba(239, 68, 68, 0.3)'
                          : selectedSeatIndexes.includes(0)
                          ? '1.5px solid #34d399'
                          : '1px solid rgba(52, 211, 153, 0.4)',
                        borderRadius: '10px',
                        padding: '0.75rem 0.5rem',
                        textAlign: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: seatLayout[0].isBooked ? 'not-allowed' : 'pointer',
                        boxShadow: selectedSeatIndexes.includes(0) ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
                      }}
                    >
                      {seatLayout[0].isBooked ? 'Booked' : selectedSeatIndexes.includes(0) ? 'Selected ✓' : 'Seat #1'}
                    </button>
                  )}
                </div>

                {/* Rear Row */}
                {seatLayout.length > 1 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(3, seatLayout.length - 1)}, 1fr)`,
                      gap: '0.6rem',
                    }}
                  >
                    {seatLayout.slice(1).map((seat) => {
                      const isSelected = selectedSeatIndexes.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => toggleSeat(seat.id)}
                          disabled={seat.isBooked}
                          style={{
                            background: seat.isBooked
                              ? 'rgba(239, 68, 68, 0.15)'
                              : isSelected
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : 'rgba(17, 28, 46, 0.8)',
                            color: isSelected ? '#042417' : '#f8fafc',
                            border: seat.isBooked
                              ? '1px solid rgba(239, 68, 68, 0.3)'
                              : isSelected
                              ? '1.5px solid #34d399'
                              : '1px solid rgba(52, 211, 153, 0.4)',
                            borderRadius: '10px',
                            padding: '0.75rem 0.4rem',
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                            boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
                          }}
                        >
                          {seat.isBooked ? 'Booked' : isSelected ? 'Selected ✓' : `Seat #${seat.id + 1}`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Legend */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.25rem',
                  marginTop: '1.25rem',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }} />
                  Selected ({seatsRequested})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1px solid #10b981' }} />
                  Available ({availableSeats})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.3)' }} />
                  Booked ({bookedCount})
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="form-group">
                <label className="form-label">Pickup Spot / Note for Driver (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Silk Board Skywalk / Near Gate 2 Metro"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  maxLength={200}
                />
              </div>

              {/* Contribution calculation summary */}
              <div
                style={{
                  background: 'rgba(8, 13, 24, 0.7)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  <span>Fare Contribution per Seat:</span>
                  <span>₹{ride.pricePerSeat}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  <span>Seats Chosen:</span>
                  <span>&times; {seatsRequested} Seat(s)</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#34d399',
                  }}
                >
                  <span>Total Shared Contribution:</span>
                  <span>₹{totalContribution}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting to Backend...' : `Confirm Request (${seatsRequested} Seats)`}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InteractiveSeatPicker;
