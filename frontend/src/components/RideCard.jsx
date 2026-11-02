import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Shield,
  Star,
  Car,
  Bike,
  ArrowRight,
  Info,
} from './Icons';
import CompatibilityBadge from './CompatibilityBadge';

const RideCard = ({ ride, onRequestSeat, isCurrentUserDriver }) => {
  const isAvailable = ride.availableSeats > 0 && ride.status === 'active';

  return (
    <div className="card card-interactive" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Top Banner: Driver + Vehicle + Compatibility */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {ride.driver?.name ? ride.driver.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0f172a' }}>
                {ride.driver?.name || 'Fellow Student'}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: '#fef3c7',
                  color: '#92400e',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '999px',
                }}
              >
                <Star size={11} fill="#d97706" color="#d97706" />
                {ride.driver?.rating || '4.8'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {ride.driver?.department || 'Student Commuter'} &bull; {ride.vehicleType || 'Car'}
              {ride.vehicleModel ? ` (${ride.vehicleModel})` : ''}
            </p>
          </div>
        </div>

        {/* Compatibility Badge if available */}
        {ride.compatibility && (
          <CompatibilityBadge compatibility={ride.compatibility} />
        )}
      </div>

      {/* Route Display */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
              }}
            />
            <div
              style={{
                width: '2px',
                height: '32px',
                background: '#cbd5e1',
                margin: '4px 0',
              }}
            />
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#1e3a8a',
                boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.2)',
              }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                Pickup
              </span>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{ride.source}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                Destination
              </span>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Waypoints if any */}
        {ride.waypoints && ride.waypoints.length > 0 && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
              Via Intermediate Stops:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {ride.waypoints.map((wp, i) => (
                <span
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#334155',
                  }}
                >
                  {wp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meta info: Date, Time, Price, Seats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          fontSize: '0.82rem',
          color: '#475569',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Calendar size={15} color="#10b981" />
          <span>{ride.date}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Clock size={15} color="#10b981" />
          <span>{ride.time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Users size={15} color={ride.availableSeats > 0 ? '#10b981' : '#ef4444'} />
          <span>
            <strong style={{ color: ride.availableSeats > 0 ? '#0f172a' : '#ef4444' }}>
              {ride.availableSeats}
            </strong>{' '}
            of {ride.seatsTotal} seats left
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#059669' }}>
            ₹{ride.pricePerSeat}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ seat</span>
        </div>
      </div>

      {/* Notes if provided */}
      {ride.notes && (
        <p
          style={{
            fontSize: '0.8rem',
            color: '#64748b',
            background: '#f8fafc',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontStyle: 'italic',
          }}
        >
          &ldquo;{ride.notes}&rdquo;
        </p>
      )}

      {/* Card Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {isCurrentUserDriver ? (
          <span
            style={{
              fontSize: '0.8rem',
              color: '#1e3a8a',
              background: '#eff6ff',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 600,
            }}
          >
            You are the Host Driver
          </span>
        ) : isAvailable ? (
          <button
            onClick={() => onRequestSeat(ride)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Request Seat Now
            <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn btn-secondary" disabled style={{ width: '100%', opacity: 0.6 }}>
            Ride Full / Closed
          </button>
        )}
      </div>
    </div>
  );
};

export default RideCard;
