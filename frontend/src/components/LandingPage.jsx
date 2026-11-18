import React, { useState } from 'react';
import {
  ExternalLink,
  Upload,
  Play,
  Zap,
  Layers,
  Download,
  Image as ImageIcon,
  Type,
  Eye,
  LayoutGrid,
  FolderArchive,
  ImagePlus,
  Sliders,
  ChevronRight,
  Rocket,
  QrCode,
  Minimize2,
  MoreHorizontal,
  Sparkles,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Send,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ShieldCheck,
  Heart
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ onStart }) {
  const [activeNav, setActiveNav] = useState('home');
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToSection = (id, navName) => {
    setActiveNav(navName);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <div className="landing-container">
      <div className="landing-ambient-bg" />

      <div className="landing-inner">
        {/* ── 1. Header / Navbar ── */}
        <header className="landing-navbar">
          <div className="landing-brand" onClick={() => scrollToSection('top', 'home')}>
            <img src="/logo 2.png" alt="SnapTag Logo" className="landing-logo-img" />
          </div>

          <nav>
            <ul className="landing-nav-links">
              <li>
                <button
                  type="button"
                  className={`landing-nav-link ${activeNav === 'home' ? 'active' : ''}`}
                  onClick={() => scrollToSection('top', 'home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`landing-nav-link ${activeNav === 'features' ? 'active' : ''}`}
                  onClick={() => scrollToSection('features', 'features')}
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`landing-nav-link ${activeNav === 'coming-soon' ? 'active' : ''}`}
                  onClick={() => scrollToSection('coming-soon', 'coming-soon')}
                >
                  Coming Soon
                </button>
              </li>
            </ul>
          </nav>

          <button className="btn-open-snaptag" onClick={onStart}>
            <span>Open SnapTag</span>
            <ExternalLink size={15} />
          </button>
        </header>

        {/* ── 2. Hero Section ── */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Add Watermarks to<br />
              Hundreds of Images<br />
              <span className="highlight-container">
                in Seconds
                <svg
                  className="highlight-underline"
                  viewBox="0 0 240 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5C65 2.5 175 1.5 237 9.5"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="hero-subtitle">
              Upload multiple images, add your logo or text watermark,
              customize it, and download all in a single click.
            </p>

            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={onStart}>
                <Upload size={17} />
                <span>Try SnapTag Now</span>
                <ArrowRight size={17} />
              </button>

              <button
                className="btn-hero-secondary"
                onClick={() => scrollToSection('how-it-works', 'home')}
              >
                <Play size={16} fill="currentColor" />
                <span>See How It Works</span>
              </button>
            </div>

            <div className="hero-features-row">
              <div className="hero-feature-item">
                <Zap size={15} />
                <span>Bulk Processing</span>
              </div>
              <div className="hero-feature-item">
                <Layers size={15} />
                <span>Customizable Watermark</span>
              </div>
              <div className="hero-feature-item">
                <Download size={15} />
                <span>ZIP Download</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <div className="hero-sparkle-decor">
              <div className="sparkle-stroke" />
              <div className="sparkle-stroke" />
              <div className="sparkle-stroke" />
            </div>

            <div className="hero-image-card">
              <img
                src="/project-images/hero_section.png"
                alt="SnapTag Watermark Before and After Preview"
                onError={(e) => {
                  if (e.target.src.indexOf('/hero_section.png') === -1) {
                    e.target.src = '/hero_section.png';
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* ── 3. Features Section ── */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">Everything You Need to Watermark Images</h2>
          </div>

          <div className="features-grid">
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Upload size={24} />
              </div>
              <h3 className="feature-title">Bulk Upload</h3>
              <p className="feature-desc">Upload hundreds of images at once</p>
            </div>

            {/* Card 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <ImageIcon size={24} />
              </div>
              <h3 className="feature-title">Logo Watermark</h3>
              <p className="feature-desc">Add your PNG logo with full control</p>
            </div>

            {/* Card 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Type size={24} />
              </div>
              <h3 className="feature-title">Text Watermark</h3>
              <p className="feature-desc">Add custom text, color and opacity</p>
            </div>

            {/* Card 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Eye size={24} />
              </div>
              <h3 className="feature-title">Live Preview</h3>
              <p className="feature-desc">See changes in real time</p>
            </div>

            {/* Card 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <LayoutGrid size={24} />
              </div>
              <h3 className="feature-title">Position Presets</h3>
              <p className="feature-desc">
                Top Left, Top Right, Bottom Left, Bottom Right, Center
              </p>
            </div>

            {/* Card 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <FolderArchive size={24} />
              </div>
              <h3 className="feature-title">One-click ZIP Download</h3>
              <p className="feature-desc">Get all tagged images in a single file</p>
            </div>
          </div>
        </section>

        {/* ── 4. How It Works Section ── */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header">
            <div className="pill-badge">
              <Play size={13} fill="currentColor" />
              <span>How It Works</span>
            </div>
            <h2 className="section-title">Watermark Your Images in 3 Simple Steps</h2>
          </div>

          <div className="steps-row">
            {/* Step 1 */}
            <div className="step-card">
              <span className="step-number-badge">1</span>
              <div className="step-icon-wrap">
                <ImagePlus size={32} />
              </div>
              <h3 className="step-title">Upload Images</h3>
              <p className="step-desc">Drag & drop or select multiple images</p>
            </div>

            <div className="step-arrow-divider">
              <ChevronRight size={26} strokeWidth={2.5} />
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <span className="step-number-badge">2</span>
              <div className="step-icon-wrap">
                <Sliders size={32} />
              </div>
              <h3 className="step-title">Set Watermark</h3>
              <p className="step-desc">Add a logo or text and customize the style</p>
            </div>

            <div className="step-arrow-divider">
              <ChevronRight size={26} strokeWidth={2.5} />
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <span className="step-number-badge">3</span>
              <div className="step-icon-wrap">
                <Download size={32} />
              </div>
              <h3 className="step-title">Download</h3>
              <p className="step-desc">Process and download all images as a ZIP file</p>
            </div>
          </div>
        </section>

        {/* ── 5. Coming Soon Section ── */}
        <section id="coming-soon" className="coming-soon-section">
          <div className="coming-soon-banner">
            <div className="coming-soon-left">
              <div className="rocket-icon-wrap">
                <Rocket size={34} />
              </div>
              <h2 className="coming-soon-heading">
                New Features<br />
                Coming Soon!
              </h2>
            </div>

            <div className="coming-soon-divider" />

            <div className="coming-soon-right">
              <p className="coming-soon-desc">
                We're working on more useful features to make SnapTag even better.
              </p>
              <div className="coming-soon-pills">
                <div className="cs-pill">
                  <Layers size={15} />
                  <span>Watermark Templates</span>
                </div>
                <div className="cs-pill">
                  <QrCode size={15} />
                  <span>QR Code Watermark</span>
                </div>
                <div className="cs-pill">
                  <ImageIcon size={15} />
                  <span>Image Compression</span>
                </div>
                <div className="cs-pill">
                  <MoreHorizontal size={15} />
                  <span>And More</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Ready to Tag CTA Banner ── */}
        <section className="cta-banner-section">
          <div className="cta-banner-box">
            <div className="cta-decor-watermark">
              <ImageIcon />
            </div>

            <h2 className="cta-title">Ready to Tag Your Images?</h2>
            <p className="cta-subtitle">
              Start watermarking your images for free with SnapTag.
            </p>

            <button className="btn-cta-white" onClick={onStart}>
              <Upload size={17} />
              <span>Try SnapTag Now</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>

      {/* ── 7. Premium Interactive Footer ── */}
      <footer className="interactive-footer">
        <div className="footer-glow-top" />

        <div className="footer-container">
          {/* Main Footer Columns */}
          <div className="footer-main-grid">
            {/* Column 1: Brand & Status */}
            <div className="footer-col footer-col-brand">
              <div className="footer-brand" onClick={() => scrollToSection('top', 'home')}>
                <img src="/logo 2.png" alt="SnapTag Logo" className="footer-logo-img" />
              </div>

              <p className="footer-brand-bio">
                The high-performance bulk photo watermarking platform.
                Overlay transparent PNG logos and custom text stamps across hundreds of photos in seconds.
              </p>

              {/* Live engine status indicator */}
              <div className="footer-engine-status" title="Sharp engine is active and ready">
                <span className="status-dot" />
                <span className="status-text">Processing Engine: <strong>Online</strong> (Sharp/vips)</span>
              </div>

              {/* Interactive Social Buttons */}
              <div className="footer-social-row">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" title="GitHub">
                  <Github size={17} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" title="Twitter / X">
                  <Twitter size={17} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" title="LinkedIn">
                  <Linkedin size={17} />
                </a>
                <a href="mailto:support@snaptag.local" className="social-btn" title="Email Support">
                  <Mail size={17} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div className="footer-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-col-links">
                <li>
                  <button type="button" onClick={() => scrollToSection('top', 'home')}>
                    Home Overview
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('features', 'features')}>
                    Features & Presets
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('how-it-works', 'home')}>
                    How It Works
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('coming-soon', 'coming-soon')}>
                    Upcoming Roadmap
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-highlight" onClick={onStart}>
                    <span>Launch Editor</span>
                    <span className="tag-free">Free</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Capabilities */}
            <div className="footer-col">
              <h4 className="footer-col-title">Capabilities</h4>
              <ul className="footer-col-links">
                <li><span>Batch Upload (5,000+ files)</span></li>
                <li><span>PNG Transparency Compositing</span></li>
                <li><span>Dynamic SVG Text Watermarks</span></li>
                <li><span>Interactive Drag Placement</span></li>
                <li><span>One-Click Streaming ZIP Export</span></li>
              </ul>
            </div>

            {/* Column 4: Interactive Updates Newsletter */}
            <div className="footer-col footer-col-newsletter">
              <h4 className="footer-col-title">Stay Updated</h4>
              <p className="footer-newsletter-desc">
                Get notified when new watermark templates, QR code stamps, and presets launch.
              </p>

              {isSubscribed ? (
                <div className="newsletter-success-box">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>You're in! We'll notify you on new features.</span>
                </div>
              ) : (
                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                  <div className="newsletter-input-wrap">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="newsletter-input"
                    />
                    <button type="submit" className="newsletter-submit-btn" title="Subscribe">
                      <Send size={15} />
                    </button>
                  </div>
                  <span className="newsletter-hint">No spam. Unsubscribe anytime.</span>
                </form>
              )}
            </div>
          </div>

          {/* Interactive Utility Bar: Trust badges + Back to top */}
          <div className="footer-utility-bar">
            <div className="footer-trust-badges">
              <div className="trust-badge">
                <ShieldCheck size={16} color="#38bdf8" />
                <span>Zero Account Needed</span>
              </div>
              <div className="trust-badge">
                <Zap size={16} color="#f59e0b" />
                <span>High-Speed Local Processing</span>
              </div>
              <div className="trust-badge">
                <Sparkles size={16} color="#a855f7" />
                <span>Lossless Quality Retained</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-back-to-top"
              onClick={() => scrollToSection('top', 'home')}
              title="Back to Top"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>

          {/* Bottom Copyright & Credit */}
          <div className="footer-bottom-bar">
            <div className="footer-copy-text">
              © 2026 SnapTag. All rights reserved.
            </div>

            <div className="footer-heart-credit">
              <span>Crafted with</span>
              <Heart size={14} fill="#ef4444" color="#ef4444" className="heart-icon" />
              <span>for photographers and creators worldwide.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
