import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Car,
  Compass,
  ArrowRight,
  ShieldCheck,
} from './Icons';
import CompatibilityBadge from './CompatibilityBadge';

/**
 * RideComparisonTable
 * High-density SaaS comparison table for side-by-side evaluation of
 * driver ratings, departure schedules, seat availability, and pricing.
 */
export const RideComparisonTable = ({
  rides = [],
  onRequestSeat,
  currentUserId,
}) => {
  if (!rides || rides.length === 0) {
    return null;
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: '20px',
        border: '1px solid rgba(59, 130, 246, 0.22)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(7, 11, 20, 0.95) 100%)',
        boxShadow: '0 15px 45px rgba(0, 0, 0, 0.6)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.88rem',
          color: '#F8FAFC',
          minWidth: '920px',
        }}
      >
        <thead>
          <tr
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
              color: '#94A3B8',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <th style={{ padding: '1.1rem 1.25rem' }}>Driver & Vehicle</th>
            <th style={{ padding: '1.1rem 1.25rem' }}>Corridor Route</th>
            <th style={{ padding: '1.1rem 1.25rem' }}>Departure</th>
            <th style={{ padding: '1.1rem 1.25rem' }}>Available Seats</th>
            <th style={{ padding: '1.1rem 1.25rem' }}>Fuel Split</th>
            <th style={{ padding: '1.1rem 1.25rem' }}>Match Score</th>
            <th style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride, index) => {
            const isDriver = currentUserId && ride.driver?._id === currentUserId;
            const isAvailable = ride.availableSeats > 0 && ride.status === 'active';
            const isToday = ride.date && ride.date.startsWith(todayStr);

            return (
              <tr
                key={ride._id || index}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* 1. Driver & Vehicle */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: '0 0 12px rgba(59, 130, 246, 0.35)',
                        flexShrink: 0,
                      }}
                    >
                      {ride.driver?.name ? ride.driver.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                          {ride.driver?.name || 'Verified Commuter'}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#FBBF24',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '999px',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          <Star size={10} fill="#FBBF24" color="#FBBF24" />
                          {ride.driver?.rating || '4.9'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                        {ride.vehicleModel || ride.vehicleType || 'Car'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Corridor Route */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38BDF8', display: 'inline-block' }} />
                      <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{ride.source}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C084FC', display: 'inline-block' }} />
                      <span style={{ fontWeight: 600, color: '#93C5FD' }}>{ride.destination}</span>
                    </div>
                    {ride.waypoints && ride.waypoints.length > 0 && (
                      <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                        +{ride.waypoints.length} waypoint{ride.waypoints.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </td>

                {/* 3. Schedule */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} color="#38BDF8" />
                      <span style={{ fontWeight: 700, color: '#F8FAFC' }}>{ride.time}</span>
                      {isToday && (
                        <span
                          style={{
                            background: 'rgba(16, 185, 129, 0.18)',
                            color: '#34D399',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            padding: '1px 6px',
                            borderRadius: '999px',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                          }}
                        >
                          Today
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{ride.date}</span>
                  </div>
                </td>

                {/* 4. Available Seats */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        color: isAvailable ? '#34D399' : '#EF4444',
                      }}
                    >
                      {ride.availableSeats} of {ride.seatsTotal || 3}
                    </span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {Array.from({ length: ride.seatsTotal || 3 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: i < ride.availableSeats ? '#10B981' : 'rgba(239, 68, 68, 0.4)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </td>

                {/* 5. Fuel Split */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#F8FAFC' }}>
                    ₹{ride.pricePerSeat}
                  </span>
                </td>

                {/* 6. Match Score */}
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  {ride.compatibility ? (
                    <CompatibilityBadge compatibility={ride.compatibility} />
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Direct Route</span>
                  )}
                </td>

                {/* 7. Action */}
                <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                  {isDriver ? (
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: '#60A5FA',
                        background: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontWeight: 700,
                      }}
                    >
                      Your Ride
                    </span>
                  ) : isAvailable ? (
                    <button
                      type="button"
                      onClick={() => onRequestSeat(ride)}
                      className="btn btn-primary btn-sm"
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      Reserve <ArrowRight size={13} />
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: '#EF4444',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontWeight: 700,
                      }}
                    >
                      Full
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RideComparisonTable;

