export const generateInsights = (estadisticos, label = 'Muestra A') => {
  const insights = {};

  // 1. CONSISTENCIA (Recomendador)
  const diffMediaMediana = Math.abs(estadisticos.media - estadisticos.mediana);
  const isAsymmetric = diffMediaMediana > (estadisticos.media * 0.1); 

  insights.consistencia = isAsymmetric
    ? `📊 RECOMENDACIÓN: Sus datos son altamente asimétricos. Le sugerimos utilizar la MEDIANA (${estadisticos.mediana}) como medida de tendencia central más confiable, ya que la media está siendo distorsionada por valores extremos.`
    : `✅ CONSISTENCIA: La media y la mediana son similares, lo que indica una distribución equilibrada. Puede confiar plenamente en el PROMEDIO (${estadisticos.media}) para sus cálculos.`;

  // 2. VOLATILIDAD (Dispersión)
  const esVolatil = Number(estadisticos.desviacion) > (estadisticos.media * 0.5);
  insights.volatilidad = esVolatil
    ? `⚠️ ALTA VOLATILIDAD: La desviación estándar es muy alta respecto al promedio. Los datos están muy dispersos y los resultados podrían ser poco predecibles.`
    : `📉 ESTABILIDAD: La muestra presenta una dispersión moderada, lo que garantiza una mayor previsibilidad en los resultados analizados.`;

  // 3. PREDICCIÓN (Forecasting)
  const limiteInf = (Number(estadisticos.media) - Number(estadisticos.desviacion)).toFixed(2);
  const limiteSup = (Number(estadisticos.media) + Number(estadisticos.desviacion)).toFixed(2);
  insights.prediccion = `🔮 PREDICCIÓN: Existe un 68% de probabilidad de que el próximo dato que ingrese se encuentre en el rango de ${limiteInf} a ${limiteSup}.`;

  // 4. ANÁLISIS DE FORMA (Morfología)
  insights.morfologia = `🧬 MORFOLOGÍA: En cuanto a la forma, la distribución es ${estadisticos.sesgo} con un apuntamiento ${estadisticos.curtosis}.`;

  // 5. INFERENCIA
  insights.inferencia = `💼 INFERENCIA: Con un 95% de confianza, el verdadero promedio poblacional se encuentra en el intervalo ${estadisticos.ic}. El margen de error es de ±${estadisticos.margenError}.`;

  return insights;
};

export const generateComparativeAI = (statsA, statsB) => {
  const comparative = [];
  const vA = (statsA.desviacion / statsA.media) * 100;
  const vB = (statsB.desviacion / statsB.media) * 100;
  
  if (Math.abs(vA - vB) > 5) {
    const masEstable = vA < vB ? 'Muestra A' : 'Muestra B';
    const porcentaje = Math.abs(vA - vB).toFixed(1);
    comparative.push(`📉 ESTABILIDAD: La ${masEstable} es un ${porcentaje}% más estable y predecible que su contraparte.`);
  } else {
    comparative.push(`⚖️ EQUILIBRIO: Ambas muestras presentan niveles de riesgo y dispersión muy similares.`);
  }

  const diffPromedio = (((statsB.media - statsA.media) / statsA.media) * 100).toFixed(1);
  if (Math.abs(diffPromedio) > 0) {
    const sentido = diffPromedio > 0 ? 'superior' : 'inferior';
    comparative.push(`📈 MAGNITUD: El promedio de la Muestra B es un ${Math.abs(diffPromedio)}% ${sentido} al de la Muestra A.`);
  }

  if (vA < vB && statsA.media > statsB.media) {
    comparative.push(`🏆 INSIGHT MAESTRO: La Muestra A es la opción superior, ofreciendo valores más altos con una mayor seguridad estadística.`);
  }

  return comparative;
};

export const generateConjuntosAI = (resultados) => {
  const insights = [];
  if (resultados.interseccion.length === 0) {
    insights.push("🔍 OBSERVACIÓN: Los conjuntos son DISJUNTOS (ajenos). No comparten ningún elemento común, lo que indica una independencia total entre ambas categorías.");
  } else {
    const coincidencia = ((resultados.interseccion.length / resultados.union.length) * 100).toFixed(1);
    insights.push(`📊 AFINIDAD: Existe un ${coincidencia}% de coincidencia entre ambos conjuntos. El núcleo común lo forman ${resultados.interseccion.length} elementos.`);
  }
  if (resultados.diferenciaAB.length > resultados.diferenciaBA.length) {
    insights.push("💡 PREDOMINIO: El Conjunto A tiene una mayor carga de elementos exclusivos frente al Conjunto B.");
  }
  return insights;
};

export const generateDistribucionesAI = (tipo, params, resultado) => {
  const insights = [];
  if (tipo === 'binomial') {
    if (params.p > 0.7) insights.push("📈 ALTA EXPECTATIVA: La probabilidad de éxito es muy dominante. Es altamente probable que los resultados se concentren en valores altos de K.");
    else if (params.p < 0.3) insights.push("📉 BAJA EXPECTATIVA: El éxito es un evento raro en este modelo. Los resultados tenderán hacia el fracaso en la mayoría de los ensayos.");
    insights.push(`🎯 PRECISIÓN: Hay un ${resultado.porcentaje}% de probabilidad exacta de obtener ${params.k} éxitos.`);
  } else if (tipo === 'normal') {
    if (Math.abs(resultado.z) > 2) {
      insights.push(`⚠️ VALOR EXTREMO: El valor X está a más de 2 desviaciones estándar. Se considera un evento atípico o poco frecuente (Z=${resultado.z}).`);
    } else {
      insights.push("✅ NORMALIDAD: El valor analizado se encuentra dentro del rango de comportamiento esperado para esta población.");
    }
  }
  return insights;
};

export const generateCombinatoriaAI = (n, r, p, c) => {
  const insights = [];
  const ratio = (c / p * 100).toFixed(2);
  insights.push(`🧬 ESTRUCTURA: Al no importar el orden, el número de combinaciones representa solo el ${ratio}% del total de permutaciones posibles.`);
  if (n > 15) {
    insights.push("🚀 ALTA COMPLEJIDAD: El espacio muestral ha crecido exponencialmente. La probabilidad de elegir una combinación específica al azar es extremadamente baja.");
  }
  return insights;
};

export const generateRegresionAI = (resultados) => {
  const insights = [];
  const r = Math.abs(Number(resultados.correlacion));
  
  if (r > 0.8) insights.push(`🔥 CORRELACIÓN FUERTE: Existe una dependencia lineal muy clara entre X e Y. El modelo es excelente para realizar predicciones.`);
  else if (r > 0.5) insights.push(`📈 CORRELACIÓN MODERADA: Hay una tendencia visible, pero existen otros factores que también influyen en el comportamiento de Y.`);
  else insights.push(`⚠️ CORRELACIÓN DÉBIL: Las variables parecen actuar de forma independiente. No se recomienda usar este modelo para proyecciones críticas.`);

  insights.push(`💡 EXPLICACIÓN: Su modelo explica el ${(resultados.determinacion * 100).toFixed(1)}% de la variabilidad de los datos analizados.`);
  return insights;
};
