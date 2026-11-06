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
  Clock,
  ArrowRight,
  TrendingUp,
} from './Icons';
import { api } from '../api/client';

// Quick location tags frequently used for university boarding
const QUICK_PICKUP_TAGS = [
  'Campus Main Gate',
  'Metro Station Exit 2',
  'Engineering Quad',
  'Silk Board Skywalk',
  'Bus Junction Terminal',
];

/**
 * InteractiveSeatPicker
 * Futuristic top-down vehicle cabin seat selection HUD
 * with real-time atomic reservation and digital boarding pass confirmation.
 */
export const InteractiveSeatPicker = ({ ride, onClose, onSuccess }) => {
  const [selectedSeatIndexes, setSelectedSeatIndexes] = useState([0]); // Default 1 seat selected
  const [pickupNote, setPickupNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);

  if (!ride) return null;

  const totalSeats = ride.seatsTotal || 3;
  const availableSeats = ride.availableSeats || 0;
  const bookedCount = Math.max(0, totalSeats - availableSeats);

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
        // Generate confirmation ticket data
        const confirmationCode = `CC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setConfirmationData({
          code: confirmationCode,
          message: res.message || 'Seat reservation submitted successfully!',
          seatsBooked: seatsRequested,
          totalPrice: totalContribution,
        });

        // Notify parent caller to decrement seat availability in place
        if (typeof onSuccess === 'function') {
          onSuccess(res.message || 'Seat reserved successfully!', ride._id, seatsRequested);
        }
      }
    } catch (err) {
      setError(err.message || 'Seat reservation failed. Please check capacity.');
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
        backgroundColor: 'rgba(7, 11, 20, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(7, 11, 20, 0.99) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.85), 0 0 40px rgba(59, 130, 246, 0.15)',
          padding: '2rem',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#94A3B8',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* ============================================================ */}
        {/* A. DIGITAL BOARDING PASS CONFIRMATION SCREEN                */}
        {/* ============================================================ */}
        {confirmationData ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            {/* Holographic Header Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34D399',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle size={14} color="#10B981" />
              <span>ATOMIC SEAT RESERVATION CONFIRMED</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Digital Boarding Pass
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Your seat request has been transmitted and logged in the atomic transaction registry.
            </p>

            {/* Boarding Pass Ticket Card */}
            <div
              style={{
                background: 'rgba(8, 13, 24, 0.85)',
                borderRadius: '18px',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                padding: '1.5rem',
                textAlign: 'left',
                marginBottom: '1.75rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px dashed rgba(59, 130, 246, 0.25)',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    BOOKING REFERENCE
                  </span>
                  <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38BDF8', letterSpacing: '0.08em', margin: 0 }}>
                    {confirmationData.code}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    SEATS RESERVED
                  </span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399', margin: 0 }}>
                    {confirmationData.seatsBooked} Seat{confirmationData.seatsBooked > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Route Trajectory Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    PICKUP
                  </span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                    {ride.source}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    DESTINATION
                  </span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                    {ride.destination}
                  </p>
                </div>
              </div>

              {/* Schedule & Driver Details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.85rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    SCHEDULE
                  </span>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#93C5FD', margin: 0 }}>
                    {ride.date} &bull; {ride.time}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    DRIVER CONTACT
                  </span>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                    {ride.driver?.name || 'Fellow Commuter'}
                  </p>
                </div>
              </div>

              {/* Total Fuel Contribution */}
              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Total Peer Fuel Contribution:
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34D399' }}>
                  ₹{confirmationData.totalPrice}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', fontWeight: 700 }}
            >
              Done &bull; Return to Directory
            </button>
          </div>
        ) : (
          /* ============================================================ */
          /* B. VEHICLE CABIN HUD SEAT MAP SELECTOR                       */
          /* ============================================================ */
          <>
            {/* Modal Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#38BDF8',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={12} color="#8B5CF6" />
                <span>INTERACTIVE VEHICLE CABIN HUD</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F8FAFC', margin: '0 0 0.35rem 0' }}>
                Select Your Commuter Seats
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>
                Corridor: <strong style={{ color: '#F8FAFC' }}>{ride.source}</strong> &rarr;{' '}
                <strong style={{ color: '#93C5FD' }}>{ride.destination}</strong>
              </p>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* --- TOP-DOWN CABIN BLUEPRINT CONTAINER --- */}
            <div
              style={{
                background: 'rgba(8, 13, 24, 0.85)',
                borderRadius: '20px',
                border: '1px solid rgba(59, 130, 246, 0.22)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                position: 'relative',
              }}
            >
              {/* Aerodynamic Windshield Outline */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '180px',
                    height: '24px',
                    borderRadius: '20px 20px 0 0',
                    border: '1.5px solid rgba(59, 130, 246, 0.4)',
                    borderBottom: 'none',
                    background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.64rem', color: '#38BDF8', fontWeight: 800, letterSpacing: '0.08em' }}>
                    WINDSHIELD &bull; FRONT
                  </span>
                </div>
              </div>

              {/* Cabin Grid Layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '300px', margin: '0 auto' }}>
                {/* Front Row: Driver (Locked) + Front Passenger */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  {/* Driver Pod (Locked Host) */}
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px dashed rgba(255, 255, 255, 0.15)',
                      borderRadius: '14px',
                      padding: '0.85rem 0.5rem',
                      textAlign: 'center',
                      fontSize: '0.74rem',
                      color: '#64748B',
                    }}
                  >
                    <Car size={16} color="#64748B" style={{ margin: '0 auto 4px', display: 'block' }} />
                    <span style={{ fontWeight: 700 }}>Driver</span>
                    <span style={{ fontSize: '0.64rem', display: 'block', color: '#475569' }}>(Host)</span>
                  </div>

                  {/* Front Passenger Seat Pod */}
                  {seatLayout[0] && (
                    <button
                      type="button"
                      onClick={() => toggleSeat(0)}
                      disabled={seatLayout[0].isBooked}
                      style={{
                        background: seatLayout[0].isBooked
                          ? 'rgba(239, 68, 68, 0.12)'
                          : selectedSeatIndexes.includes(0)
                          ? 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                          : 'rgba(15, 23, 42, 0.85)',
                        color: selectedSeatIndexes.includes(0) ? '#FFFFFF' : '#F8FAFC',
                        border: seatLayout[0].isBooked
                          ? '1px solid rgba(239, 68, 68, 0.3)'
                          : selectedSeatIndexes.includes(0)
                          ? '1.5px solid #38BDF8'
                          : '1px solid rgba(59, 130, 246, 0.35)',
                        borderRadius: '14px',
                        padding: '0.85rem 0.5rem',
                        textAlign: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: seatLayout[0].isBooked ? 'not-allowed' : 'pointer',
                        boxShadow: selectedSeatIndexes.includes(0)
                          ? '0 0 18px rgba(59, 130, 246, 0.45)'
                          : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Users size={16} style={{ margin: '0 auto 4px', display: 'block', opacity: 0.85 }} />
                      <span>{seatLayout[0].isBooked ? 'Occupied' : selectedSeatIndexes.includes(0) ? 'Selected ✓' : 'Front Seat'}</span>
                    </button>
                  )}
                </div>

                {/* Rear Row: Passenger Seat Pods */}
                {seatLayout.length > 1 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(3, seatLayout.length - 1)}, 1fr)`,
                      gap: '0.65rem',
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
                              ? 'rgba(239, 68, 68, 0.12)'
                              : isSelected
                              ? 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                              : 'rgba(15, 23, 42, 0.85)',
                            color: isSelected ? '#FFFFFF' : '#F8FAFC',
                            border: seat.isBooked
                              ? '1px solid rgba(239, 68, 68, 0.3)'
                              : isSelected
                              ? '1.5px solid #38BDF8'
                              : '1px solid rgba(59, 130, 246, 0.35)',
                            borderRadius: '14px',
                            padding: '0.85rem 0.4rem',
                            textAlign: 'center',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                            boxShadow: isSelected
                              ? '0 0 18px rgba(59, 130, 246, 0.45)'
                              : 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Users size={14} style={{ margin: '0 auto 4px', display: 'block', opacity: 0.85 }} />
                          <span>{seat.isBooked ? 'Booked' : isSelected ? 'Selected ✓' : `Rear #${seat.id}`}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Seat Status Legend */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.25rem',
                  marginTop: '1.25rem',
                  fontSize: '0.74rem',
                  color: '#94A3B8',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: '#3B82F6', boxShadow: '0 0 6px #3B82F6' }} />
                  Selected ({seatsRequested})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '3px', border: '1px solid rgba(59, 130, 246, 0.6)' }} />
                  Available ({availableSeats})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.4)' }} />
                  Occupied ({bookedCount})
                </span>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="#38BDF8" /> Pickup Waypoint Note for Driver (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Near Metro Gate 2 / Silk Board Footbridge"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  maxLength={180}
                />

                {/* Quick preset chips */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {QUICK_PICKUP_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setPickupNote(tag)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        border: '1px solid rgba(59, 130, 246, 0.22)',
                        color: '#93C5FD',
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        cursor: 'pointer',
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Fuel Contribution Calculation */}
              <div
                style={{
                  background: 'rgba(8, 13, 24, 0.75)',
                  borderRadius: '14px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                  <span>Fare Contribution per Seat:</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>₹{ride.pricePerSeat}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                  <span>Seats Selected:</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>&times; {seatsRequested} Seat(s)</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>
                    Total Shared Contribution:
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34D399' }}>
                    ₹{totalContribution}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ fontWeight: 700, minWidth: '180px' }}
                >
                  {loading ? 'Submitting Request...' : `Reserve ${seatsRequested} Seat(s)`}
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
