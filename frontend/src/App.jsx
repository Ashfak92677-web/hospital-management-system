import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Auto login check from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.clear();
      }
    }

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />
      <div className="main-wrapper">
        <Navbar
          user={user}
          onLogout={handleLogout}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'patients' && <Patients />}
          {activeTab === 'doctors' && <Doctors user={user} />}
          {activeTab === 'appointments' && <Appointments />}
        </main>
      </div>
    </div>
  );
}

export default App;