import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica', 
    backgroundColor: '#FFFFFF',
    color: '#162325'
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25, 
    borderBottomWidth: 3, 
    borderBottomColor: '#1E3A5F', 
    paddingBottom: 15 
  },
  headerLeft: {
    flexDirection: 'column'
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1E3A5F', 
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 9,
    color: '#666',
    marginTop: 4,
    textTransform: 'uppercase'
  },
  headerRight: {
    textAlign: 'right'
  },
  dateText: { 
    fontSize: 8, 
    color: '#888' 
  },

  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    backgroundColor: '#1E3A5F',
    padding: 6,
    marginBottom: 15, 
    textTransform: 'uppercase', 
    textAlign: 'left',
    width: '100%'
  },
  
  // Layout
  dualRow: { 
    flexDirection: 'row', 
    gap: 20,
    marginBottom: 20
  },
  column: { 
    flex: 1 
  },
  colHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingBottom: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  colA: { color: '#006BB4', borderBottomColor: '#006BB4' },
  colB: { color: '#749c00', borderBottomColor: '#749c00' },

  // Stats Grid
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 6
  },
  statCard: { 
    width: '48%', 
    padding: 8, 
    backgroundColor: '#F8F9FA', 
    borderLeftWidth: 3,
    borderLeftStyle: 'solid', 
    marginBottom: 4,
    borderRadius: 2
  },
  statCardA: { borderLeftColor: '#006BB4' },
  statCardB: { borderLeftColor: '#749c00' },
  statLabel: { 
    fontSize: 6, 
    color: '#888', 
    fontWeight: 'bold',
    marginBottom: 2
  },
  statValue: { 
    fontSize: 10, 
    fontWeight: 'bold',
    color: '#162325' 
  },
  
  // Stem & Leaf
  slContainer: { 
    padding: 10, 
    backgroundColor: '#F1F3F5', 
    borderRadius: 4
  },
  slRow: { 
    flexDirection: 'row', 
    paddingVertical: 2,
    alignItems: 'center'
  },
  slStem: { 
    width: 25, 
    fontWeight: 'bold', 
    textAlign: 'right', 
    paddingRight: 8, 
    borderRightWidth: 2, 
    borderRightColor: '#CAF438', 
    fontSize: 9,
    color: '#1E3A5F'
  },
  slLeaf: { 
    paddingLeft: 8, 
    letterSpacing: 2, 
    fontFamily: 'Courier', 
    fontSize: 9,
    color: '#444'
  },
  
  // MODERN CHART SECTION
  chartWrapper: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#FBFBFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#CAF438',
    paddingLeft: 10
  },
  chartTitle: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#1E3A5F'
  },
  chartLayout: {
    flexDirection: 'row',
    gap: 15
  },
  chartImageContainer: {
    flex: 1,
    backgroundColor: '#162325', // Fondo oscuro para que resalten las gráficas UHD
    borderRadius: 6,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chartImage: { 
    width: '100%', 
    height: 180, 
    objectFit: 'contain' 
  },
  chartLabel: {
    fontSize: 7,
    color: '#EEE',
    marginBottom: 5,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  chartDescContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  chartDesc: { 
    fontSize: 8, 
    color: '#555', 
    lineHeight: 1.5, 
    textAlign: 'justify'
  },
  
  // Probability
  probBox: { 
    padding: 15, 
    backgroundColor: '#E9ECEF', 
    borderLeftWidth: 5, 
    borderLeftColor: '#006BB4', 
    marginTop: 10,
    borderRadius: 4
  },
  probTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#006BB4',
    marginBottom: 5
  },
  probValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1E3A5F'
  },
  probSpace: {
    marginTop: 8,
    fontSize: 7,
    color: '#666',
    fontFamily: 'Courier'
  },

  footer: { 
    position: 'absolute', 
    bottom: 25, 
    left: 40, 
    right: 40, 
    textAlign: 'center', 
    fontSize: 8, 
    color: '#BBB',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10
  }
});

