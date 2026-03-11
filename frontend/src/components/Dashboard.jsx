import React, { useState } from 'react';
import {
  Image as ImageIcon, Tag, Settings2, Play, Download,
  RefreshCcw, CheckCircle, Sliders, Zap, XCircle
} from 'lucide-react';
import ImageUpload from './ImageUpload';
import TagSettings from './TagSettings';
import PreviewPanel from './PreviewPanel';

export default function Dashboard({ images, setImages }) {
  const [tagImage, setTagImage]     = useState(null);
  const [tagPosition, setTagPosition] = useState('bottom-right');
  const [tagScale, setTagScale]     = useState(25);
  const [tagType, setTagType]       = useState('image');
  const [tagText, setTagText]       = useState('');
  const [tagColor, setTagColor]     = useState('#ffffff');
  const [tagOpacity, setTagOpacity] = useState(100);
  const [customPos, setCustomPos]   = useState(null);

  const [isProcessing, setIsProcessing]   = useState(false);
  const [processStatus, setProcessStatus] = useState('idle'); // idle | processing | done | error
  const [processedCount, setProcessedCount]   = useState(0);
  const [processedImages, setProcessedImages] = useState([]);
  const [showOverlay, setShowOverlay]     = useState(false);

  const canProcess =
    images.length > 0 &&
    (tagType === 'text' ? tagText.trim().length > 0 : !!tagImage);

  const handleStart = async () => {
    if (!canProcess) return;
    setIsProcessing(true);
    setProcessStatus('processing');
    setShowOverlay(true);

    const config = { tagType, tagText, tagColor, tagOpacity, customPos, position: tagPosition, scale: tagScale };

    try {
      const resp = await fetch('http://localhost:3001/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await resp.json();
      if (resp.ok) {
        setProcessStatus('done');
        setProcessedCount(data.processedCount);
        setProcessedImages(data.processedImages || []);
        // Keep overlay showing the success for 1.8 seconds then dismiss
        setTimeout(() => setShowOverlay(false), 1800);
      } else {
        setProcessStatus('error');
        setTimeout(() => { setShowOverlay(false); setProcessStatus('idle'); }, 2200);
      }
    } catch (err) {
      console.error(err);
      setProcessStatus('error');
      setTimeout(() => { setShowOverlay(false); setProcessStatus('idle'); }, 2200);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    window.location.href = 'http://localhost:3001/api/download-zip';
  };

  return (
    <div className="animate-fade-up">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bulk Image Tagger</h1>
          <p className="page-subtitle">Upload images → configure watermark → process & download</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {processStatus === 'done' && (
            <button className="btn btn-success btn-lg" onClick={handleDownload}>
              <Download size={18} /> Download ZIP
            </button>
          )}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStart}
            disabled={!canProcess || isProcessing}
          >
            {isProcessing
              ? <><RefreshCcw size={18} style={{ animation: 'spin .85s linear infinite' }} /> Processing…</>
              : <><Zap size={18} /> Start Processing</>
            }
          </button>
        </div>
      </div>

      {/* ── Main Workflow ── */}
      <div className="workflow-grid">

        {/* LEFT column */}
        <div className="workflow-left">

          {/* Step 1 – Upload Images */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon"><ImageIcon size={16} /></div>
              <div>
                <div className="card-title">Step 1 · Upload Images</div>
                <div className="card-subtitle">Drag & drop or click to select multiple files</div>
              </div>
              {images.length > 0 && (
                <span className="ready-pill" style={{ marginLeft: 'auto' }}>
                  <CheckCircle size={12} /> {images.length} ready
                </span>
              )}
            </div>
            <div className="card-body">
              <ImageUpload images={images} setImages={setImages} />
            </div>
          </div>

          {/* Step 2 – Live Preview (only when ready) */}
          {images.length > 0 && (tagImage || tagType === 'text') && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <div className="card-icon"><Sliders size={16} /></div>
                <div>
                  <div className="card-title">Step 3 · Live Preview</div>
                  <div className="card-subtitle">Click or drag to reposition the watermark</div>
                </div>
              </div>
              <div className="card-body">
                <PreviewPanel
                  baseImage={images[0]}
                  tagImage={tagImage}
                  tagType={tagType}
                  tagText={tagText}
                  tagColor={tagColor}
                  tagOpacity={tagOpacity}
                  position={tagPosition}
                  setPosition={setTagPosition}
                  customPos={customPos}
                  setCustomPos={setCustomPos}
                  scale={tagScale}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {processStatus === 'done' && processedImages.length > 0 && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <div className="card-icon" style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>
                  <CheckCircle size={16} />
                </div>
                <div>
                  <div className="card-title">Output · {processedCount} images processed</div>
                  <div className="card-subtitle">Click any image to download individually</div>
                </div>
                <button className="btn btn-success" style={{ marginLeft: 'auto' }} onClick={handleDownload}>
                  <Download size={15} /> Download All
                </button>
              </div>
              <div className="card-body">
                <div className="image-grid">
                  {processedImages.map((filename, i) => (
                    <a
                      key={i}
                      href={`http://localhost:3001/api/output/${filename}`}
                      download={filename}
                      target="_blank"
                      rel="noreferrer"
                      className="image-thumb"
                      title={filename}
                    >
                      <img
                        src={`http://localhost:3001/api/output/${filename}`}
                        alt={filename}
                        onError={e => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="%23e2e8f0"><rect width="96" height="96"/></svg>'; }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT column */}
        <div className="workflow-right">

          {/* Step 2 – Configure Watermark */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon"><Tag size={16} /></div>
              <div>
                <div className="card-title">Step 2 · Watermark Setup</div>
                <div className="card-subtitle">Image overlay or text stamp</div>
              </div>
            </div>
            <div className="card-body">
              <TagSettings
                tagImage={tagImage} setTagImage={setTagImage}
                tagType={tagType} setTagType={setTagType}
                tagText={tagText} setTagText={setTagText}
                tagColor={tagColor} setTagColor={setTagColor}
                tagOpacity={tagOpacity} setTagOpacity={setTagOpacity}
                position={tagPosition} setPosition={setTagPosition}
                scale={tagScale} setScale={setTagScale}
              />
            </div>
          </div>

          {/* Status Summary */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon"><Settings2 size={16} /></div>
              <div>
                <div className="card-title">Job Summary</div>
              </div>
            </div>
            <div className="card-body" style={{ padding: '8px 24px' }}>
              <div className="status-row">
                <span className="status-label">Images loaded</span>
                <span className="status-value" style={{ color: images.length ? 'var(--green)' : 'var(--text-400)' }}>
                  {images.length || '—'}
                </span>
              </div>
              <div className="status-row">
                <span className="status-label">Watermark ready</span>
                <span>
                  {(tagType === 'image' && tagImage) || (tagType === 'text' && tagText)
                    ? <span className="ready-pill"><CheckCircle size={11} /> Yes</span>
                    : <span className="not-ready-pill"><XCircle size={11} /> No</span>
                  }
                </span>
              </div>
              <div className="status-row">
                <span className="status-label">Status</span>
                <span className="status-value" style={{
                  color: processStatus === 'done' ? 'var(--green)'
                       : processStatus === 'error' ? 'var(--red)'
                       : processStatus === 'processing' ? 'var(--amber)'
                       : 'var(--text-400)'
                }}>
                  {processStatus === 'done' ? `✓ Done (${processedCount})` :
                   processStatus === 'processing' ? '⟳ Processing…' :
                   processStatus === 'error' ? '✗ Error' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Processing Overlay ── */}
      {showOverlay && (
        <div className="processing-overlay">
          <div className="processing-card">
            {processStatus === 'processing' && (<>
              <div className="processing-spinner" />
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-900)', marginBottom: 6 }}>
                Processing Images…
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-600)', marginBottom: 4 }}>
                Applying watermark to {images.length} image{images.length !== 1 ? 's' : ''}
              </p>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" />
              </div>
              <div className="processing-dots">
                <div className="processing-dot" />
                <div className="processing-dot" />
                <div className="processing-dot" />
              </div>
            </>)}

            {processStatus === 'done' && (<>
              <div className="success-circle">
                <svg viewBox="0 0 24 24" width="30" height="30">
                  <polyline className="success-check" points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-900)', marginBottom: 8 }}>
                All Done!
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-600)' }}>
                {processedCount} image{processedCount !== 1 ? 's' : ''} processed successfully
              </p>
            </>)}

            {processStatus === 'error' && (<>
              <div style={{ width:64,height:64, borderRadius:'50%', background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <XCircle size={36} color="var(--red)" />
              </div>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-900)', marginBottom: 8 }}>
                Processing Failed
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-600)' }}>
                Check the server logs and try again.
              </p>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}
