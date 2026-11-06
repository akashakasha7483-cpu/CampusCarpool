import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Car,
  Phone,
  Star,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import StudentVerificationBadge from '../components/StudentVerificationBadge';

export const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    phone: '',
    bio: '',
    vehicleType: 'None',
    model: '',
    registrationNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || 'Information Technology',
        phone: user.phone || '',
        bio: user.bio || '',
        vehicleType: user.vehicleInfo?.vehicleType || 'None',
        model: user.vehicleInfo?.model || '',
        registrationNumber: user.vehicleInfo?.registrationNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        department: formData.department.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        vehicleInfo: {
          vehicleType: formData.vehicleType,
          model: formData.model.trim(),
          registrationNumber: formData.registrationNumber.trim().toUpperCase(),
        },
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        setSuccessToast('Student profile and vehicle specs updated successfully!');
        setTimeout(() => setSuccessToast(''), 5000);
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Notifications */}
      {successToast && (
        <div
          className="alert alert-success"
          style={{
            position: 'sticky',
            top: '80px',
            zIndex: 100,
            background: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger"
          style={{
            position: 'sticky',
            top: '80px',
            zIndex: 100,
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#ffffff',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#38bdf8',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '0.5rem',
            letterSpacing: '0.04em',
          }}
        >
          <ShieldCheck size={14} />
          CAMPUS ACADEMIC IDENTITY & VEHICLE GARAGE
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', margin: '0 0 0.4rem 0' }}>
          Student Mobility Profile
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.94rem', margin: 0 }}>
          Manage your verified student credentials, peer contact coordinates, and registered commute vehicles.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Digital Student ID & Peer Rating Dossier */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Digital Student Identity Card */}
          <div
            className="card"
            style={{
              padding: '2rem',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
              border: '1.5px solid rgba(59, 130, 246, 0.35)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Holographic Watermark Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Avatar & Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>
                  {user?.name || 'Student Commuter'}
                </h3>
                <StudentVerificationBadge
                  verified={user?.verified !== false}
                  department={user?.department || 'Information Technology'}
                  compact={true}
                />
              </div>
            </div>

            {/* Academic Credentials List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontSize: '0.85rem',
                color: '#cbd5e1',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Student ID
                </span>
                <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '0.98rem' }}>
                  {user?.studentId || 'UNIV-STUDENT'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Verified University Email
                </span>
                <div style={{ color: '#f8fafc', fontWeight: 700, wordBreak: 'break-all' }}>
                  {user?.email}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Peer Trust Rating
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 800, fontSize: '1rem' }}>
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  {user?.rating ? user.rating.toFixed(1) : '5.0'} / 5.0
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                    ({user?.ridesCount || 0} rides completed)
                  </span>
                </div>
              </div>

              {formData.bio && (
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Commute Bio
                  </span>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4, fontStyle: 'italic', marginTop: '2px' }}>
                    "{formData.bio}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registered Vehicle Garage Card */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Car size={18} color="#3b82f6" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                Garage Vehicle Status
              </span>
            </div>

            {formData.vehicleType !== 'None' ? (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                  {formData.model || `${formData.vehicleType} Registered`}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                  Category: <strong style={{ color: '#f8fafc' }}>{formData.vehicleType}</strong> &bull; Plate:{' '}
                  <strong style={{ color: '#cbd5e1' }}>{formData.registrationNumber || 'Not Specified'}</strong>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Eligible to host campus corridors
                </div>
              </div>
            ) : (
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  No vehicle currently registered. You can commute as a passenger or register your car/bike below to start offering rides.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile Edit & Garage Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Academic & Contact Coordinates */}
          <div
            className="card"
            style={{
              padding: '2rem',
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 1.25rem 0' }}>
              Academic & Contact Coordinates
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your student name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                  Academic Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g. Computer Science, Mechanical, Business"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>
                  Contact Phone Number
                </label>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                  🔒 Hidden until request accepted
                </span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+91 98765 43210"
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                Used strictly for rider-driver coordination after a booking is confirmed.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                Commute Bio & Travel Preferences
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="form-input"
                placeholder="Share your typical daily commute routine, pickup preferences, or music taste..."
                maxLength={300}
              />
            </div>
          </div>

          {/* Section 2: Vehicle Garage Registration */}
          <div
            className="card"
            style={{
              padding: '2rem',
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 1.25rem 0' }}>
              Vehicle Garage Specs
            </h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Vehicle Classification
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {['Car', 'Bike', 'Scooter', 'None'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, vehicleType: type }))}
                    style={{
                      background: formData.vehicleType === type ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                      border: formData.vehicleType === type ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: formData.vehicleType === type ? '#60a5fa' : '#94a3b8',
                      borderRadius: '12px',
                      padding: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {formData.vehicleType !== 'None' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                    Vehicle Make & Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Honda City i-VTEC, Hyundai i20"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                    Registration Plate Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. KA 05 MN 1234"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.35)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={18} />
            {loading ? 'Saving Profile...' : 'Save Profile & Vehicle Specs'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
