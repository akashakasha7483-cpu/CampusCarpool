import React, { useState, useEffect } from 'react';
import {
  Car,
  Bike,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Zap,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import VehicleCanvas3D from '../components/3d/VehicleCanvas3D';

export const Garage = () => {
  const { user, refreshUser } = useAuth();

  const [selectedType, setSelectedType] = useState('Car');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.vehicleInfo) {
      if (user.vehicleInfo.vehicleType && user.vehicleInfo.vehicleType !== 'None') {
        setSelectedType(user.vehicleInfo.vehicleType);
      }
      setModel(user.vehicleInfo.model || '');
      setRegistrationNumber(user.vehicleInfo.registrationNumber || '');
    }
  }, [user]);

  const vehicleSpecs = {
    Car: {
      title: 'Futuristic Electric Car',
      seats: 'Up to 6 passenger seats',
      range: 'Campus commuter high-capacity sharing',
      badge: 'Maximum Shared Capacity',
      defaultModel: 'Honda City i-VTEC / Nexon EV',
    },
    Bike: {
      title: 'Cyber Sportbike (Pillion)',
      seats: '1 passenger seat (Helmet required)',
      range: 'Rapid corridor transit & light traffic navigation',
      badge: 'Zero Congestion Delay',
      defaultModel: 'Royal Enfield Hunter / Ather 450X',
    },
    Scooter: {
      title: 'Smart Campus Electric Scooter',
      seats: '1 passenger seat',
      range: 'Short-range inter-campus & hostel commutes',
      badge: 'Eco Friendly Mobility',
      defaultModel: 'Activa 6G / Ola S1 Pro',
    },
  };

  const handleSaveToProfile = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        vehicleInfo: {
          vehicleType: selectedType,
          model: model.trim() || vehicleSpecs[selectedType].defaultModel,
          registrationNumber: registrationNumber.trim(),
        },
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        setToast(`Vehicle preference set to ${selectedType} and saved to your student profile!`);
        setTimeout(() => setToast(''), 5000);
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to save vehicle preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto 3rem' }}>
      {toast && (
        <div className="alert alert-success" style={{ position: 'sticky', top: '80px', zIndex: 100 }}>
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '0.5rem',
          }}
        >
          <Zap size={14} />
          3D VIRTUAL SHOWROOM & GARAGE
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Interactive Vehicle Garage
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Configure your 3D electric car, bike or scooter preference and sync with your driver profile.
        </p>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {['Car', 'Bike', 'Scooter'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              background: selectedType === type ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(17, 28, 46, 0.8)',
              color: selectedType === type ? '#042417' : '#f8fafc',
              border: selectedType === type ? '1.5px solid #34d399' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: selectedType === type ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {type === 'Car' ? <Car size={18} /> : <Bike size={18} />}
            <span>Cyber {type}</span>
          </button>
        ))}
      </div>

      {/* Main Garage Layout: 3D Canvas + Configuration Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        {/* Left: 3D Vehicle Canvas */}
        <div style={{ width: '100%' }}>
          <VehicleCanvas3D
            vehicleType={selectedType}
            color={accentColor}
            autoRotate={true}
            interactive={true}
            height="460px"
          />

          {/* Accent Color Palette Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Neon Underglow Color:</span>
            {['#10b981', '#34d399', '#38bdf8', '#f59e0b', '#f43f5e', '#a855f7'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccentColor(c)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: c,
                  border: accentColor === c ? '2.5px solid #ffffff' : '1px solid transparent',
                  boxShadow: accentColor === c ? `0 0 12px ${c}` : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Vehicle Specifications & Driver Configuration */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '3px 10px',
                borderRadius: '999px',
              }}
            >
              {vehicleSpecs[selectedType].badge}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.5rem' }}>
              {vehicleSpecs[selectedType].title}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              {vehicleSpecs[selectedType].range}
            </p>
          </div>

          <div
            style={{
              background: 'rgba(8, 13, 24, 0.7)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Passenger Capacity:</span>
              <strong style={{ color: '#f8fafc' }}>{vehicleSpecs[selectedType].seats}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Powertrain:</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>100% Shared Mobility</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Linked Student:</span>
              <span style={{ color: '#f8fafc' }}>{user?.name} ({user?.studentId})</span>
            </div>
          </div>

          <form onSubmit={handleSaveToProfile}>
            <div className="form-group">
              <label className="form-label">Vehicle Model Name</label>
              <input
                type="text"
                className="form-control"
                placeholder={vehicleSpecs[selectedType].defaultModel}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registration Number Plate</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. KA-01-MJ-2026"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Saving to Profile...' : `Save ${selectedType} Configuration to Profile`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Garage;

