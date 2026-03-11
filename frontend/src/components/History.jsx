import React from 'react';
import { Trash2, History as HistoryIcon, ImageIcon } from 'lucide-react';

export default function History({ images, setImages }) {
  const handleRemove = async (id) => {
    try {
      await fetch('http://localhost:3001/api/remove-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      await fetch('http://localhost:3001/api/clear', {
        method: 'POST',
      });
      setImages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-wrapper animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HistoryIcon size={28} />
            Upload History
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>View and manage all the images you have uploaded for processing.</p>
        </div>
        
        {images.length > 0 && (
          <button className="btn btn-outline" onClick={clearAll} style={{ color: 'var(--danger)', borderColor: '#fecaca' }}>
            <Trash2 size={18} />
            Clear All
          </button>
        )}
      </div>

      <div className="card">
        {images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <ImageIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>No images uploaded yet.</p>
          </div>
        ) : (
          <div>
            <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Uploaded Images <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{images.length}</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
              {images.map((img) => (
                <div key={img.id} className="image-card" style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)', 
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface)',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <img 
                    src={`http://localhost:3001/api/uploads/${img.filename}`} 
                    alt={img.originalName} 
                    style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '8px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {img.originalName}
                  </div>
                  <button 
                    onClick={() => handleRemove(img.id)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      padding: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} color="var(--danger)" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
