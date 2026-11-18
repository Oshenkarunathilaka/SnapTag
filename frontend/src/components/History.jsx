import React from 'react';
import { Trash2, History as HistoryIcon, ImageIcon, ShieldCheck } from 'lucide-react';

export default function History({ images, setImages }) {
  const handleRemove = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => {
      if (img.previewUrl) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setImages([]);
  };

  return (
    <div className="dashboard-wrapper animate-fade-in">
      <div
        className="dashboard-header"
        style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              color: 'var(--primary)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <HistoryIcon size={28} />
            Upload History
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            View and manage all images loaded into this session for watermark processing.
          </p>
        </div>

        {images.length > 0 && (
          <button
            className="btn btn-outline"
            onClick={clearAll}
            style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
          >
            <Trash2 size={18} />
            Clear All
          </button>
        )}
      </div>

      {/* Privacy & Session Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: 'var(--radius-sm)',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          fontSize: '13px',
        }}
      >
        <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0 }} />
        <div>
          <strong>100% Private & Browser-Based:</strong> Your photos are held only in local browser memory and never uploaded to any server. Images remain available throughout your session, but will reset if you reload the tab.
        </div>
      </div>

      <div className="card">
        {images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <ImageIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>No images loaded in this session yet.</p>
          </div>
        ) : (
          <div>
            <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Loaded Images{' '}
              <span
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                {images.length}
              </span>
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
              }}
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  className="image-card"
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--surface)',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <img
                    src={img.previewUrl}
                    alt={img.originalName}
                    style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="%23e2e8f0"><rect width="96" height="96"/></svg>';
                    }}
                  />
                  <div
                    style={{
                      padding: '8px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={img.originalName}
                  >
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
                      cursor: 'pointer',
                    }}
                    title="Remove image"
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
