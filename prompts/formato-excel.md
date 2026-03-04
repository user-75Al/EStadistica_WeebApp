<role>
Actúa como un Desarrollador Frontend Senior experto en React y en la generación de reportes avanzados con Excel. Tu tarea es mejorar la funcionalidad de exportación a Excel actual para que genere un archivo con una presentación mucho más profesional, unificando toda la información en una sola hoja tipo dashboard, con formato de tabla, colores, títulos de sección y las imágenes de los gráficos insertadas correctamente.
</role>

<context>
- **Proyecto**: WeebApp_Prob_Est1 (aplicación web de estadística con React y Clean Architecture).
- **Funcionalidad existente**: Se ha implementado exportación a Excel que genera 4 hojas separadas (Datos ingresados, Estadísticos, Tabla de Frecuencias, Gráficos) usando ExcelJS. Los gráficos se insertan como texto descriptivo en lugar de imágenes reales.
- **Resultado actual**: El archivo generado es funcional pero visualmente pobre; los gráficos no se ven y la presentación es básica.
- **Objetivo**: Rediseñar la exportación para que produzca un archivo Excel con una única hoja de dashboard que contenga:
  - Encabezado con título y fecha de generación.
  - Sección de datos ingresados (lista o resumen).
  - Sección de estadísticos en formato tabla.
  - Sección de tabla de frecuencias con formato profesional.
  - Sección de gráficos (histograma, polígono, ojiva, Pareto, pastel) insertados como imágenes reales, no como texto.
  - Todo en una sola hoja, con secciones claramente delimitadas, colores suaves en encabezados, bordes y formatos de número adecuados.
</context>

<task>
Modificar el servicio `ExportadorExcel.js` (o el que corresponda) para que genere un archivo Excel con las siguientes características:

1. **Una sola hoja** llamada "Dashboard" que contenga toda la información.
2. **Encabezado del reporte**: Título "Reporte de Análisis Estadístico", fecha de generación (automática) y nombre del usuario (opcional).
3. **Sección de datos ingresados**: Mostrar los primeros 20 datos (o todos si son pocos) en una columna, con título "Datos ingresados".
4. **Sección de estadísticos**: Tabla de 2 columnas con los estadísticos (Media, Mediana, Moda, Varianza, Desviación, Mínimo, Máximo, Rango, N) y sus valores. Aplicar formato: encabezados en negrita, bordes, y formato numérico con 2 decimales (excepto enteros).
5. **Sección de tabla de frecuencias**: Tabla completa con columnas Valor, fi, fr, Fi, Fr. fr y Fr deben mostrarse como porcentaje con 2 decimales (ej. "5.00%"). Aplicar formato de tabla profesional (bandas de filas, bordes, encabezado con color de fondo suave).
6. **Sección de gráficos**: Insertar cada gráfico como imagen (PNG) obtenida de los canvas de la aplicación. Cada gráfico debe ir acompañado de un título (ej. "Histograma y Polígono", "Ojiva", "Diagrama de Pareto", "Gráfico de Pastel"). Las imágenes deben tener un tamaño adecuado (aproximadamente 400x250 píxeles) y estar bien alineadas. Se pueden colocar en filas sucesivas, por ejemplo, dos gráficos por fila si el espacio lo permite.
7. **Diseño general**: Usar estilos de celda con bordes, alineación centrada para títulos, y colores suaves para diferenciar secciones. Evitar que las secciones se superpongan; dejar filas vacías entre ellas.
</task>

<technical_requirements>

### 1. Librerías necesarias
- **ExcelJS** (ya instalada)
- **file-saver** (ya instalada)

### 2. Modificaciones en el código
- El servicio `ExportadorExcel.js` debe reestructurarse para crear una sola hoja y manejar la inserción de imágenes.
- Se debe mantener la captura de imágenes de los canvas (usando `toDataURL`) igual que antes.

### 3. Estructura de la hoja "Dashboard"
A continuación, una disposición sugerida (coordenadas aproximadas usando ExcelJS):

- **Fila 1**: Título grande (fusionar columnas A-E) con fuente grande y negrita.
- **Fila 2**: Fecha de generación (fusionar A-E, alineación derecha).
- **Fila 3**: (vacía)
- **Fila 4**: Título "Datos ingresados" (fusionar A-B, con fondo gris claro).
- **Fila 5**: Columna de datos (lista vertical en columna A).
- **Filas siguientes**: hasta donde terminen los datos.
- **Fila N+2**: Título "Estadísticos descriptivos" (fusionar A-B, con fondo).
- **Fila N+3**: Tabla de estadísticos (columnas A y B).
- **Fila N+10**: Título "Tabla de frecuencias" (fusionar A-E, con fondo).
- **Fila N+11**: Encabezados de tabla (filas A a E).
- **Filas siguientes**: Datos de la tabla.
- **Fila M+2**: Título "Gráficos" (fusionar A-E, con fondo).
- **Filas siguientes**: Insertar imágenes de gráficos, cada una con un título encima (en una fila aparte).

Para insertar imágenes:
```javascript
const imageId = workbook.addImage({
  base64: imageBase64,
  extension: 'png',
});
worksheet.addImage(imageId, {
  tl: { col: 0, row: rowIndex },
  ext: { width: 400, height: 250 }
});