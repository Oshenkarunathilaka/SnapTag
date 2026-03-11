import React, { useState } from 'react';
import { Layers, History as HistoryIcon } from 'lucide-react';
import './index.css';

import Dashboard from './components/Dashboard';
import History from './components/History';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [images, setImages] = useState([]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo 2.png" alt="SnapTag" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Layers size={18} />
            Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <HistoryIcon size={18} />
            Upload History
            {images.length > 0 && <span className="nav-badge">{images.length}</span>}
          </button>
        </nav>

        <div className="sidebar-footer">SnapTag v1.0 · Bulk Watermark Tool</div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard images={images} setImages={setImages} />}
        {activeTab === 'history'   && <History   images={images} setImages={setImages} />}
      </main>
    </div>
  );
}

export default App;