const chartMeta = [
  { 
    title: "DISTRIBUCIÓN DE FRECUENCIAS Y POLÍGONO (HISTOGRAMA)", 
    desc: "Utilidad: Permite visualizar la morfología de la distribución, identificando la tendencia central y la dispersión. \nInterpretación: Observe las barras más altas para identificar las clases con mayor densidad de datos. El polígono de frecuencias superpuesto facilita la detección de asimetrías (sesgo a la derecha o izquierda) y la uniformidad de la muestra analizada." 
  },
  { 
    title: "ANÁLISIS DE ACUMULACIÓN LINEAL (CURVA DE OJIVA)", 
    desc: "Utilidad: Esta gráfica representa el crecimiento acumulativo de las frecuencias relativas. \nInterpretación: Es fundamental para el cálculo visual de percentiles. Una pendiente pronunciada indica un rango de valores donde se acumula una gran cantidad de datos en un intervalo corto, mientras que una meseta refleja zonas de baja frecuencia o ausencia de datos." 
  },
  { 
    title: "PRIORIZACIÓN ESTADÍSTICA (DIAGRAMA DE PARETO)", 
    desc: "Utilidad: Aplica el principio de Vilfredo Pareto (80/20) para separar los elementos 'vitales' de los 'triviales'. \nInterpretación: Las barras ordenadas de mayor a menor frecuencia, junto con la curva de porcentaje acumulado, permiten identificar qué conjunto de valores específicos representa el 80% del impacto total de la muestra, optimizando la toma de decisiones." 
  },
  { 
    title: "SEGMENTACIÓN PROPORCIONAL (TOP 5 DOMINANTE)", 
    desc: "Utilidad: Visualiza la representatividad porcentual de los valores más recurrentes respecto al universo total. \nInterpretación: Ideal para determinar la dominancia de mercado o frecuencia. Cada sector circular cuantifica el peso relativo de los datos; un sector que supere el 25% indica una concentración significativa del valor sobre el resto de la muestra." 
  }
];

const getStemLeafData = (datos) => {
  if (!datos || datos.length === 0) return [];
  const sorted = [...datos].sort((a, b) => a - b);
  const grupos = {};

  sorted.forEach(num => {
    let tallo, hoja;
    if (Number.isInteger(num)) {
      tallo = Math.floor(Math.abs(num) / 10);
      if (num < 0) tallo = -tallo;
      hoja = Math.abs(num) % 10;
    } else {
      tallo = Math.floor(num);
      hoja = Math.round((num - tallo) * 10);
    }
    if (!grupos[tallo]) grupos[tallo] = [];
    grupos[tallo].push(hoja);
  });

  return Object.entries(grupos)
    .map(([stem, leaves]) => ({ 
      stem, 
      leaves: leaves.sort((a, b) => a - b).join(' ') 
    }))
    .sort((a, b) => parseInt(a.stem) - parseInt(b.stem));
};

