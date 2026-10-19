import React from 'react';
import { Menu, LogOut, Bell } from 'lucide-react';

const Navbar = ({ user, onLogout, toggleSidebar }) => {
  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="mobile-toggle" onClick={toggleSidebar}>
          <Menu size={24} color="#0f172a" />
        </button>
        <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>
          Hospital Portal &bull; New Delhi Central
        </span>
      </div>

      <div className="user-badge">
        <div className="avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Administrator'}</span>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', textTransform: 'capitalize', fontWeight: 600 }}>
            {user?.role || 'Admin'}
          </span>
        </div>
        <button className="btn-secondary" onClick={onLogout} title="Logout" style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LogOut size={16} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;