import React from 'react';
import { Car, ShieldCheck, Zap, Heart, MapPin } from './Icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div className="brand-icon-wrap" style={{ width: '32px', height: '32px' }}>
              <Car size={18} />
            </div>
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.2rem' }}>
              Campus<span style={{ color: '#34d399' }}>Carpool</span>
            </span>
          </div>
          <p style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            Move Together. Travel Smarter.
          </p>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#94a3b8' }}>
            A futuristic 3D smart mobility platform connecting campus commuters through intelligent approximate
            route matching, geospatial 3D vector mapping, and atomic seat reservation.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            Campus Platform
          </h4>
          <ul style={{ listStyle: 'none', fontSize: '0.88rem', lineHeight: '2', color: '#94a3b8' }}>
            <li>Safe & Verified Student Commuting</li>
            <li>Real-time Seat Reservations</li>
            <li>Interactive 3D Route Explorer</li>
            <li>Zero-Emission Green Transit</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            Key Innovations
          </h4>
          <ul style={{ listStyle: 'none', fontSize: '0.88rem', lineHeight: '2', color: '#94a3b8' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={14} color="#34d399" /> Approximate Route Dice & Token Matching
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} color="#34d399" /> Concurrency & Atomic Overbooking Protection
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="#34d399" /> Waypoint & Multi-Stop Intermediate Hubs
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; {new Date().getFullYear()} CampusCarpool &bull; Futuristic Smart Mobility Platform.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Crafted for <span className="student-tag">Campus Students</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
