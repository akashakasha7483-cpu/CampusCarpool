import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2, Car, Sparkles, User, Mail, Lock, Phone, BookOpen, ShieldCheck } from '../components/Icons';
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

  // Fast autofill for Demo Student
  const handleAutofillDemo = () => {
    setFormData({
      name: 'Campus Commuter',
      email: `student.${Math.floor(Math.random() * 900 + 100)}@college.edu`,
      password: 'password123',
      studentId: 'STU-2026-001',
      department: 'Information Technology',
      phone: '9876543210',
      vehicleType: 'Car',
      model: 'Honda City',
      registrationNumber: 'KA-01-MJ-2026',
      bio: 'College student commuting daily via Silk Board and HSR Layout.',
    });
  };

  return (
    <div style={{ maxWidth: '720px', margin: '2rem auto 4rem', padding: '0 1rem' }}>
      <div
        className="card"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(180deg, #111C2E 0%, #0D1626 100%)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
            }}
          >
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Student Registration
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Create your account on the verified CampusCarpool smart mobility network
          </p>

          <button
            type="button"
            onClick={handleAutofillDemo}
            className="btn btn-outline-green btn-sm"
            style={{ marginTop: '1rem', fontSize: '0.8rem' }}
          >
            <Sparkles size={14} />
            Autofill Demo Student Credentials
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* SECTION 1: CREDENTIALS */}
          <div className="saas-form-section-header" style={{ marginBottom: '1.25rem' }}>
            <div className="saas-stat-icon-wrap" style={{ width: '30px', height: '30px' }}>
              <User size={15} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem' }}>1. Basic & College Credentials</h3>
              <p style={{ fontSize: '0.78rem' }}>Enter your real campus name and college email</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Student Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>College Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="student@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Student ID / Roll No *</label>
              <input
                type="text"
                name="studentId"
                className="form-control"
                placeholder="e.g. STU-2026-001"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Password * (Min 6 chars)</label>
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
              <label className="form-label" style={{ color: '#cbd5e1' }}>Department / Branch</label>
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
              <label className="form-label" style={{ color: '#cbd5e1' }}>Phone Number</label>
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

          {/* SECTION 2: VEHICLE DETAILS */}
          <div
            style={{
              background: 'rgba(8, 13, 24, 0.75)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.5rem',
              marginTop: '0.75rem',
            }}
          >
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Car size={16} color="#10b981" />
              Vehicle Information (For Drivers)
            </h4>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>Vehicle Type</label>
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
                    <label className="form-label" style={{ color: '#cbd5e1' }}>Vehicle Model</label>
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
                    <label className="form-label" style={{ color: '#cbd5e1' }}>Registration Plate Number</label>
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

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Short Commute Bio</label>
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
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800 }}
            disabled={loading}
          >
            {loading ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.86rem', color: '#94a3b8' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#34d399', fontWeight: 700 }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
