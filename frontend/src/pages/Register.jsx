import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2, Car, Sparkles } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: 'Information Technology',
    phone: '',
    vehicleType: 'None',
    model: '',
    registrationNumber: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

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
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        department: formData.department,
        phone: formData.phone,
        bio: formData.bio,
        vehicleInfo: {
          vehicleType: formData.vehicleType,
          model: formData.model,
          registrationNumber: formData.registrationNumber,
        },
      };

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Fast autofill for Project Creator
  const handleAutofillAkash = () => {
    setFormData({
      name: 'AKASH M R',
      email: `akash.${Math.floor(Math.random() * 900 + 100)}@college.edu`,
      password: 'password123',
      studentId: '2102508522',
      department: 'Information Technology',
      phone: '9876543210',
      vehicleType: 'Car',
      model: 'Honda City',
      registrationNumber: 'KA-01-MJ-2026',
      bio: 'Final year IT student commuting daily via Silk Board and HSR Layout.',
    });
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 16px rgba(15, 23, 42, 0.25)',
            }}
          >
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            Student Registration
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Join CampusCarpool with your college roll number
          </p>

          <button
            type="button"
            onClick={handleAutofillAkash}
            className="btn btn-outline-green btn-sm"
            style={{ marginTop: '0.75rem' }}
          >
            <Sparkles size={13} />
            Autofill with Project Student Details (AKASH M R - 2102508522)
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Akash M R"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="akash@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Student ID / Roll No *</label>
              <input
                type="text"
                name="studentId"
                className="form-control"
                placeholder="e.g. 2102508522"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password * (Min 6 chars)</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="form-grid">
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
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div
            style={{
              background: '#f8fafc',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem',
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
              <Car size={18} color="#10b981" />
              Vehicle Information (For Drivers)
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
                      placeholder="e.g. Honda City / Activa 6G"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      className="form-control"
                      placeholder="e.g. KA-01-AB-1234"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Commute Bio</label>
            <textarea
              name="bio"
              className="form-control"
              rows={2}
              placeholder="e.g. Daily commuter from Whitefield to Campus, quiet passenger/driver."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#10b981', fontWeight: 700 }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
