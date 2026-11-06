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
  Compass,
  CheckCircle2,
  Sparkles,
} from './Icons';
import CompatibilityBadge from './CompatibilityBadge';

/**
 * RideCard - Premium Cyberpunk Glass Ride Card
 * Displays verified driver identity, corridor trajectory, departure schedule,
 * seat availability gauge, fuel contribution, and compatibility score.
 */
export const RideCard = ({ ride, onRequestSeat, isCurrentUserDriver }) => {
  const isAvailable = ride.availableSeats > 0 && ride.status === 'active';

  // Check if leaving today
  const isLeavingToday = React.useMemo(() => {
    if (!ride.date) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return ride.date.startsWith(todayStr);
  }, [ride.date]);

  // Seat occupancy breakdown
  const seatsTotal = ride.seatsTotal || 3;
  const seatsAvailable = ride.availableSeats || 0;
  const seatsOccupied = Math.max(0, seatsTotal - seatsAvailable);

  return (
    <div
      className="card card-interactive"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(7, 11, 20, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.22)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.03)',
        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(59, 130, 246, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.22)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.03)';
      }}
    >
      {/* --- TOP ROW: DRIVER IDENTITY & COMPATIBILITY --- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Driver Avatar Pill with Gradient Glow */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '0 0 18px rgba(59, 130, 246, 0.4)',
              flexShrink: 0,
            }}
          >
            {ride.driver?.name ? ride.driver.name.charAt(0).toUpperCase() : 'D'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '1.02rem', color: '#F8FAFC' }}>
                {ride.driver?.name || 'Verified Commuter'}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#FBBF24',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                }}
              >
                <Star size={11} fill="#FBBF24" color="#FBBF24" />
                {ride.driver?.rating || '4.9'}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px', margin: 0 }}>
              {ride.driver?.department || 'Student'} &bull;{' '}
              <strong style={{ color: '#38BDF8' }}>{ride.vehicleType || 'Car'}</strong>
              {ride.vehicleModel ? ` (${ride.vehicleModel})` : ''}
            </p>
          </div>
        </div>

        {/* Compatibility Match Badge */}
        {ride.compatibility && (
          <CompatibilityBadge compatibility={ride.compatibility} />
        )}
      </div>

      {/* --- CORRIDOR ROUTE TRAJECTORY BOX --- */}
      <div
        style={{
          background: 'rgba(8, 13, 24, 0.85)',
          borderRadius: '16px',
          padding: '1.15rem',
          marginBottom: '1.25rem',
          border: '1px solid rgba(59, 130, 246, 0.16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          {/* Vertical trajectory route line */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '4px',
            }}
          >
            {/* Origin Pin */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#38BDF8',
                boxShadow: '0 0 10px #38BDF8',
              }}
            />
            {/* Trajectory gradient stem */}
            <div
              style={{
                width: '2px',
                height: '38px',
                background: 'linear-gradient(180deg, #38BDF8 0%, #8B5CF6 100%)',
                margin: '4px 0',
              }}
            />
            {/* Destination Pin */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#C084FC',
                boxShadow: '0 0 10px #C084FC',
              }}
            />
          </div>

          {/* Stops labels */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>
                PICKUP CORRIDOR
              </span>
              <p style={{ fontWeight: 700, fontSize: '0.96rem', color: '#F8FAFC', margin: 0 }}>
                {ride.source}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>
                DESTINATION CAMPUS
              </span>
              <p style={{ fontWeight: 700, fontSize: '0.96rem', color: '#F8FAFC', margin: 0 }}>
                {ride.destination}
              </p>
            </div>
          </div>
        </div>

        {/* Intermediate Waypoints if defined */}
        {ride.waypoints && ride.waypoints.length > 0 && (
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(59, 130, 246, 0.15)' }}>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Via Intermediate Stops:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {ride.waypoints.map((wp, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    color: '#93C5FD',
                    fontWeight: 500,
                  }}
                >
                  {wp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- SCHEDULE, SEATS & FUEL CONTRIBUTION METRICS --- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.85rem',
          marginBottom: '1.25rem',
          padding: '0.85rem',
          background: 'rgba(15, 23, 42, 0.55)',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Schedule Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#93C5FD', marginBottom: '0.2rem' }}>
            <Clock size={14} color="#38BDF8" />
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{ride.time}</span>
            {isLeavingToday && (
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                }}
              >
                Today
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{ride.date}</span>
        </div>

        {/* Seat Availability & Visual Gauge */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <Users size={14} color={isAvailable ? '#10B981' : '#EF4444'} />
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.88rem',
                color: isAvailable ? '#34D399' : '#EF4444',
              }}
            >
              {seatsAvailable} of {seatsTotal} open
            </span>
          </div>

          {/* Seat indicator dots */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: seatsTotal }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    idx < seatsAvailable
                      ? '#10B981'
                      : 'rgba(239, 68, 68, 0.4)',
                  boxShadow:
                    idx < seatsAvailable ? '0 0 6px #10B981' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Driver Note if any */}
      {ride.notes && (
        <p
          style={{
            fontSize: '0.78rem',
            color: '#94A3B8',
            background: 'rgba(8, 13, 24, 0.65)',
            padding: '0.5rem 0.85rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontStyle: 'italic',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            margin: '0 0 1.25rem 0',
          }}
        >
          &ldquo;{ride.notes}&rdquo;
        </p>
      )}

      {/* --- FOOTER: PRICE PILL & ACTION BUTTON --- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          paddingTop: '0.5rem',
        }}
      >
        {/* Fuel Contribution Pill */}
        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
            Fuel Contribution
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontWeight: 900, fontSize: '1.35rem', color: '#F8FAFC' }}>
              ₹{ride.pricePerSeat}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>/ seat</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Link
            to={`/route-explorer?source=${encodeURIComponent(ride.source)}&destination=${encodeURIComponent(ride.destination)}`}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.78rem',
              borderColor: 'rgba(59, 130, 246, 0.3)',
            }}
            title="Inspect 3D geospatial trajectory"
          >
            <Compass size={14} color="#38BDF8" />
          </Link>

          {isCurrentUserDriver ? (
            <span
              style={{
                fontSize: '0.78rem',
                color: '#60A5FA',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.45rem 0.85rem',
                borderRadius: '999px',
                fontWeight: 700,
              }}
            >
              Hosted by You
            </span>
          ) : isAvailable ? (
            <button
              onClick={() => onRequestSeat(ride)}
              className="btn btn-primary btn-sm"
              style={{
                padding: '0.5rem 1.15rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              Reserve Seat
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              disabled
              style={{ opacity: 0.45, cursor: 'not-allowed' }}
            >
              Full / Closed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideCard;
