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
  title: { fontSize: 24, color: '#1E3A5F', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
  subtitle: { fontSize: 10, color: '#666', marginTop: 4, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { 
    fontSize: 12, 
    color: '#006BB4', 
    borderBottomWidth: 1, 
    borderBottomStyle: 'solid', 
    borderBottomColor: '#eee', 
    paddingBottom: 3, 
    marginBottom: 10, 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
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
  statLabel: { fontSize: 7, color: '#666', textTransform: 'uppercase', textAlign: 'center' },
  statValue: { fontSize: 10, fontWeight: 'bold', color: '#1E3A5F', textAlign: 'center' },
  probContainer: { backgroundColor: '#f0f7ff', padding: 12, borderRadius: 6, borderWidth: 0.5, borderStyle: 'solid', borderColor: '#bcd7f3', marginTop: 10 },
  monoText: { fontFamily: 'Courier', fontSize: 8, color: '#444', backgroundColor: '#fff', padding: 8, marginTop: 5, borderRadius: 4, borderWidth: 0.5, borderStyle: 'solid', borderColor: '#ddd' },
  summaryBox: {
    backgroundColor: '#fcfcfc',
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 8,
    fontSize: 9,
    lineHeight: 1.5,
    color: '#444',
    textAlign: 'justify'
  },
  table: { display: 'table', width: '100%' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomStyle: 'solid', borderBottomColor: '#eee', minHeight: 20, alignItems: 'center' },
  tableHeader: { backgroundColor: '#1E3A5F', color: '#ffffff', fontWeight: 'bold' },
  tableRowAlt: { backgroundColor: '#f2f6f9' },
  tableCol: { width: '20%', textAlign: 'center', fontSize: 9 },
  chartImage: { width: '100%', height: 'auto', maxHeight: 200, marginVertical: 10, objectFit: 'contain' },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', color: '#999', fontSize: 8 }
});

const chartInfo = [
  { 
    title: "Histograma y Polígono de Frecuencias", 
    desc: (stats) => `Este gráfico de columnas y líneas superpuestas ilustra la distribución de frecuencias absolutas. Permite identificar visualmente la forma de la distribución; en este caso, se observa un punto de máxima densidad en la moda (${stats.moda}). El polígono de frecuencias suaviza la transición entre datos, revelando si existe un sesgo hacia los valores mínimos (${stats.min}) o máximos (${stats.max}) de la muestra.`
  },
  { 
    title: "Ojiva (Curva de Frecuencia Acumulada)", 
    desc: (stats) => `La ojiva representa gráficamente las frecuencias acumuladas ascendentes. Es una herramienta esencial para el análisis de percentiles y deciles, ya que muestra cómo se van sumando los datos desde el límite inferior (${stats.min}) hasta cubrir el 100% de la muestra en el límite superior (${stats.max}). La pendiente de la curva indica las zonas de mayor concentración de valores en el conjunto de datos.`
  },
  { 
    title: "Diagrama de Pareto", 
    desc: (stats) => `El análisis de Pareto organiza los valores únicos de mayor a menor frecuencia absoluta, acompañados de una curva de porcentaje acumulado. Esta visualización permite aplicar el principio de prioridad estadística, identificando qué valores representan la mayoría de las ocurrencias. Es vital para separar los 'pocos vitales' de los 'muchos triviales' dentro de los ${stats.n} datos analizados.`
  },
  { 
    title: "Gráfico de Distribución Sectorial (Pastel)", 
    desc: (stats) => `Este gráfico circular segmenta la muestra para mostrar la participación proporcional de cada valor único. Cada sector representa una frecuencia relativa expresada en grados, permitiendo una comparación rápida de la composición interna de los datos. Facilita la comprensión de la dominancia de ciertos valores sobre el total del espacio muestral estudiado.`
  }
];

const ReportePDF = ({ datos, estadisticos, frecuencias, graficosImgs, probabilidad }) => {
  const fecha = new Date().toLocaleDateString();
  const espacioMuestral = [...new Set(datos)].sort((a, b) => a - b);

  return (
    <Document title="Reporte Estadístico Profesional">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Reporte de Análisis Estadístico</Text>
          <Text style={styles.subtitle}>Resumen ejecutivo de medidas y probabilidades</Text>
          <Text style={{ fontSize: 8, color: '#888', marginTop: 4 }}>Generado el {fecha} | Muestra: {datos.length} elementos</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Medidas Estadísticas Principales</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}><Text style={styles.statLabel}>Media</Text><Text style={styles.statValue}>{estadisticos.media}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Mediana</Text><Text style={styles.statValue}>{estadisticos.mediana}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Moda</Text><Text style={styles.statValue}>{estadisticos.moda}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Varianza</Text><Text style={styles.statValue}>{estadisticos.varianza}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Desviación</Text><Text style={styles.statValue}>{estadisticos.desviacion}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Rango</Text><Text style={styles.statValue}>{estadisticos.rango}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Mínimo</Text><Text style={styles.statValue}>{estadisticos.min}</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Máximo</Text><Text style={styles.statValue}>{estadisticos.max}</Text></View>
          </View>
        </View>
        {probabilidad && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Análisis de Probabilidad</Text>
            <View style={styles.probContainer}>
              <Text style={{ fontWeight: 'bold', color: '#1E3A5F', marginBottom: 8, fontSize: 11 }}>Evento Definido (E): {probabilidad.condicion}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 9, color: '#555' }}>Casos Favorables: {probabilidad.favorables}</Text>
                  <Text style={{ fontSize: 9, color: '#555' }}>Total de Datos: {probabilidad.total}</Text>
                </View>
                <View style={{ textAlign: 'right' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#006BB4' }}>P(E) = {probabilidad.porcentaje}%</Text>
                </View>
              </View>
            </View>
            <View style={styles.summaryBox}>
              <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>Interpretación:</Text>
              <Text>Existe una probabilidad del {probabilidad.porcentaje}% de que un dato seleccionado al azar cumpla con la condición "${probabilidad.condicion}". Esto se traduce en {probabilidad.favorables} coincidencias dentro del espacio muestral total.</Text>
            </View>
          </View>
        )}
        <View style={styles.section}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1E3A5F', marginBottom: 5 }}>Espacio Muestral (S):</Text>
          <Text style={styles.monoText}>S = {"{ "}{espacioMuestral.join(', ')}{" }"}</Text>
        </View>
        <Text style={styles.footer} fixed>Página 1</Text>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Tabla de Distribución de Frecuencias Completa</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}><Text>Valor (x)</Text></View>
              <View style={styles.tableCol}><Text>fi</Text></View>
              <View style={styles.tableCol}><Text>fr</Text></View>
              <View style={styles.tableCol}><Text>Fi</Text></View>
              <View style={styles.tableCol}><Text>Fr</Text></View>
            </View>
            {frecuencias.map((row, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]} wrap={false}>
                <View style={styles.tableCol}><Text>{row.valor}</Text></View>
                <View style={styles.tableCol}><Text>{row.fi}</Text></View>
                <View style={styles.tableCol}><Text>{row.fr}</Text></View>
                <View style={styles.tableCol}><Text>{row.Fi}</Text></View>
                <View style={styles.tableCol}><Text>{row.Fr}</Text></View>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.footer} fixed>Página 2</Text>
      </Page>
      {Array.from({ length: Math.ceil(graficosImgs.length / 2) }).map((_, p) => (
        <Page key={p} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Anexo: Análisis Visual (Parte {p+1})</Text>
          {graficosImgs.slice(p*2, p*2+2).map((img, i) => {
            const info = chartInfo[p*2+i];
            if (!info) return null;
            return (
              <View key={i} style={{ marginBottom: 30, alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1E3A5F', marginBottom: 5 }}>{info.title}</Text>
                <Image src={img} style={styles.chartImage} />
                <View style={styles.summaryBox}>
                  <Text>{info.desc({...estadisticos, n: datos.length})}</Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.footer} fixed>Página {p + 3}</Text>
        </Page>
      ))}
    </Document>
  );
};

export default ReportePDF;
