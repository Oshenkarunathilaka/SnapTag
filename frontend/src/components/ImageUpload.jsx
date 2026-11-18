import React, { useState } from 'react';
import { UploadCloud, X, Plus } from 'lucide-react';

export default function ImageUpload({ images, setImages }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = (files) => {
    if (!files?.length) return;
    setIsUploading(true);

    const valid = Array.from(files).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type) ||
      /\.(jpe?g|png|webp)$/i.test(f.name)
    );

    if (!valid.length) {
      setIsUploading(false);
      setIsDragging(false);
      return;
    }

    try {
      const newItems = valid.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${file.name}`,
        file,
        originalName: file.name,
        filename: file.name,
        previewUrl: URL.createObjectURL(file),
        size: file.size,
        type: file.type || 'image/jpeg',
      }));

      setImages((prev) => [...prev, ...newItems]);
    } catch (err) {
      console.error('Failed to load image files locally:', err);
      alert('Failed to load image files. Please try again.');
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const handleRemove = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Drop zone */}
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        style={{ padding: images.length ? '28px 32px' : '48px 32px' }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById('img-file-input').click()}
      >
        <div className="upload-icon-wrap">
          <UploadCloud size={28} color="#2563eb" />
        </div>
        <p className="upload-title">
          {isUploading ? 'Adding images…' : 'Drag & drop images here'}
        </p>
        <p className="upload-hint">
          {isUploading
            ? 'Preparing your photos for watermark processing'
            : 'or click to browse — JPG, PNG, WEBP supported'}
        </p>
        {isUploading && (
          <div style={{ marginTop: 8 }}>
            <div style={{ width: 180, height: 4, background: '#dbeafe', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right,#2563eb,#60a5fa)',
                  borderRadius: 999,
                  animation: 'progress-bar 1s ease-out forwards',
                }}
              />
            </div>
          </div>
        )}
        <input
          id="img-file-input"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          style={{ display: 'none' }}
          onChange={(e) => {
            uploadFiles(e.target.files);
            // Reset input value so same files can be re-selected if needed
            e.target.value = '';
          }}
        />
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
            {images.map((img) => (
              <div key={img.id} className="image-thumb">
                <img
                  src={img.previewUrl}
                  alt={img.originalName}
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="%23e2e8f0"><rect width="96" height="96"/></svg>';
                  }}
                />
                <button
                  className="image-thumb-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(img.id);
                  }}
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
