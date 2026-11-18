import React, { useRef, useState, useEffect } from 'react';

export default function PreviewPanel({
  baseImage, tagImage,
  tagType, tagText, tagColor, tagOpacity,
  position, setPosition,
  customPos, setCustomPos,
  scale,
}) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);

  // Keep track of container width for accurate font scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();

    let resizeObserver = null;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(containerRef.current);
    } else {
      window.addEventListener('resize', updateSize);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const getPos = () => {
    if (position === 'custom' && customPos) {
      return { top: `${customPos.y}%`, left: `${customPos.x}%`, transform: 'translate(-50%,-50%)' };
    }
    switch (position) {
      case 'top-left':     return { top: '2%', left: '2%' };
      case 'top-right':    return { top: '2%', right: '2%' };
      case 'bottom-left':  return { bottom: '2%', left: '2%' };
      case 'center':       return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
      case 'bottom-right':
      default:             return { bottom: '2%', right: '2%' };
    }
  };

  const updatePosition = (cx, cy) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((cx - r.left)  / r.width)  * 100));
    const y = Math.max(0, Math.min(100, ((cy - r.top)   / r.height) * 100));
    setPosition('custom');
    setCustomPos({ x, y });
  };

  const ops = Math.max(0, Math.min(1, tagOpacity / 100));

  // Compute text font size matching watermarkEngine canvas logic
  const calculatedFontSize = Math.max(12, Math.round((containerWidth || 600) * (Number(scale) / 1000)));

  const baseSrc = baseImage?.previewUrl || '';
  const tagSrc = tagImage?.previewUrl || '';

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--text-400)', marginBottom: 12, textAlign: 'center' }}>
        ✦ Click or drag anywhere on the image to reposition the watermark
      </p>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
          width: '100%',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          cursor: dragging ? 'grabbing' : 'crosshair',
          touchAction: dragging ? 'none' : 'pan-y',
          userSelect: 'none',
        }}
        onPointerDown={(e) => {
          setDragging(true);
          updatePosition(e.clientX, e.clientY);
          if (e.currentTarget.setPointerCapture) {
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          updatePosition(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          setDragging(false);
          if (e.currentTarget.releasePointerCapture && e.currentTarget.hasPointerCapture?.(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerLeave={() => setDragging(false)}
      >
        <img
          src={baseSrc}
          alt="Base preview"
          className="preview-base-img"
          style={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'contain' }}
          draggable={false}
          onLoad={(e) => {
            if (e.target.clientWidth) setContainerWidth(e.target.clientWidth);
          }}
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" fill="%23f1f5f9"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif">Preview unavailable</text></svg>';
          }}
        />

        {tagType === 'image' && tagSrc && (
          <img
            src={tagSrc}
            alt="Watermark"
            draggable={false}
            style={{
              position: 'absolute',
              width: `${scale}%`,
              height: 'auto',
              objectFit: 'contain',
              opacity: ops,
              pointerEvents: 'none',
              ...getPos(),
            }}
          />
        )}

        {tagType === 'text' && tagText && (
          <div
            style={{
              position: 'absolute',
              opacity: ops,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              ...getPos(),
            }}
          >
            <span
              style={{
                fontSize: `${calculatedFontSize}px`,
                fontWeight: 800,
                color: tagColor || '#ffffff',
                textShadow: '0 2px 6px rgba(0,0,0,.55)',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                lineHeight: 1,
              }}
            >
              {tagText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
