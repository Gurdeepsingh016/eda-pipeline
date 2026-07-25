import React, { useState } from 'react';
import { Database, Rows, Columns, AlertTriangle, Copy, ArrowRight } from 'lucide-react';

export default function Dashboard({ dataset, onProceedToCleaning }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!dataset) return null;

  const totalRows = dataset.rows;
  const totalCols = dataset.columns.length;
  const totalCells = totalRows * totalCols;

  // Calculate missing values and duplicates
  let missingCount = 0;
  const columnStats = dataset.columns.map((col) => {
    let colNulls = 0;
    const uniqueValues = new Set();
    let isNumeric = true;

    dataset.rawRows.forEach((row) => {
      const val = row[col];
      if (val === null || val === undefined || val === '') {
        colNulls++;
        missingCount++;
      } else {
        uniqueValues.add(val);
        if (isNaN(Number(val))) {
          isNumeric = false;
        }
      }
    });

    return {
      name: col,
      nulls: colNulls,
      unique: uniqueValues.size,
      type: isNumeric ? 'Numeric' : 'Categorical'
    };
  });

  // Calculate Duplicate Rows (simplified JSON string check)
  const rowStrings = dataset.rawRows.map(r => JSON.stringify(r));
  const duplicateCount = rowStrings.length - new Set(rowStrings).size;

  const totalPages = Math.ceil(dataset.rawRows.length / rowsPerPage);
  const paginatedRows = dataset.rawRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Stat Cards */}
      <div className="stat-grid">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">File Info</span>
            <Database size={18} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <span className="stat-value" style={{ fontSize: '1.25rem' }}>{dataset.fileName}</span>
          <span className="stat-subtext">{dataset.fileSize}</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Rows</span>
            <Rows size={18} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <span className="stat-value">{totalRows.toLocaleString()}</span>
          <span className="stat-subtext">Records</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Columns</span>
            <Columns size={18} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <span className="stat-value">{totalCols}</span>
          <span className="stat-subtext">Features</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Missing Values</span>
            <AlertTriangle size={18} style={{ color: missingCount > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }} />
          </div>
          <span className="stat-value" style={{ color: missingCount > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
            {missingCount}
          </span>
          <span className="stat-subtext">{((missingCount / totalCells) * 100).toFixed(1)}% of total cells</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Duplicates</span>
            <Copy size={18} style={{ color: duplicateCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }} />
          </div>
          <span className="stat-value" style={{ color: duplicateCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {duplicateCount}
          </span>
          <span className="stat-subtext">Identical rows</span>
        </div>
      </div>

      {/* Column Schema Summary */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Column Schema & Profiling</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {columnStats.map((col, idx) => (
            <div key={idx} style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.04)',
              border: '1px solid var(--border-glass)'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                {col.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                <span>Type:</span>
                <span style={{ color: col.type === 'Numeric' ? 'var(--accent-cyan)' : 'var(--accent-secondary)', fontWeight: 600 }}>{col.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                <span>Nulls:</span>
                <span style={{ color: col.nulls > 0 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>{col.nulls}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Unique:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{col.unique}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data Preview Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Data Preview (First {totalRows} Rows)</h3>
          <button className="btn-primary" onClick={onProceedToCleaning}>
            Select Cleaning Options
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                {dataset.columns.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td>{(currentPage - 1) * rowsPerPage + rIdx + 1}</td>
                  {dataset.columns.map((col, cIdx) => {
                    const val = row[col];
                    const isNull = val === null || val === undefined || val === '';
                    return (
                      <td key={cIdx}>
                        {isNull ? <span className="null-cell">NaN</span> : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing page {currentPage} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="btn-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