const ReportePDF = ({ datosA, estadisticosA, frecuenciasA, graficosImgsA, datosB, estadisticosB, frecuenciasB, graficosImgsB, comparar, probabilidadA }) => {
  const fecha = new Date().toLocaleString();
  const slA = getStemLeafData(datosA);
  const slB = getStemLeafData(datosB);

  const renderStats = (estadisticos, type = 'A') => (
    <View style={styles.statsGrid}>
      {Object.entries(estadisticos).map(([k, v]) => (
        <View key={k} style={[styles.statCard, type === 'A' ? styles.statCardA : styles.statCardB]}>
          <Text style={styles.statLabel}>{k.toUpperCase()}</Text>
          <Text style={styles.statValue}>{Array.isArray(v) ? v.join(', ') : v}</Text>
        </View>
      ))}
    </View>
  );

  const renderStemLeaf = (slData) => (
    <View style={styles.slContainer}>
      {slData.length > 0 ? slData.map((row, i) => (
        <View key={i} style={styles.slRow}>
          <Text style={styles.slStem}>{row.stem}</Text>
          <Text style={styles.slLeaf}>{row.leaves}</Text>
        </View>
      )) : <Text style={{fontSize: 8, color: '#999'}}>No hay datos disponibles</Text>}
    </View>
  );

  return (
    <Document>
      {/* PÁGINA 1: RESUMEN ANALÍTICO */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>ANALYTICS REPORT</Text>
            <Text style={styles.subtitle}>{comparar ? 'Comparativa Avanzada de Muestras' : 'Análisis Estadístico Profesional'}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>Generado el {fecha}</Text>
            <Text style={[styles.dateText, {marginTop: 2}]}>Software V2.5 UHD</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>I. Métricas Descriptivas</Text>
        <View style={styles.dualRow}>
          <View style={styles.column}>
            <Text style={[styles.colHeader, styles.colA]}>MUESTRA A</Text>
            {renderStats(estadisticosA, 'A')}
          </View>
          {comparar && (
            <View style={styles.column}>
              <Text style={[styles.colHeader, styles.colB]}>MUESTRA B</Text>
              {renderStats(estadisticosB, 'B')}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>II. Análisis de Distribución (Tallo y Hoja)</Text>
        <View style={styles.dualRow}>
          <View style={styles.column}>
            <Text style={[styles.colHeader, styles.colA]}>MUESTRA A</Text>
            {renderStemLeaf(slA)}
          </View>
          {comparar && (
            <View style={styles.column}>
              <Text style={[styles.colHeader, styles.colB]}>MUESTRA B</Text>
              {renderStemLeaf(slB)}
            </View>
          )}
        </View>

        {probabilidadA && (
          <View style={{marginTop: 10}}>
            <Text style={styles.sectionTitle}>III. Análisis Probabilístico</Text>
            <View style={styles.probBox}>
              <Text style={styles.probTitle}>Evento Calculado (Muestra A): {probabilidadA.condicion}</Text>
              <Text style={styles.probValue}>P(E) = {probabilidadA.porcentaje}%</Text>
              <Text style={styles.probSpace}>ESPACIO MUESTRAL: {"{ " + [...new Set(datosA)].sort((a,b)=>a-b).join(', ') + " }"}</Text>
            </View>
          </View>
        )}
        
        <Text style={styles.footer} fixed>Página 1 | Reporte Estadístico UHD</Text>
      </Page>

      {/* PÁGINA 2: VISUALIZACIÓN GRÁFICA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>VISUAL ANALYTICS</Text>
            <Text style={styles.subtitle}>Representación Gráfica en Alta Resolución</Text>
          </View>
        </View>

        {graficosImgsA && graficosImgsA.length > 0 ? (
          graficosImgsA.map((img, i) => (
            <View key={i} style={styles.chartWrapper} wrap={false}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>{chartMeta[i]?.title || `GRÁFICO ANALÍTICO ${i + 1}`}</Text>
              </View>
              
              <View style={styles.chartLayout}>
                <View style={styles.chartImageContainer}>
                  <Text style={styles.chartLabel}>Muestra A</Text>
                  {img && <Image src={img} style={styles.chartImage} />}
                </View>
                
                {comparar && graficosImgsB && graficosImgsB[i] && (
                  <View style={styles.chartImageContainer}>
                    <Text style={styles.chartLabel}>Muestra B</Text>
                    <Image src={graficosImgsB[i]} style={styles.chartImage} />
                  </View>
                )}
              </View>

              <View style={styles.chartDescContainer}>
                <Text style={styles.chartDesc}>
                  {chartMeta[i]?.desc || "Interpretación técnica no disponible para este módulo gráfico."}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{padding: 40, textAlign: 'center'}}>
            <Text style={{color: '#999', fontSize: 12}}>No se capturaron visualizaciones para este reporte.</Text>
          </View>
        )}
        
        <Text style={styles.footer} fixed>Página 2 | Reporte Estadístico UHD</Text>
      </Page>
    </Document>
  );
};

export default ReportePDF;
