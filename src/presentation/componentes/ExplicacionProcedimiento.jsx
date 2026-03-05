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

    // MODO INDIVIDUAL: IA PREDICTIVA Y RECOMENDACIÓN COMPLETA (6 Tarjetas)
    if (resultados) {
      const { estadisticos } = resultados;
      const insights = generateInsights(estadisticos);
      const tieneOutliers = estadisticos.outliers && estadisticos.outliers.length > 0;
      
      return [
        // FILA 1: ESTRATÉGICAS
        {
          titulo: "🎯 RECOMENDACIÓN TÉCNICA",
          desc: insights.consistencia,
          formula: "Prueba de Asimetría"
        },
        {
          titulo: "📉 ANÁLISIS DE ESTABILIDAD",
          desc: insights.volatilidad,
          formula: "Coeficiente de Variación"
        },
        {
          titulo: "🔮 PREDICCIÓN (FORECASTING)",
          desc: insights.prediccion,
          formula: "Intervalo Probabilístico 68%"
        },
        // FILA 2: TÉCNICAS / IA PROFUNDA
        {
          titulo: "💼 INFERENCIA ESTADÍSTICA",
          desc: insights.inferencia,
          formula: "Confianza al 95% (Z=1.96)"
        },
        {
          titulo: "🧬 MORFOLOGÍA DE DATOS",
          desc: insights.morfologia,
          formula: "Análisis de Distribución"
        },
        {
          titulo: "🛡️ CALIDAD DE MUESTRA",
          desc: tieneOutliers 
            ? `¡Atención!: Se detectaron ${estadisticos.outliers.length} valores atípicos (${estadisticos.outliers.join(', ')}). Estos datos podrían distorsionar el análisis.` 
            : "Muestra limpia: No se detectaron valores atípicos significativos que afecten la integridad de los resultados.",
          formula: "Algoritmo de Tukey (IQR)"
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
