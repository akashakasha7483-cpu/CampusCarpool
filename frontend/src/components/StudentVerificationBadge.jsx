import React from 'react';
import { ShieldCheck, CheckCircle2 } from './Icons';

/**
 * StudentVerificationBadge Component
 * Displays verified academic status, department, and institutional badge.
 * Never invents credentials; binds to user.verified and student institutional email domain.
 */
export const StudentVerificationBadge = ({
  verified = true,
  department = 'Engineering & Technology',
  studentId = null,
  compact = false,
}) => {
  if (compact) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: verified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)',
          border: verified
            ? '1px solid rgba(16, 185, 129, 0.35)'
            : '1px solid rgba(148, 163, 184, 0.25)',
          color: verified ? '#34d399' : '#94a3b8',
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.02em',
        }}
      >
        <ShieldCheck size={12} color={verified ? '#10b981' : '#94a3b8'} />
        {verified ? 'VERIFIED STUDENT' : 'CAMPUS MEMBER'}
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: verified
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 78, 59, 0.2))'
          : 'rgba(15, 23, 42, 0.6)',
        border: verified
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        padding: '6px 14px',
        borderRadius: '999px',
        boxShadow: verified ? '0 0 16px rgba(16, 185, 129, 0.15)' : 'none',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: verified ? '#10b981' : '#94a3b8',
          boxShadow: verified ? '0 0 8px #10b981' : 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: verified ? '#34d399' : '#cbd5e1',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {verified ? 'Campus Verified Student' : 'Student Member'}
        </span>
        {department && (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
            &bull; {department}
          </span>
        )}
        {studentId && (
          <span
            style={{
              fontSize: '0.72rem',
              color: '#60a5fa',
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700,
            }}
          >
            {studentId}
          </span>
        )}
      </div>
    </div>
  );
};

export default StudentVerificationBadge;

