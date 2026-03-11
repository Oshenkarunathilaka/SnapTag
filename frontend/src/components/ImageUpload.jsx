import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Plus } from 'lucide-react';

export default function ImageUpload({ images, setImages }) {
  const [isDragging, setIsDragging]   = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files) => {
    if (!files?.length) return;
    setIsUploading(true);

    const valid = Array.from(files).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type)
    );
    if (!valid.length) { setIsUploading(false); setIsDragging(false); return; }

    try {
      const BATCH = 50;
      let latest = [];
      for (let i = 0; i < valid.length; i += BATCH) {
        const fd = new FormData();
        valid.slice(i, i + BATCH).forEach(f => fd.append('images', f));
        const res  = await fetch('http://localhost:3001/api/upload-images', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server error');
        if (data.images) latest = data.images;
      }
      if (latest.length) setImages(latest);
    } catch (err) {
      console.error(err);
      alert('Failed to upload images: ' + (err.message || 'Network Error'));
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch('http://localhost:3001/api/remove-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Drop zone */}
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        style={{ padding: images.length ? '28px 32px' : '48px 32px' }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
        onDrop={e => { e.preventDefault(); uploadFiles(e.dataTransfer.files); }}
        onClick={() => document.getElementById('img-file-input').click()}
      >
        <div className="upload-icon-wrap">
          <UploadCloud size={28} color="#2563eb" />
        </div>
        <p className="upload-title">
          {isUploading ? 'Uploading…' : 'Drag & drop images here'}
        </p>
        <p className="upload-hint">
          {isUploading
            ? 'Please wait while your files are being uploaded'
            : 'or click to browse — JPG, PNG, WEBP supported'}
        </p>
        {isUploading && (
          <div style={{ marginTop: 8 }}>
            <div style={{ width: 180, height: 4, background: '#dbeafe', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(to right,#2563eb,#60a5fa)', borderRadius: 999, animation: 'progress-bar 3s ease-out forwards' }} />
            </div>
          </div>
        )}
        <input id="img-file-input" type="file" multiple accept="image/*" style={{ display: 'none' }}
          onChange={e => uploadFiles(e.target.files)} />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-600)' }}>
              {images.length} image{images.length !== 1 ? 's' : ''} loaded
            </span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '4px 10px' }}
              onClick={() => document.getElementById('img-file-input').click()}
            >
              <Plus size={14} /> Add More
            </button>
          </div>
          <div className="image-grid">
            {images.map(img => (
              <div key={img.id} className="image-thumb">
                <img
                  src={`http://localhost:3001/api/uploads/${img.filename}`}
                  alt={img.originalName}
                  onError={e => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="%23e2e8f0"><rect width="96" height="96"/></svg>'; }}
                />
                <button
                  className="image-thumb-remove"
                  onClick={e => { e.stopPropagation(); handleRemove(img.id); }}
                  title="Remove"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
