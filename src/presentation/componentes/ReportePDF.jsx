import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const chartMeta = [
  { 
    title: "1. Histograma y Polígono de Frecuencias", 
    desc: "El Histograma es la representación gráfica por excelencia para el análisis de variables continuas y discretas. Nos permite visualizar la distribución de la frecuencia absoluta (fi), identificando instantáneamente la 'forma' de los datos. El Polígono de frecuencias, superpuesto sobre las barras, facilita la detección de tendencias y la continuidad del fenómeno. Una distribución acampanada sugiere normalidad, mientras que desplazamientos hacia los extremos indican sesgos positivos o negativos, fundamentales para entender si los procesos están bajo control o presentan anomalías estructurales." 
  },
  { 
    title: "2. Curva de Frecuencia Acumulada (Ojiva)", 
    desc: "La Ojiva es una herramienta técnica vital para el análisis de cuantiles y percentiles. A diferencia de las frecuencias absolutas, la Ojiva muestra cómo se acumulan los datos a medida que recorremos la escala de valores. Una pendiente pronunciada revela los intervalos donde se concentra la mayor densidad de la población, mientras que tramos horizontales indican ausencia de datos. Es indispensable para determinar qué porcentaje de la muestra se encuentra por debajo de un valor crítico, permitiendo realizar cortes estadísticos precisos (ej. el 50% de los datos es menor a 'x')." 
  },
  { 
    title: "3. Diagrama de Pareto (Análisis de Importancia)", 
    desc: "Basado en el principio de Vilfredo Pareto, este gráfico prioriza los valores según su impacto. Al ordenar las categorías de mayor a menor frecuencia absoluta, acompañadas por la línea de porcentaje acumulado, permite separar los 'pocos vitales' de los 'muchos triviales'. Es la herramienta de gestión más poderosa para la toma de decisiones, ya que revela el 20% de las causas que suelen generar el 80% de los efectos observados. En este reporte, nos ayuda a identificar cuáles son los valores dominantes que definen el comportamiento general de la muestra." 
  },
  { 
    title: "4. Distribución Sectorial Proporcional (Top 5)", 
    desc: "Este gráfico de sectores analiza la representatividad proporcional de los elementos más destacados frente a la totalidad del conjunto. Permite entender de un vistazo qué tan concentrada está la muestra. Si un solo sector ocupa una gran parte del pastel, estamos ante un fenómeno de alta dominancia; si los sectores son de tamaños similares, la muestra presenta una diversidad uniforme. Es ideal para reportes ejecutivos donde se necesita visualizar la jerarquía de las categorías y su peso relativo en el ecosistema total de datos analizados." 
  }
];

