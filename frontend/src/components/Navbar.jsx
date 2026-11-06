import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Car,
  Search,
  PlusCircle,
  Inbox,
  Send,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Compass,
  Sparkles,
  ShieldCheck,
} from './Icons';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      api.getReceivedRequests({ status: 'pending' })
        .then((res) => {
          if (res.success && typeof res.count === 'number') {
            setPendingCount(res.count);
          }
        })
        .catch(() => {});
    } else {
      setPendingCount(0);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo with Live Network Badge */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="brand-icon-wrap">
            <Car size={22} strokeWidth={2.4} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ lineHeight: 1.1 }}>
              Campus<span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900 }}>Carpool</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em' }}>
              SMART UNIVERSITY TRANSIT
            </span>
          </div>
          <span className="saas-status-badge active" style={{ fontSize: '0.66rem', padding: '2px 8px' }}>
            <span className="saas-status-dot" /> Live Network
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <NavLink to="/find-rides" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Search size={16} />
            Find Rides
          </NavLink>

          <NavLink to="/route-explorer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Compass size={16} />
            3D Map
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/post-ride" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={16} />
                Post Ride
              </NavLink>

              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Compass size={16} />
                Dashboard
              </NavLink>

              <NavLink to="/garage" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Car size={16} />
                Garage
              </NavLink>

              <NavLink to="/my-rides" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Car size={16} />
                My Rides
              </NavLink>

              <NavLink to="/my-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Send size={16} />
                My Requests
              </NavLink>

              <NavLink to="/received-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Inbox size={16} />
                Received
                {pendingCount > 0 && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.25)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </NavLink>

              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <div className="user-menu-pill">
                  <div className="user-avatar-small">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                </div>
              </NavLink>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
                style={{ padding: '0.45rem 0.75rem', color: '#f87171' }}
              >
                <LogOut size={16} />
                Exit
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Student
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            EXPLORE
          </div>
          <NavLink to="/find-rides" className="nav-link" onClick={closeMenu}>
            <Search size={16} /> Find Rides
          </NavLink>
          <NavLink to="/route-explorer" className="nav-link" onClick={closeMenu}>
            <Compass size={16} /> 3D Route Map
          </NavLink>

          {isAuthenticated ? (
            <>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                COMMUTER CONSOLE
              </div>
              <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                <Compass size={16} /> Dashboard
              </NavLink>
              <NavLink to="/garage" className="nav-link" onClick={closeMenu}>
                <Car size={16} /> 3D Vehicle Garage
              </NavLink>
              <NavLink to="/post-ride" className="nav-link" onClick={closeMenu}>
                <PlusCircle size={16} /> Post Campus Ride
              </NavLink>
              <NavLink to="/my-rides" className="nav-link" onClick={closeMenu}>
                <Car size={16} /> My Hosted Rides
              </NavLink>
              <NavLink to="/my-requests" className="nav-link" onClick={closeMenu}>
                <Send size={16} /> My Seat Requests
              </NavLink>
              <NavLink to="/received-requests" className="nav-link" onClick={closeMenu}>
                <Inbox size={16} /> Received Requests {pendingCount > 0 ? `(${pendingCount})` : ''}
              </NavLink>
              <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
                <UserIcon size={16} /> Profile ({user?.name})
              </NavLink>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="btn btn-danger btn-sm"
                style={{ justifyContent: 'flex-start', marginTop: '0.75rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                Register Student
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
