export const generateInsights = (estadisticos, label = 'Muestra A') => {
  const insights = [];

  // Análisis de Tendencia Central
  insights.push(`La ${label} presenta una media de ${estadisticos.media} y una mediana de ${estadisticos.mediana}. ` +
    (Math.abs(estadisticos.media - estadisticos.mediana) < 0.5 
      ? "La cercanía entre estos valores sugiere una distribución equilibrada." 
      : "La diferencia entre la media y la mediana indica un desplazamiento de los datos respecto al centro teórico."));

  // Análisis de Dispersión
  if (estadisticos.desviacion > (estadisticos.rango / 4)) {
    insights.push(`Se observa una alta dispersión en los datos (Desviación: ${estadisticos.desviacion}), lo que indica que los valores están significativamente alejados del promedio.`);
  } else {
    insights.push(`La muestra presenta una dispersión moderada, con una desviación estándar de ${estadisticos.desviacion} unidades respecto a la media.`);
  }

  // Análisis de Sesgo
  insights.push(`En cuanto a la forma, la distribución se identifica como ${estadisticos.sesgo}.`);

  // Análisis de Curtosis
  insights.push(`El apuntamiento de la distribución es de tipo ${estadisticos.curtosis}, lo que define la concentración de datos en la zona central.`);

  // Análisis de Outliers
  if (estadisticos.outliers && estadisticos.outliers.length > 0) {
    insights.push(`¡Atención!: Se han detectado ${estadisticos.outliers.length} valores atípicos (${estadisticos.outliers.join(', ')}). Estos datos podrían distorsionar el análisis y deberían ser revisados.`);
  } else {
    insights.push("No se detectaron valores atípicos significativos, lo que garantiza la estabilidad estadística de la muestra.");
  }

  return insights;
};
