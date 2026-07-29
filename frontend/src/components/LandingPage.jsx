import React from 'react';
import { ArrowRight, Database, BarChart3, ShieldCheck, Sparkles, Zap, FileSpreadsheet } from 'lucide-react';

export default function LandingPage({ onLaunch }) {
  return (
    <div className="landing-container fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>EDA Pipeline Pro Edition</span>
          </div>
          <h1 className="hero-title">
            Data Cleaning & EDA,<br />
            <span className="text-gradient">Simplified for Professionals.</span>
          </h1>
          <p className="hero-subtitle">
            Instantly clean messy datasets, handle missing values, remove duplicates, and generate comprehensive exploratory data analysis reports right in your browser.
          </p>
          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={onLaunch}>
              Launch Application
              <ArrowRight size={18} />
            </button>
            <a href="https://github.com/Gurdeepsingh016/eda-pipeline" target="_blank" rel="noopener noreferrer" className="btn-secondary hero-btn">
              View Source Code
            </a>
          </div>
        </div>
        
        {/* Mockup / Abstract Visual */}
        <div className="hero-visual">
          <div className="glass-panel mockup-window">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-title">eda-pipeline-dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-row skeleton-title"></div>
              <div className="mockup-row skeleton-text w-full"></div>
              <div className="mockup-row skeleton-text w-3/4"></div>
              
              <div className="mockup-grid">
                <div className="mockup-card">
                  <Database size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                  <div className="skeleton-title sm"></div>
                </div>
                <div className="mockup-card">
                  <BarChart3 size={24} style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }} />
                  <div className="skeleton-title sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Powerful Features. <span className="text-muted">Zero Friction.</span></h2>
          <p>Everything you need to prepare your data for machine learning or reporting.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper blue">
              <Zap size={24} />
            </div>
            <h3>Automated Cleaning</h3>
            <p>Automatically detect and impute missing values, drop null columns, and eliminate duplicate records with a single click.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper cyan">
              <BarChart3 size={24} />
            </div>
            <h3>Instant EDA</h3>
            <p>Generate beautiful distribution charts, correlation matrices, and statistical summaries instantly without writing Python code.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper purple">
              <FileSpreadsheet size={24} />
            </div>
            <h3>Exportable Reports</h3>
            <p>Download cleaned datasets (CSV) and shareable HTML/Markdown audit reports detailing every transformation applied.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper emerald">
              <ShieldCheck size={24} />
            </div>
            <h3>Secure & Local</h3>
            <p>Your data never leaves your machine unless you connect a custom backend. The robust client-side engine handles processing securely.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} EDA Pipeline. Developed by Gurdeep Singh.</p>
      </footer>
    </div>
  );
}
