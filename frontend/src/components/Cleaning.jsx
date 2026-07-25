import React, { useState } from 'react';
import { Sliders, Sparkles, Trash2, Filter, Cpu, Play, CheckCircle2 } from 'lucide-react';

export default function Cleaning({ dataset, onProcessData, isProcessing }) {
  const [missingStrategy, setMissingStrategy] = useState('mean'); // 'drop', 'mean', 'median', 'mode', 'fill_zero'
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [outlierStrategy, setOutlierStrategy] = useState('iqr_clip'); // 'none', 'iqr_clip', 'zscore_drop'
  const [enableAICleaning, setEnableAICleaning] = useState(true);
  const [normalizeStrings, setNormalizeStrings] = useState(true);
  const [selectedColsToDrop, setSelectedColsToDrop] = useState([]);

  if (!dataset) return null;

  const toggleColDrop = (col) => {
    setSelectedColsToDrop(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProcessData({
      missingStrategy,
      removeDuplicates,
      outlierStrategy,
      enableAICleaning,
      normalizeStrings,
      droppedColumns: selectedColsToDrop
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <form onSubmit={handleSubmit}>
        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Missing Values Strategy */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Filter size={20} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Missing Values Handling</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'mean', label: 'Impute with Column Mean (Numeric)', desc: 'Replace missing numbers with average' },
                { id: 'median', label: 'Impute with Column Median', desc: 'Robust against extreme outliers' },
                { id: 'mode', label: 'Impute with Most Frequent (Mode)', desc: 'Ideal for categorical columns' },
                { id: 'fill_zero', label: 'Fill with Zero / "Unknown"', desc: 'Simple constant value fill' },
                { id: 'drop', label: 'Drop Rows with Missing Values', desc: 'Remove any row containing NaN' },
              ].map(opt => (
                <label key={opt.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  background: missingStrategy === opt.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.03)',
                  border: `1px solid ${missingStrategy === opt.id ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="missingStrategy"
                    value={opt.id}
                    checked={missingStrategy === opt.id}
                    onChange={(e) => setMissingStrategy(e.target.value)}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Outlier & Duplicate Options */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Sliders size={20} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Outliers & Duplicates</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Duplicate check */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Remove Duplicate Rows</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Drop exact identical record copies</div>
                </div>
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
                />
              </label>

              {/* Outlier handling options */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Outlier Handling Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { id: 'iqr_clip', label: 'Cap Outliers (IQR Method)', desc: 'Clip values outside 1.5 * IQR' },
                    { id: 'zscore_drop', label: 'Drop Outliers (Z-Score > 3)', desc: 'Remove extreme statistical anomalies' },
                    { id: 'none', label: 'Keep Outliers Intact', desc: 'Do not modify extreme values' },
                  ].map(opt => (
                    <label key={opt.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: outlierStrategy === opt.id ? 'rgba(6, 182, 212, 0.1)' : 'rgba(99, 102, 241, 0.02)',
                      border: `1px solid ${outlierStrategy === opt.id ? 'var(--accent-cyan)' : 'var(--border-glass)'}`,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="outlierStrategy"
                        value={opt.id}
                        checked={outlierStrategy === opt.id}
                        onChange={(e) => setOutlierStrategy(e.target.value)}
                      />
                      <div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{opt.label}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Smart Clean & Advanced Options */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Sparkles size={20} style={{ color: 'var(--accent-secondary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Smart Clean & Formatting</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: enableAICleaning ? 'rgba(139, 92, 246, 0.12)' : 'rgba(99, 102, 241, 0.03)',
                border: `1px solid ${enableAICleaning ? 'var(--accent-secondary)' : 'var(--border-glass)'}`,
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Cpu size={16} style={{ color: 'var(--accent-secondary)' }} />
                    Enable AI Auto-Cleaner
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated column type inference & smart repair</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableAICleaning}
                  onChange={(e) => setEnableAICleaning(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-secondary)' }}
                />
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.03)',
                border: '1px solid var(--border-glass)',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Normalize Text Fields</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Trim whitespaces, lowercase, remove extra spaces</div>
                </div>
                <input
                  type="checkbox"
                  checked={normalizeStrings}
                  onChange={(e) => setNormalizeStrings(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
              </label>
            </div>
          </div>

        </div>

        {/* Drop Columns Selector */}
        <div className="glass-panel" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Select Columns to Exclude/Drop (Optional)
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {dataset.columns.map((col, idx) => {
              const isDropped = selectedColsToDrop.includes(col);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleColDrop(col)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isDropped ? 'rgba(244, 63, 94, 0.12)' : 'rgba(99, 102, 241, 0.04)',
                    color: isDropped ? 'var(--accent-rose)' : 'var(--text-secondary)',
                    border: `1px solid ${isDropped ? 'var(--accent-rose)' : 'var(--border-glass)'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isDropped ? `✓ ${col} (Drop)` : col}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Process Button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isProcessing}
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
          >
            {isProcessing ? (
              <>Running AI Data Cleaner...</>
            ) : (
              <>
                <Play size={20} />
                Process Data
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
