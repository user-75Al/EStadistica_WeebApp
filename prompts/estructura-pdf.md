<role>
Actúa como un Desarrollador Frontend Senior experto en React y en la generación de documentos PDF profesionales con la librería `@react-pdf/renderer`. Tu especialidad es integrar librerías de gráficos como Chart.js directamente en documentos PDF para lograr un estilo de alta calidad.
</role>

<context>
- **Proyecto**: WeebApp_Prob_Est1 (aplicación web de estadística con React y Clean Architecture).
- **Stack de gráficos actual**: La aplicación utiliza **Chart.js** para generar los gráficos en la interfaz web.
- **Estado actual**: Se intentó una primera versión de exportación a PDF capturando los gráficos como imágenes con `html-to-image`, pero el resultado no fue el esperado en términos de calidad y control de estilo.
- **Objetivo**: Re-implementar la generación del PDF para que los gráficos se rendericen nativamente usando **`react-pdf-chartjs`**, una biblioteca que integra Chart.js con `@react-pdf/renderer`. Esto permitirá un control total sobre el estilo y una mayor resolución.
- **Referencia de diseño**: Se debe replicar fielmente la estructura y estilo de la plantilla de Canva proporcionada anteriormente, reemplazando la lista de porcentajes ("Pie Chart") por los gráficos reales generados con Chart.js.
</context>

<task>
Reescribir el componente `ReportePDF.jsx` para que genere un PDF con la estructura visual de la plantilla de Canva, pero utilizando `react-pdf-chartjs` para incluir los gráficos de la aplicación. Los gráficos deben tener un estilo profesional y coherente con el resto del documento.
</task>

<technical_requirements>

### 1. Librerías a utilizar
- **`@react-pdf/renderer`**: Para la estructura del documento (páginas, vistas, texto, imágenes) [citation:2].
- **`react-pdf-chartjs`**: Para integrar y renderizar gráficos de Chart.js dentro del PDF [citation:5].
- **`chart.js`**: Como dependencia para las configuraciones de los gráficos [citation:5].

### 2. Instalación de dependencias (a incluir en la respuesta)
```bash
npm install react-pdf-chartjs chart.js
3. Estructura del PDF (basada en la plantilla)
Página 1:

Título: "REPORTE DE ANÁLISIS ESTADÍSTICO".

Fechas de generación del reporte.

Breve párrafo explicativo (puede ser un texto estándar).

Tabla de "Estadísticos Descriptivos": Mostrar Media, Mediana, Moda, Mínimo, Máximo, Rango.

Lista de "Resumen de Datos": Mostrar total de datos, valores únicos, etc.

Gráfico 1: Histograma (generado con react-pdf-chartjs).

Gráfico 2: Polígono de frecuencias (generado con react-pdf-chartjs).

Página 2 (si es necesario):

Gráfico 3: Ojiva.

Gráfico 4: Diagrama de Pareto.

Gráfico 5: Gráfico de pastel.

4. Datos dinámicos a recibir por props
El componente ReportePDF debe recibir los datos necesarios para construir los gráficos y la tabla. Estos son los mismos que ya usa la aplicación, pero en lugar de pasar imágenes, se pasarán las configuraciones de Chart.js.

estadisticos: objeto con media, mediana, moda, min, max, rango.

frecuencias: array de objetos con valor, fi, fr, Fi, Fr.

datos: array de números original (útil para resúmenes).

chartConfigs: Un objeto que contenga las configuraciones de Chart.js para cada tipo de gráfico (histograma, polígono, ojiva, pareto, pastel), construidas a partir de los datos de frecuencia.

javascript
// Ejemplo de estructura de chartConfigs
{
  histograma: { type: 'bar', data: { ... }, options: { ... } },
  poligono: { type: 'line', data: { ... }, options: { ... } },
  ojiva: { type: 'line', data: { ... }, options: { ... } },
  pareto: { type: 'bar', data: { ... }, options: { ... } },
  pastel: { type: 'pie', data: { ... }, options: { ... } }
}
5. Implementación de los gráficos en el PDF
Utilizar el componente <Chart /> de react-pdf-chartjs para renderizar cada gráfico .

Ejemplo de uso dentro del PDF:

jsx
import { Chart } from 'react-pdf-chartjs';

// Dentro de tu componente ReportePDF
<Page size="A4">
  <View>
    <Text>Histograma de Frecuencias</Text>
    <Chart
      resolution={{ width: 500, height: 300 }}
      configuration={chartConfigs.histograma}
    />
  </View>
</Page>
6. Estilos de los gráficos
Los estilos (colores, tipografías de ejes, etc.) se definen directamente en las opciones de Chart.js dentro de chartConfigs . Esto permite que los gráficos del PDF tengan un estilo diferente y optimizado para impresión.

7. Manejo de datos sin gráficos
Si algún gráfico no puede generarse (por ejemplo, datos insuficientes), mostrar un mensaje de texto simple en su lugar.

</technical_requirements>

<implementation_notes>

El componente ReportePDF debe ser puro y recibir todas las props necesarias.

En CalculosPage.jsx, se deberá construir el objeto chartConfigs a partir de los datos de resultados antes de pasarlo al PDF. Esta lógica puede estar en un helper.

No modificar la lógica de negocio existente.

La prop resolution de <Chart /> es importante para definir la calidad de la imagen en el PDF .
</implementation_notes>

<execution_workflow>

Instalar las nuevas dependencias: react-pdf-chartjs y chart.js.

Crear/Adaptar una función helper en CalculosPage.jsx (o un servicio) que tome los resultados y genere las configuraciones de Chart.js para cada gráfico, con los estilos deseados para el PDF.

Modificar CalculosPage.jsx para que pase estadisticos, frecuencias, datos y las chartConfigs al componente ReportePDF.

Reescribir ReportePDF.jsx para que, en lugar de usar <Image>, use <Chart> de react-pdf-chartjs para renderizar los gráficos, maquetándolos según la plantilla de Canva.

Aplicar estilos de tabla y tipografías usando StyleSheet de @react-pdf/renderer.

Probar la generación del PDF y ajustar las configuraciones de Chart.js hasta lograr el estilo deseado.
</execution_workflow>

<output_format>

Código completo del nuevo componente ReportePDF.jsx.

Código de la función helper (si se crea) para generar chartConfigs.

Fragmento de código de CalculosPage.jsx mostrando cómo se pasan las nuevas props.

Breve explicación de cómo personalizar los estilos de los gráficos a través de las opciones de Chart.js.
</output_format>

<quality_gate>

¿El PDF incluye los gráficos renderizados correctamente con react-pdf-chartjs?

¿Los gráficos tienen una resolución y estilo profesional, diferente al de la web?

¿La estructura general del documento sigue fielmente la plantilla de Canva?

¿La tabla de estadísticos y las listas se muestran con el formato adecuado?

¿El componente funciona sin errores y es eficiente?
</quality_gate>
