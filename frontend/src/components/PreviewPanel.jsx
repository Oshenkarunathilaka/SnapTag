import React, { useRef, useState } from 'react';

export default function PreviewPanel({
  baseImage, tagImage,
  tagType, tagText, tagColor, tagOpacity,
  position, setPosition,
  customPos, setCustomPos,
  scale,
}) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const getPos = () => {
    if (position === 'custom' && customPos) {
      return { top: `${customPos.y}%`, left: `${customPos.x}%`, transform: 'translate(-50%,-50%)' };
    }
    switch (position) {
      case 'top-left':     return { top: 0, left: 0 };
      case 'top-right':    return { top: 0, right: 0 };
      case 'bottom-left':  return { bottom: 0, left: 0 };
      case 'center':       return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
      default:             return { bottom: 0, right: 0 };
    }
  };

  const update = (cx, cy) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((cx - r.left)  / r.width)  * 100));
    const y = Math.max(0, Math.min(100, ((cy - r.top)   / r.height) * 100));
    setPosition('custom');
    setCustomPos({ x, y });
  };

  const ops = tagOpacity / 100;

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--text-400)', marginBottom: 12, textAlign: 'center' }}>
        ✦ Click or drag anywhere on the image to reposition the watermark
      </p>
      <div
        ref={containerRef}
        style={{
          position: 'relative', display: 'inline-block',
          maxWidth: '100%', width: '100%',
          borderRadius: 'var(--radius-sm)', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)', cursor: dragging ? 'grabbing' : 'crosshair',
          touchAction: 'none',
        }}
        onPointerDown={e => { e.preventDefault(); setDragging(true); update(e.clientX, e.clientY); }}
        onPointerMove={e => { if (!dragging) return; update(e.clientX, e.clientY); }}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        <img
          src={`http://localhost:3001/api/uploads/${baseImage.filename}`}
          alt="Base preview"
          style={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'contain' }}
          draggable={false}
        />

        {tagType === 'image' && tagImage && (
          <img
            src={`http://localhost:3001/api/tags/${tagImage.filename}`}
            alt="Watermark"
            draggable={false}
            style={{
              position: 'absolute', width: `${scale}%`, height: 'auto',
              objectFit: 'contain', opacity: ops, pointerEvents: 'none',
              ...getPos(),
            }}
          />
        )}

        {tagType === 'text' && tagText && (
          <div style={{ position: 'absolute', opacity: ops, pointerEvents: 'none', whiteSpace: 'nowrap', ...getPos() }}>
            <span style={{
              fontSize: `${scale / 10}em`, fontWeight: 800,
              color: tagColor, textShadow: '0 2px 6px rgba(0,0,0,.5)',
              fontFamily: 'Inter, sans-serif',
            }}>
              {tagText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
