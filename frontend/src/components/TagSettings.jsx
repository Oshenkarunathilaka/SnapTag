import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function TagSettings({
  tagImage, setTagImage,
  tagType,  setTagType,
  tagText,  setTagText,
  tagColor, setTagColor,
  tagOpacity, setTagOpacity,
  position, setPosition,
  scale,    setScale,
}) {
  const fileRef = useRef(null);

  const handleTagUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/png') { alert('Only PNG files are supported.'); return; }
    const fd = new FormData();
    fd.append('tag', file);
    try {
      const res  = await fetch('http://localhost:3001/api/upload-tag', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.tag) setTagImage(data.tag);
    } catch { alert('Failed to upload tag.'); }
  };

  const positions = [
    { id: 'top-left',     label: '↖ Top Left' },
    { id: 'top-right',    label: '↗ Top Right' },
    { id: 'bottom-left',  label: '↙ Bottom Left' },
    { id: 'bottom-right', label: '↘ Bottom Right' },
    { id: 'center',       label: '⊕ Center', span2: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Type Toggle */}
      <div>
        <label className="form-label">Watermark Type</label>
        <div className="segment-control">
          <button className={`segment-btn ${tagType === 'image' ? 'active' : ''}`} onClick={() => setTagType('image')}>
            Image PNG
          </button>
          <button className={`segment-btn ${tagType === 'text' ? 'active' : ''}`} onClick={() => setTagType('text')}>
            Text Stamp
          </button>
        </div>
      </div>

      {/* Image or Text Input */}
      {tagType === 'image' ? (
        <div>
          <label className="form-label">Select PNG File</label>
          {!tagImage ? (
            <div className="tag-upload-zone" onClick={() => fileRef.current?.click()}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={18} color="var(--primary)" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Choose PNG Watermark</span>
              <span style={{ fontSize: 11, color: 'var(--text-400)' }}>Only .png with transparency</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)' }}>
              <img src={`http://localhost:3001/api/tags/${tagImage.filename}`} alt="Tag" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tagImage.originalName}</p>
                <p style={{ fontSize: 11, color: 'var(--green)', marginTop: 2 }}>✓ Ready</p>
              </div>
              <button className="btn btn-ghost" onClick={() => setTagImage(null)} style={{ padding: 6 }}>
                <X size={16} />
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/png" style={{ display: 'none' }} onChange={handleTagUpload} />
        </div>
      ) : (
        <div>
          <label className="form-label">Watermark Text & Color</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-control"
              type="text"
              placeholder="Enter watermark text…"
              value={tagText}
              onChange={e => setTagText(e.target.value)}
            />
            <input
              type="color" value={tagColor}
              onChange={e => setTagColor(e.target.value)}
              style={{ width: 42, height: 42, padding: 2, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', flexShrink: 0 }}
              title="Text color"
            />
          </div>
        </div>
      )}

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Position */}
      <div>
        <label className="form-label">Tag Position</label>
        <div className="position-grid">
          {positions.map(p => (
            <button
              key={p.id}
              className={`position-btn ${p.span2 ? 'span-2' : ''} ${position === p.id ? 'active' : ''}`}
              onClick={() => setPosition(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Size */}
      <div>
        <label className="form-label">Size</label>
        <div className="slider-row">
          <input type="range" min="5" max="100" value={scale} onChange={e => setScale(e.target.value)} />
          <span className="slider-val">{scale}%</span>
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="form-label">Opacity</label>
        <div className="slider-row">
          <input type="range" min="0" max="100" value={tagOpacity} onChange={e => setTagOpacity(e.target.value)} />
          <span className="slider-val">{tagOpacity}%</span>
        </div>
      </div>

    </div>
  );
}