const styles = StyleSheet.create({
  page: { padding: 45, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { marginBottom: 20, borderBottom: 2, borderBottomColor: '#1E3A5F', paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E3A5F', textTransform: 'uppercase', textAlign: 'center' },
  subtitle: { fontSize: 10, color: '#666', marginTop: 4, textAlign: 'center' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#006BB4', marginBottom: 12, textTransform: 'uppercase', textAlign: 'center', backgroundColor: '#f0f4f8', padding: 5 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20, justifyContent: 'center' },
  statCard: { width: '23%', padding: 8, backgroundColor: '#f0f4f8', borderRadius: 4, alignItems: 'center' },
  statLabel: { fontSize: 8, color: '#555', marginBottom: 2 },
  statValue: { fontSize: 11, fontWeight: 'bold', color: '#1E3A5F' },
  slContainer: { marginTop: 5, padding: 12, backgroundColor: '#fafafa', borderLeft: 4, borderLeftColor: '#caf438', marginBottom: 10 },
  slRow: { flexDirection: 'row', marginBottom: 3 },
  slStem: { width: 35, fontWeight: 'bold', borderRightWidth: 1, borderRightColor: '#ccc', textAlign: 'right', paddingRight: 10, fontSize: 10 },
  slLeaf: { paddingLeft: 10, letterSpacing: 3, fontFamily: 'Courier', fontSize: 10 },
  probBox: { backgroundColor: '#f0f4f8', padding: 15, borderRadius: 5, borderLeft: 4, borderLeftColor: '#1E3A5F', marginBottom: 10 },
  monoText: { fontSize: 8, fontFamily: 'Courier', color: '#666', marginTop: 5, backgroundColor: '#f5f5f5', padding: 10 },
  treeContainer: { marginVertical: 15, padding: 15, border: 1, borderColor: '#eee', borderRadius: 10, alignItems: 'center' },
  treeLine: { width: 2, backgroundColor: '#1E3A5F', height: 20 },
  treeNode: { padding: 5, backgroundColor: '#1E3A5F', color: '#fff', borderRadius: 5, fontSize: 9, minWidth: 80, textAlign: 'center' },
  treeBranch: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginTop: 10 },
  treeLeaf: { padding: 8, border: 1, borderColor: '#006BB4', borderRadius: 5, fontSize: 8, alignItems: 'center', minWidth: 100 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf' },
  tableRow: { flexDirection: 'row', minHeight: 25, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tableHeader: { backgroundColor: '#1E3A5F' },
  tableHeaderText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  tableCell: { width: '20%', textAlign: 'center', fontSize: 10 },
  chartBlock: { marginBottom: 35, padding: 10 },
  chartImage: { width: '100%', height: 280, objectFit: 'contain', marginVertical: 12 },
  chartTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E3A5F', marginBottom: 8, textAlign: 'center' },
  chartDesc: { fontSize: 9.5, color: '#2c3e50', lineHeight: 1.6, textAlign: 'justify', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 5, borderLeft: 3, borderLeftColor: '#006BB4' },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', color: '#999', fontSize: 8 }
});

const getStemLeafData = (datos) => {
  if (!datos) return [];
  const sorted = [...datos].sort((a, b) => a - b);
  const groups = {};
  sorted.forEach(num => {
    const tallo = Math.floor(Math.abs(num) / 10);
    const hoja = Math.abs(num) % 10;
    if (!groups[tallo]) groups[tallo] = [];
    groups[tallo].push(hoja);
  });
  return Object.entries(groups).map(([t, h]) => ({ tallo: t, hojas: h.join(' ') }));
};

const ReportePDF = ({ datosA, estadisticosA, frecuenciasA, graficosImgsA, datosB, estadisticosB, frecuenciasB, graficosImgsB, comparar, probabilidadA }) => {
  const fecha = new Date().toLocaleDateString();
  
  if (comparar && estadisticosB) {
    return (
      <Document title="Reporte Estadístico Comparativo">
        <Page size="A4" style={styles.page}>
          <View style={styles.header}><Text style={styles.title}>Reporte Comparativo A vs B</Text><Text style={styles.subtitle}>{fecha}</Text></View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Medidas Comparativas</Text>
            <View style={{flexDirection:'row', gap:20}}>
              <View style={{flex:1}}>
                <Text style={{backgroundColor:'#1E3A5F', color:'#fff', padding:3, textAlign:'center', fontSize:9}}>MUESTRA A</Text>
                {Object.entries(estadisticosA).map(([k,v]) => (
                  <View key={k} style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth:0.2, paddingVertical:3}}>
                    <Text style={{fontSize:8}}>{k}:</Text><Text style={{fontSize:8, fontWeight:'bold'}}>{Array.isArray(v)?v.join(','):v}</Text>
                  </View>
                ))}
              </View>
              <View style={{flex:1}}>
                <Text style={{backgroundColor:'#2ecc71', color:'#fff', padding:3, textAlign:'center', fontSize:9}}>MUESTRA B</Text>
                {Object.entries(estadisticosB).map(([k,v]) => (
                  <View key={k} style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth:0.2, paddingVertical:3}}>
                    <Text style={{fontSize:8}}>{k}:</Text><Text style={{fontSize:8, fontWeight:'bold'}}>{Array.isArray(v)?v.join(','):v}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Comparativa Visual</Text>
            {graficosImgsA.slice(0, 4).map((img, i) => (
              <View key={i} style={{ marginBottom: 20 }} wrap={false}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1E3A5F', marginBottom: 5, textAlign: 'center' }}>{chartMeta[i]?.title}</Text>
                <View style={{flexDirection:'row', gap:15}}>
                  <View style={{flex:1}}><Image src={img} style={{ height: 140 }} /></View>
                  {graficosImgsB[i] && <View style={{flex:1}}><Image src={graficosImgsB[i]} style={{ height: 140 }} /></View>}
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.footer} fixed>Página 1</Text>
        </Page>
      </Document>
    );
  }

  const slDataUnique = getStemLeafData(datosA);
  const espacioMuestralUnique = [...new Set(datosA)].sort((a, b) => a - b);

  return (
    <Document title="Reporte Estadístico Profesional">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}><Text style={styles.title}>Reporte Estadístico Detallado</Text><Text style={styles.subtitle}>Análisis de Muestra Única | {fecha}</Text></View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. Medidas Estadísticas</Text>
          <View style={styles.statsGrid}>
            {[
              ['Media', estadisticosA.media], ['Mediana', estadisticosA.mediana], ['Moda', Array.isArray(estadisticosA.moda) ? estadisticosA.moda.join(', ') : estadisticosA.moda],
              ['Mínimo', estadisticosA.min], ['Máximo', estadisticosA.max], ['Desviación', estadisticosA.desviacion],
              ['Varianza', estadisticosA.varianza], ['Rango', estadisticosA.rango], ['Total (N)', datosA.length]
            ].map(([l, v]) => (
              <View key={l} style={styles.statCard}><Text style={styles.statLabel}>{l}</Text><Text style={styles.statValue}>{v}</Text></View>
            ))}
          </View>
        </View>
        
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>II. Diagrama de Tallo y Hoja</Text>
          <View style={styles.slContainer}>
            {slDataUnique.slice(0, 15).map((row, i) => (
              <View key={i} style={styles.slRow}>
                <Text style={styles.slStem}>{row.tallo}</Text>
                <Text style={styles.slLeaf}>{row.hojas}</Text>
              </View>
            ))}
          </View>
        </View>

        {probabilidadA && probabilidadA.favorables !== undefined && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>III. Análisis de Probabilidad y Árbol</Text>
            <View style={styles.probBox}>
              <Text style={{ fontWeight: 'bold', fontSize: 11 }}>Evento: {probabilidadA.condicion}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontSize: 9 }}>Favorables: {probabilidadA.favorables} | Total: {probabilidadA.total}</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#006BB4' }}>P(E) = {probabilidadA.porcentaje}%</Text>
              </View>
            </View>
            
            <View style={styles.treeContainer}>
              <Text style={{ fontSize: 8, color: '#666', marginBottom: 5 }}>Diagrama de Árbol del Evento</Text>
              <View style={styles.treeNode}><Text>Inicio</Text></View>
              <View style={styles.treeLine} />
              <View style={styles.treeBranch}>
                <View style={styles.treeLeaf}>
                  <Text style={{ color: '#006BB4', fontWeight: 'bold' }}>Cumple</Text>
                  <Text style={{ fontSize: 7 }}>n = {probabilidadA.favorables}</Text>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{probabilidadA.porcentaje}%</Text>
                </View>
                <View style={styles.treeLeaf}>
                  <Text style={{ color: '#DE443B', fontWeight: 'bold' }}>No Cumple</Text>
                  <Text style={{ fontSize: 7 }}>n = {probabilidadA.total - probabilidadA.favorables}</Text>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{(100 - parseFloat(probabilidadA.porcentaje)).toFixed(2)}%</Text>
                </View>
              </View>
            </View>

            <Text style={{ fontSize: 9, fontWeight: 'bold', marginTop: 5 }}>Espacio Muestral (S):</Text>
            <Text style={styles.monoText}>S = {"{ "}{espacioMuestralUnique.join(', ')}{" }"}</Text>
          </View>
        )}
        <Text style={styles.footer} fixed>Página 1</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>IV. Tabla de Distribución de Frecuencias</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {['Valor (x)', 'fi', 'fr', 'Fi', 'Fr'].map(h => (<View key={h} style={styles.tableCell}><Text style={styles.tableHeaderText}>{h}</Text></View>))}
          </View>
          {frecuenciasA.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              {['valor', 'fi', 'fr', 'Fi', 'Fr'].map(k => (
                <View key={k} style={styles.tableCell}><Text>{row[k]}</Text></View>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.footer} fixed>Página 2</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>V. Análisis Visual Interpretativo</Text>
        {graficosImgsA.map((img, i) => (
          <View key={i} style={styles.chartBlock} wrap={false}>
            <Text style={styles.chartTitle}>{chartMeta[i]?.title}</Text>
            <Image src={img} style={styles.chartImage} />
            <View style={styles.chartDesc}><Text>{chartMeta[i]?.desc}</Text></View>
          </View>
        ))}
        <Text style={styles.footer} fixed>Página 3</Text>
      </Page>
    </Document>
  );
};

export default ReportePDF;
