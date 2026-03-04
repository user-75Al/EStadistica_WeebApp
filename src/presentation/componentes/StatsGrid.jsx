import React from 'react';
import { Tooltip } from 'react-tooltip';
import { VscInfo, VscCopy } from 'react-icons/vsc';
import { toast } from 'react-hot-toast';
import 'react-tooltip/dist/react-tooltip.css';
import '../estilos/App.css';

const formulasInfo = {
  'Media': {
    titulo: "Media Aritmética",
    formula: "x̄ = (Σ xᵢ) / n",
    desc: "Promedio de los datos."
  },
  'Mediana': {
    titulo: "Mediana (Me)",
    formula: "Valor central ordenado",
    desc: "Punto medio de la muestra."
  },
  'Moda': {
    titulo: "Moda (Mo)",
    formula: "Frecuencia máxima",
    desc: "Valor que más se repite."
  },
  'Mínimo': {
    titulo: "Mínimo",
    formula: "x₍₁₎",
    desc: "Valor más bajo."
  },
  'Máximo': {
    titulo: "Máximo",
    formula: "x₍ₙ₎",
    desc: "Valor más alto."
  },
  'Rango': {
    titulo: "Rango (R)",
    formula: "R = Máx - Mín",
    desc: "Amplitud total de datos."
  },
  'Varianza': {
    titulo: "Varianza (s²)",
    formula: "Σ(xᵢ - x̄)² / (n - 1)",
    desc: "Promedio de los cuadrados de las desviaciones."
  },
  'Desviación': {
    titulo: "Desviación Estándar (s)",
    formula: "√s²",
    desc: "Dispersión promedio de los datos respecto a la media."
  }
};

const StatsGrid = ({ estadisticos }) => {
  const items = [
    { label: 'Media', value: estadisticos.media },
    { label: 'Mediana', value: estadisticos.mediana },
    { label: 'Moda', value: estadisticos.moda },
    { label: 'Mínimo', value: estadisticos.min },
    { label: 'Máximo', value: estadisticos.max },
    { label: 'Rango', value: estadisticos.rango },
    { label: 'Varianza', value: estadisticos.varianza },
    { label: 'Desviación', value: estadisticos.desviacion },
  ];

  const copiarEstadisticos = () => {
    const csv = items.map(i => `${i.label},${i.value}`).join('\n');
    navigator.clipboard.writeText(csv);
    toast.success('Estadísticos copiados al portapapeles');
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={copiarEstadisticos}
        className="copy-button-mini"
        title="Copiar como CSV"
        style={{
          position: 'absolute', top: '-45px', right: '0',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#888', padding: '5px 12px', borderRadius: '8px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.8rem', transition: 'all 0.3s ease',
          backdropFilter: 'blur(5px)'
        }}
      >
        <VscCopy /> Copiar CSV
      </button>

      <div className="stats-grid">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="stat-card glass"
            data-tooltip-id="formula-tooltip"
            data-tooltip-content={item.label}
            style={{ cursor: 'help' }}
          >
            <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {item.label} <VscInfo size={14} style={{ color: 'var(--color-sky)', opacity: 0.8 }} />
            </span>
            <span className="stat-value">{item.value}</span>
          </div>
        ))}
        
        <Tooltip 
          id="formula-tooltip" 
          style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100 }}
          render={({ content }) => (
            <div style={{ textAlign: 'left', padding: '10px', maxWidth: '280px' }}>
              <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{formulasInfo[content]?.titulo}</strong>
              <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{formulasInfo[content]?.formula}</p>
              <small style={{ color: '#aaa' }}>{formulasInfo[content]?.desc}</small>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default StatsGrid;
