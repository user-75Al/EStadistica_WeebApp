import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#1E3A5F',
    paddingBottom: 15,
    alignItems: 'center'
  },
  title: { fontSize: 24, color: '#1E3A5F', fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 10, color: '#666', marginTop: 4 },
  section: { marginBottom: 15 },
  sectionTitle: { 
    fontSize: 12, 
    color: '#006BB4', 
    borderBottomWidth: 1, 
    borderBottomStyle: 'solid', 
    borderBottomColor: '#eee', 
    paddingBottom: 3, 
    marginBottom: 8, 
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: { 
    width: '23%', 
    backgroundColor: '#f8f9fa', 
    padding: 8, 
    borderRadius: 4, 
    borderLeftWidth: 3, 
    borderLeftStyle: 'solid', 
    borderLeftColor: '#1E3A5F', 
    marginBottom: 6 
  },
  statLabel: { fontSize: 7, color: '#666', textTransform: 'uppercase' },
  statValue: { fontSize: 10, fontWeight: 'bold', color: '#1E3A5F' },
  probContainer: { backgroundColor: '#f0f7ff', padding: 10, borderRadius: 6, borderWidth: 0.5, borderStyle: 'solid', borderColor: '#bcd7f3' },
  diagContainer: { backgroundColor: '#fff9f0', padding: 10, borderRadius: 6, borderWidth: 0.5, borderStyle: 'solid', borderColor: '#ffe4bc', marginTop: 8 },
  monoText: { fontFamily: 'Courier', fontSize: 8, color: '#444', backgroundColor: '#fff', padding: 6, marginTop: 4, borderRadius: 4, borderWidth: 0.5, borderStyle: 'solid', borderColor: '#ddd' },
  table: { display: 'table', width: '100%' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomStyle: 'solid', borderBottomColor: '#eee', minHeight: 18, alignItems: 'center' },
  tableHeader: { backgroundColor: '#1E3A5F', color: '#ffffff', fontWeight: 'bold' },
  tableRowAlt: { backgroundColor: '#f2f6f9' },
  tableCol: { width: '20%', textAlign: 'center', fontSize: 8 },
  chartImage: { width: '100%', height: 'auto', maxHeight: 220, marginVertical: 8, objectFit: 'contain' },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', color: '#999', fontSize: 8 }
});

const chartLabels = ["Histograma", "Polígono", "Ojiva", "Pareto", "Pastel"];

const ReportePDF = ({ datos, estadisticos, frecuencias, graficosImgs, probabilidad }) => {
  const fecha = new Date().toLocaleDateString();
  const espacioMuestral = [...new Set(datos)].sort((a, b) => a - b);

  return (
    <Document title="Reporte Estadístico">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Reporte de Análisis Estadístico</Text>
          <Text style={styles.subtitle}>Medidas de tendencia, dispersión y diagnóstico de calidad</Text>
          <Text style={{ fontSize: 8, color: '#888', marginTop: 4 }}>Emisión: {fecha} | n = {datos.length}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Estadísticos Descriptivos</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}><Text style={styles.statLabel}>Media</Text><Text style={styles.statValue}>{estadisticos.media}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Mediana</Text><Text style={styles.statValue}>{estadisticos.mediana}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Moda</Text><Text style={styles.statValue}>{estadisticos.moda}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Rango</Text><Text style={styles.statValue}>{estadisticos.rango}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Varianza</Text><Text style={styles.statValue}>{estadisticos.varianza}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Desviación</Text><Text style={styles.statValue}>{estadisticos.desviacion}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Q1 (25%)</Text><Text style={styles.statValue}>{estadisticos.q1}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Q3 (75%)</Text><Text style={styles.statValue}>{estadisticos.q3}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Diagnóstico de Consistencia</Text>
          <View style={styles.diagContainer}>
            <Text style={{ fontWeight: 'bold', color: '#855d10', fontSize: 9 }}>Resultado del Análisis:</Text>
            <Text style={{ marginTop: 4, fontSize: 9 }}>Distribución: {estadisticos.sesgo}</Text>
            <Text style={{ marginTop: 2, fontSize: 9, color: estadisticos.outliers.length > 0 ? '#DE443B' : '#333' }}>
              Atípicos: {estadisticos.outliers.length > 0 ? `Se detectaron ${estadisticos.outliers.length} outliers: ${estadisticos.outliers.join(', ')}` : 'Muestra consistente, sin outliers detectados.'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Espacio Muestral y Probabilidad</Text>
          <Text style={styles.monoText}>S = {"{ "}{espacioMuestral.join(', ')}{" }"}</Text>
          {probabilidad && (
            <View style={[styles.probContainer, { marginTop: 8 }]}>
              <Text style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: 9 }}>Evento: {probabilidad.condicion}</Text>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#006BB4', marginTop: 4 }}>P(E) = {probabilidad.porcentaje}%</Text>
            </View>
          )}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Tabla de Distribución de Frecuencias</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}><Text>Valor</Text></View>
              <View style={styles.tableCol}><Text>fi</Text></View>
              <View style={styles.tableCol}><Text>fr</Text></View>
              <View style={styles.tableCol}><Text>Fi</Text></View>
              <View style={styles.tableCol}><Text>Fr</Text></View>
            </View>
            {frecuencias.slice(0, 20).map((row, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <View style={styles.tableCol}><Text>{row.valor}</Text></View>
                <View style={styles.tableCol}><Text>{row.fi}</Text></View>
                <View style={styles.tableCol}><Text>{row.fr}</Text></View>
                <View style={styles.tableCol}><Text>{row.Fi}</Text></View>
                <View style={styles.tableCol}><Text>{row.Fr}</Text></View>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {Array.from({ length: Math.ceil(graficosImgs.length / 2) }).map((_, p) => (
        <Page key={p} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Anexo: Gráficos (Parte {p+1})</Text>
          {graficosImgs.slice(p*2, p*2+2).map((img, i) => (
            <View key={i} style={{ marginBottom: 15, alignItems: 'center' }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>{chartLabels[p*2+i]}</Text>
              <Image src={img} style={styles.chartImage} />
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default ReportePDF;
