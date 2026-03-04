import React, { useMemo } from 'react';
import '../estilos/ExplicacionCards.css';

const ExplicacionProcedimiento = ({ resultados }) => {
  const pasos = useMemo(() => {
    if (!resultados) return [];
    
    const { estadisticos, datosOriginales } = resultados;
    
    return [
      {
        titulo: "1. Preparación de Datos",
        desc: `Se recolectaron ${datosOriginales.length} datos. El primer paso fue ordenarlos de forma ascendente para facilitar el cálculo de la mediana y los cuartiles.`,
        formula: `Muestra (n) = ${datosOriginales.length}`
      },
      {
        titulo: "2. Medidas Centrales",
        desc: `Calculamos el promedio (Media: ${estadisticos.media}), el valor central (Mediana: ${estadisticos.mediana}) y el valor más frecuente (Moda: ${Array.isArray(estadisticos.moda) ? estadisticos.moda.join(', ') : estadisticos.moda}).`,
        formula: `x̄ = Σx / n`
      },
      {
        titulo: "3. Dispersión",
        desc: `Determinamos qué tan alejados están los datos del promedio. La desviación estándar es de ${estadisticos.desviacion}, indicando la variabilidad de la muestra.`,
        formula: `s = √[Σ(x - x̄)² / (n-1)]`
      },
      {
        titulo: "4. Rango y Amplitud",
        desc: `La diferencia entre el valor máximo (${estadisticos.max}) y el mínimo (${estadisticos.min}) nos da un rango total de ${estadisticos.rango}.`,
        formula: `R = Máx - Mín`
      }
    ];
  }, [resultados]);

  if (!resultados || pasos.length === 0) return null;

  return (
    <div className="results-section" style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
      <h3 style={{ marginBottom: '2rem', textAlign: 'left', color: 'var(--color-lime)' }}>
        Interpretación Paso a Paso
      </h3>
      <div className="explicacion-container">
        {pasos.map((paso, idx) => (
          <div key={idx} className="card-explicacion">
            <p className="card-title">{paso.titulo}</p>
            <div className="small-desc">
              {paso.desc}
              <span className="formula-text">{paso.formula}</span>
            </div>
            <div className="go-corner">
              <div className="go-arrow">→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplicacionProcedimiento;
