import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Award,
  Car,
  Phone,
  BookOpen,
  Star,
  CheckCircle2,
  AlertCircle,
  Save,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const Profile = () => {
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
        name: formData.name,
        department: formData.department,
        phone: formData.phone,
        bio: formData.bio,
        vehicleInfo: {
          vehicleType: formData.vehicleType,
          model: formData.model,
          registrationNumber: formData.registrationNumber,
        },
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        setSuccessToast('Profile details updated successfully!');
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
    <div style={{ maxWidth: '680px', margin: '1rem auto 3rem' }}>
      {successToast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 90 }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Header Profile Badge */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090e1a 0%, #0f172a 60%, #1e3a8a 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user?.name}</h1>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              ID: {user?.studentId}
            </span>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            {user?.email} &bull; {user?.department}
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" /> {user?.rating || '4.8'} Rating
            </span>
            <span>&bull;</span>
            <span>{user?.ridesHosted || 0} Rides Hosted</span>
            <span>&bull;</span>
            <span>{user?.ridesJoined || 0} Rides Joined</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card" style={{ padding: '2.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
          Student Profile Details
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Email (Permanent)</label>
              <input
                type="text"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Student ID / Roll Number (Permanent)</label>
              <input
                type="text"
                className="form-control"
                value={user?.studentId || ''}
                disabled
                style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department / Branch</label>
            <select
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Management Studies">Management Studies</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Commuter Bio</label>
            <textarea
              name="bio"
              className="form-control"
              rows={3}
              placeholder="Tell fellow students about your commute habits, music preferences, or timings."
              value={formData.bio}
              onChange={handleChange}
              maxLength={250}
            />
          </div>

          {/* Vehicle Section */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.75rem',
            }}
          >
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Car size={16} color="#10b981" /> Driver Vehicle Configuration
            </h4>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select
                  name="vehicleType"
                  className="form-control"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="None">None (Passenger Only)</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                </select>
              </div>

              {formData.vehicleType !== 'None' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Vehicle Model</label>
                    <input
                      type="text"
                      name="model"
                      className="form-control"
                      placeholder="e.g. Honda City"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Registration Plate Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      className="form-control"
                      placeholder="e.g. KA-01-MJ-2026"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
