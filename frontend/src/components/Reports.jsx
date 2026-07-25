import React from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function Reports({ reportData, onDownloadCSV, onDownloadRawCSV, onDownloadAllCSVs, onDownloadReport }) {
  if (!reportData) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No report generated yet. Please upload a dataset and click "Process Data".
      </div>
    );
  }

  const { healthScore, beforeStats, afterStats, transformations, summary } = reportData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner & Downloads */}
      <div className="glass-panel" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: healthScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            border: `3px solid ${healthScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: healthScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {healthScore}%
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} style={{ color: 'var(--accent-emerald)' }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Dataset Health & Quality Score</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              {summary || 'Data processing completed successfully with high reliability.'}
            </p>
          </div>
        </div>

        {/* Download Buttons Group */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onDownloadCSV} style={{ background: 'var(--accent-emerald)' }}>
            <Download size={18} />
            Download Clean CSV
          </button>

          <button className="btn-secondary" onClick={onDownloadRawCSV}>
            <Download size={18} />
            Download Raw CSV
          </button>

          <button className="btn-secondary" onClick={onDownloadAllCSVs} style={{ border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
            <Download size={18} />
            Download All CSVs Package
          </button>

          <button className="btn-primary" onClick={onDownloadReport}>
            <FileText size={18} />
            Download HTML Report
          </button>
        </div>
      </div>

      {/* Before vs After Impact Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Rows Comparison
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Original:</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{beforeStats?.rows}</div>
            </div>
            <div style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)' }}>→</div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Processed:</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {afterStats?.rows}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Missing Cells Cleaned
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>Before: {beforeStats?.missing}</span>
            </div>
            <div style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)' }}>→</div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>After: {afterStats?.missing}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Duplicates Removed
          </h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {beforeStats?.duplicates || 0}
          </div>
        </div>

      </div>

      {/* AI Transformation Execution Log */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-secondary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Pipeline Audit Trail & Applied Actions</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transformations?.map((tx, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.04)',
              border: '1px solid var(--border-glass)'
            }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', shrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{tx}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
