import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity, Grid } from 'lucide-react';

export default function Charts({ edaData }) {
  const [selectedCol, setSelectedCol] = useState(
    edaData?.columns?.[0] || ''
  );

  const PALETTES = {
    'Neon Cyber': ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#d946ef', '#ec4899', '#3b82f6'],
    'Sunset Glow': ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#e11d48', '#d97706', '#c026d3', '#ea580c', '#e11d48'],
    'Emerald Mint': ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0', '#047857', '#15803d', '#14b8a6', '#0d9488'],
    'Ocean Breeze': ['#06b6d4', '#38bdf8', '#3b82f6', '#60a5fa', '#0284c7', '#2563eb', '#1d4ed8', '#0284c7', '#0369a1'],
    'Purple Haze': ['#8b5cf6', '#a855f7', '#d946ef', '#c084fc', '#7e22ce', '#9333ea', '#6b21a8', '#a855f7', '#c084fc']
  };

  const [activePalette, setActivePalette] = useState('Neon Cyber');
  const [customSegmentColors, setCustomSegmentColors] = useState({});

  if (!edaData) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No EDA charts available yet. Please click "Process Data" first.
      </div>
    );
  }

  const defaultPalette = PALETTES[activePalette] || PALETTES['Neon Cyber'];

  // Distribution chart data for selected column
  const colDistribution = edaData.distributions?.[selectedCol] || [];
  
  // Get color for a specific slice index / bin label
  const getSliceColor = (binLabel, index) => {
    if (customSegmentColors[binLabel]) {
      return customSegmentColors[binLabel];
    }
    return defaultPalette[index % defaultPalette.length];
  };

  const handleColorChange = (binLabel, newColor) => {
    setCustomSegmentColors(prev => ({
      ...prev,
      [binLabel]: newColor
    }));
  };

  // Custom Label Renderer for Pie Chart Slices (Dark crisp text for light card background)
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#0f172a"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="11"
        fontWeight="700"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  // Correlation Matrix Data
  const correlationMatrix = edaData.correlation || {};
  const corrCols = Object.keys(correlationMatrix);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Selector Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Exploratory Feature Analysis</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Feature:</label>
          <select
            value={selectedCol}
            onChange={(e) => setSelectedCol(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'white',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border-glass)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600
            }}
          >
            {edaData.columns?.map((col, i) => (
              <option key={i} value={col} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        
        {/* Column Distribution Histogram / Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Frequency Distribution: <span style={{ color: 'var(--accent-primary)' }}>{selectedCol}</span>
          </h4>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={colDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.10)" />
                <XAxis dataKey="bin" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)' }}
                />
                <Bar dataKey="count" fill={defaultPalette[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorical Breakdown Pie Chart - CLEAN LIGHT THEME (NO BLACK) */}
        <div style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          color: '#0f172a'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Feature Value Proportion: <span style={{ color: '#2563eb' }}>{selectedCol}</span>
            </h4>
            
            {/* Color Theme Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Theme:</span>
              <select
                value={activePalette}
                onChange={(e) => setActivePalette(e.target.value)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {Object.keys(PALETTES).map((palName, i) => (
                  <option key={i} value={palName} style={{ background: '#ffffff', color: '#0f172a' }}>
                    🎨 {palName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ width: '100%', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={colDistribution.slice(0, 7)}
                  dataKey="count"
                  nameKey="bin"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={4}
                  label={renderCustomizedLabel}
                  labelLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                >
                  {colDistribution.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getSliceColor(entry.bin, index)} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Per-Segment Color Pickers & Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {colDistribution.slice(0, 7).map((entry, idx) => {
              const currentColor = getSliceColor(entry.bin, idx);
              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  color: '#334155',
                  background: '#ffffff',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(entry.bin, e.target.value)}
                    style={{
                      width: '18px',
                      height: '18px',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      background: 'none'
                    }}
                    title={`Click to change color for ${entry.bin}`}
                  />
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{entry.bin}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Correlation Matrix Table */}
      {corrCols.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Grid size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Numerical Pearson Correlation Heatmap</h4>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  {corrCols.map((c, i) => <th key={i}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {corrCols.map((rowCol, rIdx) => (
                  <tr key={rIdx}>
                    <td style={{ fontWeight: 700 }}>{rowCol}</td>
                    {corrCols.map((colCol, cIdx) => {
                      const val = correlationMatrix[rowCol]?.[colCol] || 0;
                      const absVal = Math.abs(val);
                      const bg = val > 0 
                        ? `rgba(99, 102, 241, ${absVal * 0.7})` 
                        : `rgba(244, 63, 94, ${absVal * 0.7})`;
                      return (
                        <td
                          key={cIdx}
                          style={{
                            background: bg,
                            color: absVal > 0.35 ? '#fff' : 'var(--text-primary)',
                            fontWeight: absVal > 0.5 ? 700 : 400,
                            textAlign: 'center'
                          }}
                        >
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
