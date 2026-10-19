import React from 'react';
import { Activity, Users, UserPlus, Calendar, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'patients', label: 'Patients', icon: <Users size={20} /> },
    { id: 'doctors', label: 'Doctors', icon: <UserPlus size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        <div className="brand">
          <Activity size={26} color="#38bdf8" />
          <span>MediCare HMS</span>
        </div>
        <ul className="nav-links">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '12px', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #1e293b' }}>
        MediCare ERP System &bull; 2026<br />IGNOU Major Project
      </div>
    </aside>
  );
};

export default Sidebar;