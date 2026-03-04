import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import '../estilos/App.css';

const InputForm = ({ onCalculate, onRandom, error, onClearError }) => {
  const [inputValue, setInputValue] = useState('');
  const [stats, setStats] = useState({ valid: 0, total: 0 });

  useEffect(() => {
    const nums = inputValue.split(/[\s,]+/).filter(n => n.trim() !== "" && !isNaN(n));
    setStats({
      valid: nums.length,
      total: inputValue.split(/[\s,]+/).filter(n => n.trim() !== "").length
    });
  }, [inputValue]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      const extension = file.name.split('.').pop().toLowerCase();

      reader.onload = (e) => {
        let content = '';
        if (extension === 'csv' || extension === 'txt') {
          content = e.target.result;
          if (extension === 'csv') {
            const parsed = Papa.parse(content, { header: false, skipEmptyLines: true });
            content = parsed.data.flat().join(', ');
          }
        } else if (extension === 'xlsx' || extension === 'xls') {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          content = json.flat().filter(v => v != null).join(', ');
        }
        
        setInputValue(prev => prev ? `${prev}, ${content}` : content);
        toast.success(`Archivo ${file.name} cargado`);
      };

      if (extension === 'xlsx' || extension === 'xls') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    noClick: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(inputValue);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) onClearError();
  };

  return (
    <div {...getRootProps()} className={`form-container ${isDragActive ? 'drag-active' : ''}`}>
      <input {...getInputProps()} />
      <div className="form">
        <span className="heading">Ingresa tus datos numéricos</span>
        <span className="c1">Mínimo 20 números separados por comas o espacios</span>
        
        {isDragActive && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(202, 244, 56, 0.2)',
            border: '2px dashed var(--color-lime)',
            borderRadius: '20px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)'
          }}>
            <span style={{ color: 'var(--color-lime)', fontWeight: 'bold', fontSize: '1.5rem' }}>🚀 Suelta tus archivos</span>
          </div>
        )}

        <textarea 
          className="input" 
          placeholder="Ej: 5, 8, 10, 15, 20, 8, 30... O arrastra un archivo (.csv, .xlsx, .txt)" 
          value={inputValue}
          onChange={handleInputChange}
          style={{
            ...(error ? { borderLeft: '5px solid var(--color-red)', backgroundColor: 'rgba(222, 68, 59, 0.05)' } : {}),
            height: '100px',
            padding: '15px',
            resize: 'none',
            marginBottom: '10px'
          }}
        />

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.8rem', 
          marginBottom: '15px',
          padding: '0 5px'
        }}>
          <span style={{ color: stats.valid < 20 ? '#ffcc00' : 'var(--color-lime)' }}>
            ✅ {stats.valid} números detectados
          </span>
          {stats.total > stats.valid && (
            <span style={{ color: 'var(--color-red)' }}>
              ⚠️ {stats.total - stats.valid} errores (omitidos)
            </span>
          )}
        </div>

        {error && (
          <p style={{ 
            color: 'var(--color-red)', 
            fontSize: '0.9rem', 
            marginTop: '-5px', 
            marginBottom: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
          </p>
        )}
        <div className="button-container">
          <div className="send-button" onClick={handleSubmit}>Calcular</div>
          <div className="reset-button-container">
            <div className="reset-button" onClick={() => onRandom()}>Generar datos random</div>
          </div>
        </div>
      </div>
      <style>{`
        .drag-active { transform: scale(1.02); }
      `}</style>
    </div>
  );
};

export default InputForm;
