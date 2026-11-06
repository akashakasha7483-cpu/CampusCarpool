import React, { useState } from 'react';
import { Sparkles, Info, CheckCircle2 } from './Icons';

/**
 * CompatibilityBadge
 * Algorithmic route compatibility match badge with interactive breakdown popover.
 * Styled in Midnight Navy + Electric Blue / Violet / Emerald.
 */
export const CompatibilityBadge = ({ compatibility }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!compatibility) return null;

  const { score = 0, level = 'Match', reasons = [], details } = compatibility;

  // Determine badge styling based on score
  let badgeBg = 'rgba(59, 130, 246, 0.14)';
  let badgeBorder = 'rgba(59, 130, 246, 0.35)';
  let badgeColor = '#60A5FA';
  let badgeGlow = 'rgba(59, 130, 246, 0.25)';

  if (score >= 80) {
    badgeBg = 'rgba(16, 185, 129, 0.15)';
    badgeBorder = 'rgba(16, 185, 129, 0.38)';
    badgeColor = '#34D399';
    badgeGlow = 'rgba(16, 185, 129, 0.25)';
  } else if (score < 60) {
    badgeBg = 'rgba(139, 92, 246, 0.14)';
    badgeBorder = 'rgba(139, 92, 246, 0.35)';
    badgeColor = '#C084FC';
    badgeGlow = 'rgba(139, 92, 246, 0.25)';
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
        title="Click to view route & time compatibility breakdown"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: badgeBg,
          border: `1px solid ${badgeBorder}`,
          color: badgeColor,
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '0.74rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 0 10px ${badgeGlow}`,
          transition: 'all 0.2s ease',
        }}
      >
        <Sparkles size={12} color={badgeColor} />
        <span>{score}% Match</span>
        <span style={{ opacity: 0.75, fontWeight: 500, fontSize: '0.68rem' }}>({level})</span>
        <Info size={11} style={{ opacity: 0.7, marginLeft: '1px' }} />
      </button>

      {/* Floating Match Breakdown Popover */}
      {showDetails && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 100,
            width: '290px',
            background: 'rgba(15, 23, 42, 0.96)',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '1.15rem',
            textAlign: 'left',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#F8FAFC' }}>
              Intelligent Match Analysis
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: badgeColor,
                background: badgeBg,
                padding: '2px 7px',
                borderRadius: '6px',
                border: `1px solid ${badgeBorder}`,
              }}
            >
              {score}% Score
            </span>
          </div>

          {details && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                background: 'rgba(7, 11, 20, 0.75)',
                padding: '0.6rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div>
                <span style={{ color: '#94A3B8' }}>Route Match: </span>
                <strong style={{ color: '#38BDF8' }}>{details.routeScore}%</strong>
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>Schedule: </span>
                <strong style={{ color: '#C084FC' }}>{details.timeScore}%</strong>
              </div>
            </div>
          )}

          {reasons && reasons.length > 0 && (
            <div>
              <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem', margin: 0 }}>
                Compatibility Factors:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.35rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {reasons.map((reason, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.76rem', color: '#CBD5E1' }}>
                    <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompatibilityBadge;
