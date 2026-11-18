import React, { useState } from 'react';
import { Layers, History as HistoryIcon, Home, Menu, X } from 'lucide-react';
import './index.css';

import Dashboard from './components/Dashboard';
import History from './components/History';
import LandingPage from './components/LandingPage';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [images, setImages] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (currentView === 'landing') {
    return <LandingPage onStart={() => setCurrentView('app')} />;
  }

  const handleNav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleGoHome = () => {
    setCurrentView('landing');
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Top Bar */}
      <header className="mobile-topbar">
        <div
          className="mobile-topbar-brand"
          onClick={handleGoHome}
          title="Back to Landing Page"
        >
          <img src="/logo 2.png" alt="SnapTag" className="mobile-topbar-logo" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {images.length > 0 && (
            <span className="mobile-images-pill">
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </span>
          )}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header-wrapper">
          <div
            className="sidebar-header"
            onClick={handleGoHome}
            style={{ cursor: 'pointer' }}
            title="Back to Landing Page"
          >
            <img src="/logo 2.png" alt="SnapTag" className="sidebar-logo" />
          </div>
          <button
            className="sidebar-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className="nav-btn"
            style={{ marginBottom: 6, opacity: 0.85 }}
            onClick={handleGoHome}
          >
            <Home size={18} />
            Back to Home
          </button>

          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            <Layers size={18} />
            Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleNav('history')}
          >
            <HistoryIcon size={18} />
            Upload History
            {images.length > 0 && <span className="nav-badge">{images.length}</span>}
          </button>
        </nav>

        <div className="sidebar-footer">SnapTag v1.0 · Bulk Watermark Tool</div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard images={images} setImages={setImages} />}
        {activeTab === 'history'   && <History   images={images} setImages={setImages} />}
      </main>
    </div>
  );
}

export default App;
