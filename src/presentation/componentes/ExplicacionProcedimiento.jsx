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
      return [
        {
          titulo: "1. Preparación",
          desc: `Se procesaron ${datosOriginales.length} datos ordenados. Este es el cimiento para localizar la mediana y definir los límites de la muestra.`,
          formula: `n = ${datosOriginales.length}`
        },
        {
          titulo: "2. Centro de Datos",
          desc: `La media (${estadisticos.media}) y la mediana (${estadisticos.mediana}) nos indican el punto de equilibrio y el valor central real de la muestra.`,
          formula: `x̄ = Σx/n`
        },
        {
          titulo: "3. Variabilidad",
          desc: `Con una desviación de ${estadisticos.desviacion}, cuantificamos qué tan dispersos están los valores individuales respecto al promedio calculado.`,
          formula: `s = √[Σ(x-x̄)²/(n-1)]`
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
