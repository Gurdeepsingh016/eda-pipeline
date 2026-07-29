import React, { useState } from 'react';
import { Settings as SettingsIcon, Cpu, Server, Save, RotateCcw } from 'lucide-react';

export default function Settings({ settings, onSaveSettings }) {
  const [localSettings, setLocalSettings] = useState(settings || {
    apiEndpoint: 'http://localhost:8000/api',
    aiEngineModel: 'Gemini-Flash-Statistical',
    iqrThreshold: 1.5,
    zscoreThreshold: 3.0,
    exportFormat: 'html',
    autoDownloadCSV: false
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem' }}>
        <div className="settings-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Cpu size={18} style={{ color: 'var(--accent-secondary)' }} />
              <h4 style={{ fontWeight: 600 }}>Processing Engine</h4>
            </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Backend API URL
            </label>
            <input
              type="text"
              value={localSettings.apiEndpoint}
              onChange={(e) => setLocalSettings({ ...localSettings, apiEndpoint: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Cleaning Engine
            </label>
            <select
              value={localSettings.aiEngineModel}
              onChange={(e) => setLocalSettings({ ...localSettings, aiEngineModel: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                fontWeight: 600
              }}
            >
              <option value="Advanced-Statistical" style={{ background: 'white', color: 'var(--text-primary)' }}>Advanced Statistical Analysis</option>
              <option value="Standard-Heuristic" style={{ background: 'var(--bg-secondary)' }}>Standard Python SciPy Engine</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              IQR Outlier Multiplier (Default: 1.5)
            </label>
            <input
              type="number"
              step="0.1"
              value={localSettings.iqrThreshold}
              onChange={(e) => setLocalSettings({ ...localSettings, iqrThreshold: parseFloat(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Report Format
            </label>
            <select
              value={localSettings.exportFormat}
              onChange={(e) => setLocalSettings({ ...localSettings, exportFormat: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                fontWeight: 600
              }}
            >
              <option value="html" style={{ background: 'var(--bg-secondary)' }}>Interactive HTML Report</option>
              <option value="markdown" style={{ background: 'var(--bg-secondary)' }}>Markdown Report</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" className="btn-primary">
            <Save size={18} />
            Save Configuration
          </button>

          {savedMsg && (
            <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>
              ✓ Settings Saved Successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
