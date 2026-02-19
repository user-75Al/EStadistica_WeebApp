import React from 'react';
import StatsGrid from '../componentes/StatsGrid';
import TablaFrecuencias from '../componentes/TablaFrecuencias';
import Graficos from '../componentes/Graficos';
import ClearButton from '../componentes/ClearButton';
import InputForm from '../componentes/InputForm';
import Probabilidad from '../componentes/Probabilidad';

const CalculosPage = ({ 
  modo, 
  resultados, 
  onCalculate, 
  onRandom, 
  onClear 
}) => {
  
  if (!resultados && modo === 'manual') {
    return (
      <div className="calculos-page input-view">
        <InputForm onCalculate={onCalculate} onRandom={onRandom} />
      </div>
    );
  }

  if (!resultados) return null;

  return (
    <div className="calculos-page results-view">
      <div className="results-header">
        <h2>Análisis de Datos</h2>
        <div className="data-preview">
           <strong>Datos ({resultados.datosOriginales.length}):</strong> 
           <p>{resultados.datosOriginales.join(', ')}</p>
        </div>
      </div>

      <section className="results-section">
        <h3>Estadísticos Básicos</h3>
        <StatsGrid estadisticos={resultados.estadisticos} />
      </section>

      <Probabilidad datos={resultados.datosOriginales} />

      <div className="results-flex">
        <section className="results-section table-section">
          <h3>Tabla de Frecuencias</h3>
          <TablaFrecuencias frecuencias={resultados.frecuencias} />
        </section>

        <section className="results-section charts-section">
          <h3>Representación Gráfica</h3>
          <Graficos 
            frecuencias={resultados.frecuencias} 
            datosOriginales={resultados.datosOriginales} 
          />
        </section>
      </div>

      <div className="footer-actions">
        <ClearButton onClick={onClear} />
      </div>
    </div>
  );
};

export default CalculosPage;