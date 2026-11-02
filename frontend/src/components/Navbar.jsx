import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
} from './Icons';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="brand-icon-wrap">
            <Car size={22} strokeWidth={2.4} />
          </div>
          <span>
            Campus<span style={{ color: '#34d399' }}>Carpool</span>
          </span>
          <span className="brand-tag">Academic</span>
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
                3D Garage
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
                style={{ padding: '0.45rem 0.75rem', color: '#ef4444' }}
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
          <NavLink to="/find-rides" className="nav-link" onClick={closeMenu}>
            <Search size={16} /> Find Rides
          </NavLink>
          <NavLink to="/route-explorer" className="nav-link" onClick={closeMenu}>
            <Compass size={16} /> 3D Route Map
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                <Compass size={16} /> Dashboard
              </NavLink>
              <NavLink to="/garage" className="nav-link" onClick={closeMenu}>
                <Car size={16} /> 3D Vehicle Garage
              </NavLink>
              <NavLink to="/post-ride" className="nav-link" onClick={closeMenu}>
                <PlusCircle size={16} /> Post Ride
              </NavLink>
              <NavLink to="/my-rides" className="nav-link" onClick={closeMenu}>
                <Car size={16} /> My Rides
              </NavLink>
              <NavLink to="/my-requests" className="nav-link" onClick={closeMenu}>
                <Send size={16} /> My Requests
              </NavLink>
              <NavLink to="/received-requests" className="nav-link" onClick={closeMenu}>
                <Inbox size={16} /> Received Requests
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
                style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
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
