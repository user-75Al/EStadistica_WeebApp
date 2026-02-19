import React from 'react';
import '../estilos/App.css';

const TablaFrecuencias = ({ frecuencias }) => {
  return (
    <div className="table-wrapper">
      <table className="frecuencias-table">
        <thead>
          <tr>
            <th>Valor (x)</th>
            <th>fi</th>
            <th>fr</th>
            <th>Fi</th>
            <th>Fr</th>
          </tr>
        </thead>
        <tbody>
          {frecuencias.map((row, index) => (
            <tr key={index}>
              <td>{row.valor}</td>
              <td>{row.fi}</td>
              <td>{row.fr}</td>
              <td>{row.Fi}</td>
              <td>{row.Fr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaFrecuencias;