import React, { useMemo } from 'react';
import '../estilos/ExplicacionCards.css';

const ExplicacionProcedimiento = ({ resultados, resultadosB, comparar, pasos: pasosProp }) => {
  const pasos = useMemo(() => {
    // Si se pasan pasos directos (como en Regresión, Distribuciones, etc.)
    if (pasosProp) return pasosProp;

    // Si es el modo comparativo de Cálculos
    if (comparar && resultados && resultadosB) {
      const diffMedia = (resultados.estadisticos.media - resultadosB.estadisticos.media).toFixed(2);
      return [
        {
          titulo: "Comparativa de Tendencia",
          desc: `La diferencia entre los promedios es de ${Math.abs(diffMedia)} unidades. ${Math.abs(diffMedia) > 1 ? 'Existe una disparidad notable en el nivel central de las muestras.' : 'Ambas muestras mantienen una tendencia central similar.'}`,
          formula: `Δx̄ = |x̄A - x̄B| = ${Math.abs(diffMedia)}`
        },
        {
          titulo: "Análisis de Dispersión",
          desc: `La Muestra ${resultados.estadisticos.desviacion > resultadosB.estadisticos.desviacion ? 'A' : 'B'} presenta mayor variabilidad interna, lo que sugiere datos más heterogéneos frente a su contraparte.`,
          formula: `sA: ${resultados.estadisticos.desviacion} vs sB: ${resultadosB.estadisticos.desviacion}`
        },
        {
          titulo: "Conclusión de Sesgo",
          desc: "Se analiza la asimetría de ambos conjuntos. Esto revela si las muestras comparten la misma naturaleza de distribución o si tienen comportamientos opuestos.",
          formula: "Sesgo = (Media - Mediana)"
        }
      ];
    }

    // Si es modo individual de Cálculos
    if (resultados) {
      const { estadisticos, datosOriginales } = resultados;
      const tieneOutliers = estadisticos.outliers && estadisticos.outliers.length > 0;
      
      return [
        {
          titulo: "1. Calidad de Datos",
          desc: `${tieneOutliers ? `Se detectaron ${estadisticos.outliers.length} valores atípicos (${estadisticos.outliers.join(', ')}). ` : 'Muestra limpia sin valores atípicos significativos. '} El rango intercuartílico es de ${estadisticos.iqr}.`,
          formula: `IQR = Q3 - Q1 = ${estadisticos.iqr}`
        },
        {
          titulo: "2. Morfología",
          desc: `La distribución se comporta como ${estadisticos.sesgo} y presenta una curtosis de tipo ${estadisticos.curtosis}.`,
          formula: `Sesgo: ${estadisticos.media} vs ${estadisticos.mediana}`
        },
        {
          titulo: "3. Dispersión UHD",
          desc: `Con una desviación de ${estadisticos.desviacion} y varianza de ${estadisticos.varianza}, los datos muestran un nivel de ${Number(estadisticos.desviacion) > 2 ? 'alta' : 'baja'} concentración.`,
          formula: `s = ${estadisticos.desviacion}`
        }
      ];
    }

    return [];
  }, [resultados, resultadosB, comparar, pasosProp]);

  if (pasos.length === 0) return null;

  return (
    <div className="explicacion-container">
      {pasos.map((paso, idx) => (
        <div key={idx} className="card-explicacion">
          <p className="card-title">{paso.titulo}</p>
          <div className="small-desc">
            {paso.desc}
            {paso.formula && <span className="formula-text">{paso.formula}</span>}
          </div>
          <div className="go-corner">
            <div className="go-arrow">→</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExplicacionProcedimiento;
