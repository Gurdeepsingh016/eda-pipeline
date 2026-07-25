import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import Papa from 'papaparse';

export default function Upload({ onDataLoaded, sampleDatasets }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const parseCSV = (file) => {
    setError('');
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const columns = Object.keys(results.data[0]);
          onDataLoaded({
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(1) + ' KB',
            rows: results.data.length,
            columns: columns,
            rawRows: results.data,
            fileObj: file
          });
        } else {
          setError('The CSV file is empty or invalid.');
        }
      },
      error: (err) => {
        setError('Error parsing CSV file: ' + err.message);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('csv') || file.name.endsWith('.csv')) {
        parseCSV(file);
      } else {
        setError('Please upload a valid .csv file.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      parseCSV(e.target.files[0]);
    }
  };

  const loadSample = (sample) => {
    setError('');
    setFileName(sample.name);
    Papa.parse(sample.content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const columns = Object.keys(results.data[0]);
        // Create Blob to simulate File object
        const blob = new Blob([sample.content], { type: 'text/csv' });
        const fileObj = new File([blob], sample.name, { type: 'text/csv' });
        onDataLoaded({
          fileName: sample.name,
          fileSize: (sample.content.length / 1024).toFixed(1) + ' KB',
          rows: results.data.length,
          columns: columns,
          rawRows: results.data,
          fileObj: fileObj
        });
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative' }}>
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2rem',
            background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.02)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--accent-primary)',
            border: '1px solid var(--border-active)'
          }}>
            <UploadCloud size={36} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Upload CSV Dataset
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Drag and drop your dataset file here, or click to browse
          </p>

          <label className="btn-primary" style={{ cursor: 'pointer' }}>
            <FileSpreadsheet size={18} />
            Select CSV File
            <input type="file" accept=".csv" onChange={handleFileSelect} style={{ display: 'none' }} />
          </label>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--accent-rose)',
              marginTop: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Sample Datasets Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Or Try a Preset Sample Dataset</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {sampleDatasets.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => loadSample(sample)}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.04)',
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sample.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{sample.description}</p>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--accent-primary)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
