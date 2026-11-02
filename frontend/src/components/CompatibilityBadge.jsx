import React, { useState } from 'react';
import { Sparkles, Info, CheckCircle2, Clock, MapPin } from './Icons';

const CompatibilityBadge = ({ compatibility }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!compatibility) return null;

  const { score, level, badgeColor, reasons, details } = compatibility;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
        className={`compat-badge ${badgeColor || 'green'}`}
        title="Click to view route & time compatibility breakdown"
        style={{ cursor: 'pointer', border: '1px solid currentColor' }}
      >
        <Sparkles size={13} />
        <span>{score}% Match</span>
        <span style={{ opacity: 0.75, fontWeight: 500, fontSize: '0.75rem' }}>({level})</span>
        <Info size={12} style={{ opacity: 0.65, marginLeft: '2px' }} />
      </button>

      {showDetails && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 50,
            width: '280px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
              Intelligent Match Analysis
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: score >= 75 ? '#059669' : '#1d4ed8',
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
                gap: '0.4rem',
                background: '#f8fafc',
                padding: '0.5rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                marginBottom: '0.6rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b' }}>Route: </span>
                <strong style={{ color: '#0f172a' }}>{details.routeScore}%</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Time: </span>
                <strong style={{ color: '#0f172a' }}>{details.timeScore}%</strong>
              </div>
            </div>
          )}

          {reasons && reasons.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Compatibility Factors:
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.78rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {reasons.map((reason, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowDetails(false)}
            style={{
              marginTop: '0.75rem',
              width: '100%',
              padding: '0.35rem',
              background: '#f1f5f9',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#475569',
              fontWeight: 600,
            }}
          >
            Close Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default CompatibilityBadge;
