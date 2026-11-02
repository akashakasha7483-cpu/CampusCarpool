import React from 'react';
import { Link } from 'react-router-dom';
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
  Compass,
} from './Icons';
import CompatibilityBadge from './CompatibilityBadge';

export const RideCard = ({ ride, onRequestSeat, isCurrentUserDriver }) => {
  const isAvailable = ride.availableSeats > 0 && ride.status === 'active';

  return (
    <div
      className="card card-interactive"
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(180deg, #111C2E 0%, #0D1626 100%)',
      }}
    >
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
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#042417',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.1rem',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.35)',
            }}
          >
            {ride.driver?.name ? ride.driver.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>
                {ride.driver?.name || 'Fellow Student'}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <Star size={11} fill="#fbbf24" color="#fbbf24" />
                {ride.driver?.rating || '4.8'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {ride.driver?.department || 'Student Commuter'} &bull;{' '}
              <strong style={{ color: '#34d399' }}>{ride.vehicleType || 'Car'}</strong>
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
          background: 'rgba(8, 13, 24, 0.75)',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.06)',
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
                boxShadow: '0 0 10px #10b981',
              }}
            />
            <div
              style={{
                width: '2px',
                height: '34px',
                background: 'linear-gradient(180deg, #10b981, #38bdf8)',
                margin: '4px 0',
              }}
            />
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 10px #38bdf8',
              }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Pickup Spot
              </span>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{ride.source}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Destination Drop-off
              </span>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Waypoints if any */}
        {ride.waypoints && ride.waypoints.length > 0 && (
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Via Intermediate Stops:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {ride.waypoints.map((wp, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '2px 9px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#cbd5e1',
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
          color: '#cbd5e1',
          marginBottom: '1.25rem',
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
          <Users size={15} color={ride.availableSeats > 0 ? '#34d399' : '#ef4444'} />
          <span>
            <strong style={{ color: ride.availableSeats > 0 ? '#34d399' : '#ef4444' }}>
              {ride.availableSeats}
            </strong>{' '}
            of {ride.seatsTotal} seats open
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#34d399' }}>
            ₹{ride.pricePerSeat}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/ seat</span>
        </div>
      </div>

      {/* Notes if provided */}
      {ride.notes && (
        <p
          style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            background: 'rgba(8, 13, 24, 0.6)',
            padding: '0.5rem 0.85rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontStyle: 'italic',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          &ldquo;{ride.notes}&rdquo;
        </p>
      )}

      {/* Card Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link
          to={`/route-explorer?source=${encodeURIComponent(ride.source)}&destination=${encodeURIComponent(ride.destination)}`}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.8rem' }}
        >
          <Compass size={14} color="#34d399" />
          Inspect 3D Route
        </Link>

        <div>
          {isCurrentUserDriver ? (
            <span
              style={{
                fontSize: '0.8rem',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 700,
              }}
            >
              You are the Host Driver
            </span>
          ) : isAvailable ? (
            <button
              onClick={() => onRequestSeat(ride)}
              className="btn btn-primary"
            >
              Select Seats Now
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn btn-secondary" disabled style={{ opacity: 0.5 }}>
              Ride Full / Closed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideCard;
