import React, { useMemo } from 'react';
import { generateInsights, generateComparativeAI } from '../utils/insightGenerator';
import '../estilos/ExplicacionCards.css';

const ExplicacionProcedimiento = ({ resultados, resultadosB, comparar, pasos: pasosProp }) => {
  const pasos = useMemo(() => {
    if (pasosProp) return pasosProp;

    // MODO COMPARATIVO: IA AVANZADA A vs B
    if (comparar && resultados && resultadosB) {
      const insightsIA = generateComparativeAI(resultados.estadisticos, resultadosB.estadisticos);
      
      return [
        {
          titulo: "🤖 IA COMPARATIVA: ESTABILIDAD",
          desc: insightsIA[0] || "Ambas muestras presentan una estabilidad similar.",
          formula: "CV = (s/x̄) * 100"
        },
        {
          titulo: "🤖 IA COMPARATIVA: MAGNITUD",
          desc: insightsIA[1] || "No hay diferencias significativas en la escala de los promedios.",
          formula: "Δ% = ((xB - xA) / xA) * 100"
        },
        {
          titulo: "🏆 CONCLUSIÓN MAESTRA",
          desc: insightsIA[2] || "Ambas muestras son válidas, elija según su objetivo de riesgo.",
          formula: "Análisis Multivariable StatMind"
        }
      ];
    }

    // MODO INDIVIDUAL: IA PREDICTIVA Y RECOMENDACIÓN
    if (resultados) {
      const { estadisticos } = resultados;
      const insights = generateInsights(estadisticos);
      
      return [
        {
          titulo: "🎯 RECOMENDACIÓN TÉCNICA",
          desc: insights[0],
          formula: "|x̄ - Me| > 10%?"
        },
        {
          titulo: "🔮 PREDICCIÓN (FORECASTING)",
          desc: insights[2],
          formula: "P(x) = x̄ ± 1s"
        },
        {
          titulo: "🧬 ANÁLISIS DE MORFOLOGÍA",
          desc: insights[3],
          formula: "Sesgo & Curtosis"
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
