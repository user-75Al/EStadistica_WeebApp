import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { generateInsights, generateComparativeAI } from '../utils/insightGenerator';

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

  // Index Styles
  indexContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 8
  },
  indexTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E3A5F'
  },
  indexLink: {
    fontSize: 10,
    color: '#006BB4',
    marginBottom: 5,
    textDecoration: 'none'
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

  // Table Styles
  table: { 
    display: "table", 
    width: "100%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderColor: '#EEE',
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRow: { 
    flexDirection: "row",
    minHeight: 22,
    alignItems: 'center'
  }, 
  tableColHeader: { 
    width: "16.66%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderColor: '#EEE',
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    backgroundColor: '#1E3A5F'
  }, 
  tableCol: { 
    width: "16.66%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderColor: '#EEE',
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCellHeader: { 
    margin: 4, 
    fontSize: 7, 
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center'
  },
  tableCell: { 
    margin: 4, 
    fontSize: 7,
    textAlign: 'center'
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
    backgroundColor: '#162325', 
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
  
  // Insights Style
  insightItem: {
    marginBottom: 8,
    fontSize: 9,
    color: '#333',
    lineHeight: 1.4,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#CAF438'
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
    title: "ANÁLISIS DE PRIORIDADES (PARETO)", 
    desc: "Utilidad: Aplica el principio de Vilfredo Pareto (80/20) para separar los elementos 'vitales' de los 'triviales'. \nInterpretación: Las barras ordenadas de mayor a menor frecuencia, junto con la curva de porcentaje acumulado, permiten identificar qué conjunto de valores específicos representa el 80% del impacto total de la muestra, optimizando la toma de decisiones." 
  },
  { 
    title: "CAJA Y BIGOTES (BOXPLOT)", 
    desc: "Utilidad: Visualiza la dispersión y los cuartiles de la muestra. \nInterpretación: La caja central representa el 50% de los datos (IQR). Los 'bigotes' muestran el rango de los datos no atípicos, mientras que los puntos aislados identifican valores atípicos (outliers) que se alejan significativamente del patrón general." 
  },
  { 
    title: "SEGMENTACIÓN PROPORCIONAL (TOP 5 DOMINANTE)", 
    desc: "Utilidad: Visualiza la representatividad porcentual de los valores más recurrentes respecto al universo total. \nInterpretación: Ideal para determinar la dominancia de mercado o frecuencia. Cada sector circular cuantifica el peso relativo de los datos; un sector que supere el 25% indica una concentración significativa del valor sobre el resto de la muestra." 
  }
];

const getStemLeafData = (datos) => {
  const safeDatos = Array.isArray(datos) ? datos : [];
  if (safeDatos.length === 0) return [];
  const sorted = [...safeDatos].sort((a, b) => a - b);
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

const ReportePDF = ({ datosA = [], estadisticosA = {}, frecuenciasA = [], graficosImgsA = [], datosB = [], estadisticosB = {}, frecuenciasB = [], graficosImgsB = [], comparar, probabilidadA, probabilidadB }) => {
  const fecha = new Date().toLocaleString();
  const slA = getStemLeafData(datosA);
  const slB = getStemLeafData(datosB);
  
  const insightsA = generateInsights(estadisticosA || {}, 'Muestra A');
  const insightsB = comparar ? generateInsights(estadisticosB || {}, 'Muestra B') : { consistencia: '', volatilidad: '', prediccion: '' };
  const insightsComp = (comparar && estadisticosA && estadisticosB) ? generateComparativeAI(estadisticosA, estadisticosB) : [];

  const renderStats = (estadisticos, type = 'A') => (
    <View style={styles.statsGrid}>
      {estadisticos && Object.entries(estadisticos).map(([k, v]) => (
        <View key={k} style={[styles.statCard, type === 'A' ? styles.statCardA : styles.statCardB]}>
          <Text style={styles.statLabel}>{k.toUpperCase()}</Text>
          <Text style={styles.statValue}>{Array.isArray(v) ? v.join(', ') : String(v)}</Text>
        </View>
      ))}
    </View>
  );

  const renderFrequencyTable = (frecuencias) => (
    <View style={styles.table} wrap={true}> 
      <View style={styles.tableRow} wrap={false}> 
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>xᵢ</Text></View> 
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>fᵢ</Text></View> 
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>fᵣ</Text></View> 
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>fᵣ%</Text></View> 
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Fᵢ</Text></View> 
        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Fᵣ%</Text></View> 
      </View>
      {Array.isArray(frecuencias) && frecuencias.length > 0 ? frecuencias.map((row, i) => (
        <View key={i} style={styles.tableRow} wrap={false}> 
          <View style={styles.tableCol}><Text style={styles.tableCell}>{row.valor}</Text></View> 
          <View style={styles.tableCol}><Text style={styles.tableCell}>{row.fi}</Text></View> 
          <View style={styles.tableCol}><Text style={styles.tableCell}>{row.fr}</Text></View> 
          <View style={styles.tableCol}><Text style={styles.tableCell}>{(Number(row.fr || 0) * 100).toFixed(2)}%</Text></View> 
          <View style={styles.tableCol}><Text style={styles.tableCell}>{row.Fi}</Text></View> 
          <View style={styles.tableCol}><Text style={styles.tableCell}>{(Number(row.Fr || 0) * 100).toFixed(2)}%</Text></View> 
        </View>
      )) : <View style={styles.tableRow} wrap={false}><Text style={styles.tableCell}>No hay datos</Text></View>}
    </View>
  );

  const renderStemLeaf = (slData) => (
    <View style={styles.slContainer}>
      {Array.isArray(slData) && slData.length > 0 ? slData.map((row, i) => (
        <View key={i} style={styles.slRow} wrap={false}>
          <Text style={styles.slStem}>{row.stem}</Text>
          <Text style={styles.slLeaf}>{row.leaves}</Text>
        </View>
      )) : <Text style={{fontSize: 8, color: '#999'}}>No hay datos disponibles</Text>}
    </View>
  );

  const espacioMuestralA = Array.isArray(datosA) ? [...new Set(datosA)].sort((a,b)=>a-b).join(', ') : '';
  const espacioMuestralB = Array.isArray(datosB) ? [...new Set(datosB)].sort((a,b)=>a-b).join(', ') : '';

  return (
    <Document>
      {/* PORTADA E ÍNDICE INTERACTIVO */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>ANALYTICS REPORT</Text>
            <Text style={styles.subtitle}>{comparar ? 'Comparativa Avanzada de Muestras' : 'Análisis Estadístico Profesional'}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>Generado el {fecha}</Text>
            <Text style={[styles.dateText, {marginTop: 2}]}>StatMind AI V4.0 UHD</Text>
          </View>
        </View>

        <View style={styles.indexContainer}>
          <Text style={styles.indexTitle}>TABLA DE CONTENIDOS (Interactiva)</Text>
          <Text style={styles.indexLink}>1. Métricas Descriptivas y de Calidad</Text>
          <Text style={styles.indexLink}>2. Inteligencia Artificial: Dictamen Maestro</Text>
          {comparar && <Text style={styles.indexLink}>3. Análisis Comparativo Maestro (A vs B)</Text>}
          <Text style={styles.indexLink}>{comparar ? '4' : '3'}. Tablas de Distribución de Frecuencias</Text>
          <Text style={styles.indexLink}>{comparar ? '5' : '4'}. Análisis de Distribución (Tallo y Hoja)</Text>
          <Text style={styles.indexLink}>{comparar ? '6' : '5'}. Visualización Gráfica UHD</Text>
        </View>

        <View style={{ marginTop: 20, padding: 15, borderLeftWidth: 4, borderLeftColor: '#CAF438', backgroundColor: '#FBFBFC' }}>
          <Text style={{ fontSize: 10, lineHeight: 1.6, color: '#555' }}>
            Este documento integra el motor StatMind AI v4.0, proporcionando análisis predictivo y comparativas de estabilidad estadística de alta fidelidad.
          </Text>
        </View>
        
        <Text style={styles.footer} fixed>Reporte Estadístico UHD | StatMind AI Enabled</Text>
      </Page>

      {/* SECCIÓN 1: MÉTRICAS E INSIGHTS */}
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.sectionTitle}>I. Métricas Descriptivas y de Calidad</Text>
        </View>
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

        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>II. Inteligencia Artificial: Dictamen Maestro</Text>
          <View style={{ backgroundColor: '#F8F9FA', padding: 15, borderRadius: 6 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#006BB4', marginBottom: 10 }}>ANÁLISIS ESTRATÉGICO</Text>
            <Text style={styles.insightItem}>{insightsA.consistencia || 'Cargando análisis...'}</Text>
            <Text style={styles.insightItem}>{insightsA.volatilidad || 'Cargando análisis...'}</Text>
            <Text style={styles.insightItem}>{insightsA.prediccion || 'Cargando análisis...'}</Text>
            
            {comparar && (
              <>
                <View style={{marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEE'}}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#749c00', marginBottom: 10 }}>ANÁLISIS MUESTRA B</Text>
                  <Text style={styles.insightItem}>{insightsB.consistencia || 'Cargando análisis...'}</Text>
                  <Text style={styles.insightItem}>{insightsB.volatilidad || 'Cargando análisis...'}</Text>
                  <Text style={styles.insightItem}>{insightsB.prediccion || 'Cargando análisis...'}</Text>
                </View>
              </>
            )}
          </View>
        </View>
        
        <Text style={styles.footer} fixed>Página 2 | Reporte Estadístico UHD</Text>
      </Page>

      {/* NUEVA SECCIÓN: IA COMPARATIVA */}
      {comparar && (
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.sectionTitle}>III. Análisis Comparativo Maestro (A vs B)</Text>
          </View>
          <View style={{ backgroundColor: '#1E3A5F', padding: 20, borderRadius: 10 }}>
            <Text style={{ color: '#CAF438', fontSize: 12, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>
              DICTAMEN DE INTELIGENCIA COMPARATIVA
            </Text>
            {Array.isArray(insightsComp) && insightsComp.map((text, i) => (
              <View key={i} style={{ marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 10, lineHeight: 1.4 }}>{text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.footer} fixed>Página 3 | Reporte Estadístico UHD</Text>
        </Page>
      )}

      {/* SECCIÓN: TABLAS DE FRECUENCIA - MUESTRA A */}
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.sectionTitle}>{comparar ? 'IV. Tablas de Frecuencia - Muestra A' : 'III. Tablas de Distribución de Frecuencias'}</Text>
        </View>
        <View wrap={true}>
          {renderFrequencyTable(frecuenciasA)}
        </View>
        <Text style={styles.footer} fixed>Página {comparar ? '4' : '3'} | Reporte Estadístico UHD</Text>
      </Page>

      {/* SECCIÓN: TABLAS DE FRECUENCIA - MUESTRA B */}
      {comparar && (
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={[styles.sectionTitle, { backgroundColor: '#749c00' }]}>V. Tablas de Frecuencia - Muestra B</Text>
          </View>
          <View wrap={true}>
            {renderFrequencyTable(frecuenciasB)}
          </View>
          <Text style={styles.footer} fixed>Página 5 | Reporte Estadístico UHD</Text>
        </Page>
      )}

      {/* SECCIÓN: DISTRIBUCIÓN Y PROBABILIDAD */}
      <Page size="A4" style={styles.page}>
        <View id="section-dist">
          <Text style={styles.sectionTitle}>{comparar ? 'VI' : 'IV'}. Análisis de Distribución y Probabilidad</Text>
        </View>
        
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

        <View style={{marginTop: 20}}>
          <View style={styles.dualRow}>
            <View style={styles.column}>
              <Text style={[styles.colHeader, styles.colA]}>PROBABILIDAD A</Text>
              {probabilidadA ? (
                <View style={styles.probBox}>
                  <Text style={styles.probTitle}>Evento: {probabilidadA.condicion}</Text>
                  <Text style={styles.probValue}>P(E) = {probabilidadA.porcentaje}%</Text>
                  <Text style={styles.probSpace}>ESPACIO MUESTRAL: {"{ " + espacioMuestralA + " }"}</Text>
                </View>
              ) : <Text style={{fontSize: 8, color: '#999'}}>No se calculó probabilidad para A</Text>}
            </View>

            {comparar && (
              <View style={styles.column}>
                <Text style={[styles.colHeader, styles.colB]}>PROBABILIDAD B</Text>
                {probabilidadB ? (
                  <View style={styles.probBox}>
                    <Text style={styles.probTitle}>Evento: {probabilidadB.condicion}</Text>
                    <Text style={[styles.probValue, {color: '#749c00'}]}>P(E) = {probabilidadB.porcentaje}%</Text>
                    <Text style={styles.probSpace}>ESPACIO MUESTRAL: {"{ " + espacioMuestralB + " }"}</Text>
                  </View>
                ) : <Text style={{fontSize: 8, color: '#999'}}>No se calculó probabilidad para B</Text>}
              </View>
            )}
          </View>
        </View>
        
        <Text style={styles.footer} fixed>Página {comparar ? '6' : '4'} | Reporte Estadístico UHD</Text>
      </Page>

      {/* SECCIÓN: VISUALIZACIÓN GRÁFICA */}
      <Page size="A4" style={styles.page}>
        <View id="section-visual">
          <Text style={styles.sectionTitle}>{probabilidadA ? (comparar ? 'VII' : 'VI') : (comparar ? 'VI' : 'V')}. Visualización Gráfica UHD</Text>
        </View>

        {Array.isArray(graficosImgsA) && graficosImgsA.length > 0 ? (
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
                
                {comparar && Array.isArray(graficosImgsB) && graficosImgsB[i] && (
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
        
        <Text style={styles.footer} fixed>Página {comparar ? '7' : '5'} | Reporte Estadístico UHD</Text>
      </Page>
    </Document>
  );
};

export default ReportePDF;
