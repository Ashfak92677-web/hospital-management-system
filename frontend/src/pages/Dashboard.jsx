import React, { useEffect, useState } from 'react';
import API from '../api';
import { Users, UserCheck, CalendarCheck, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
    pending_appointments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/appointments/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Hospital Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <h3>Total Patients</h3>
            <p>{stats.total_patients}</p>
          </div>
          <Users size={32} color="#0284c7" />
        </div>
        <div className="stat-card">
          <div>
            <h3>Active Doctors</h3>
            <p>{stats.total_doctors}</p>
          </div>
          <UserCheck size={32} color="#10b981" />
        </div>
        <div className="stat-card">
          <div>
            <h3>Appointments</h3>
            <p>{stats.total_appointments}</p>
          </div>
          <CalendarCheck size={32} color="#6366f1" />
        </div>
        <div className="stat-card">
          <div>
            <h3>Pending Visits</h3>
            <p>{stats.pending_appointments}</p>
          </div>
          <Clock size={32} color="#f59e0b" />
        </div>
      </div>

      <div className="content-box">
        <h2>Hospital Management System v1.0</h2>
        <p style={{ color: '#64748b', lineHeight: 1.6 }}>
          Welcome to the centralized portal. Use the sidebar to register new OPD patients, view consulting specialists, and schedule patient appointments with instant database sync.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;