import React from 'react';
import '../estilos/App.css';

const StatsGrid = ({ estadisticos }) => {
  const items = [
    { label: 'Media', value: estadisticos.media },
    { label: 'Mediana', value: estadisticos.mediana },
    { label: 'Moda', value: estadisticos.moda },
    { label: 'Mínimo', value: estadisticos.min },
    { label: 'Máximo', value: estadisticos.max },
    { label: 'Rango', value: estadisticos.rango },
  ];

  return (
    <div className="stats-grid">
      {items.map((item, index) => (
        <div key={index} className="stat-card">
          <span className="stat-label">{item.label}</span>
          <span className="stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;