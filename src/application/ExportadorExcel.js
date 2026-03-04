import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export class ExportadorExcel {
  async exportar(estadisticos, frecuencias, imagenes, datosOriginales) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Dashboard');
    
    // Configuración general de la hoja
    sheet.getColumn('A').width = 25;
    sheet.getColumn('B').width = 15;
    sheet.getColumn('C').width = 15;
    sheet.getColumn('D').width = 15;
    sheet.getColumn('E').width = 15;

    let currentRow = 1;

    // 1. ENCABEZADO DEL REPORTE
    sheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const titleCell = sheet.getCell(`A${currentRow}`);
    titleCell.value = 'Reporte de Análisis Estadístico';
    titleCell.font = { name: 'Arial Black', size: 18, bold: true, color: { argb: 'FF1E3A5F' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    currentRow++;

    sheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const dateCell = sheet.getCell(`A${currentRow}`);
    const ahora = new Date();
    dateCell.value = `Generado el: ${ahora.toLocaleDateString()} a las ${ahora.toLocaleTimeString()}`;
    dateCell.font = { italic: true, color: { argb: 'FF666666' } };
    dateCell.alignment = { horizontal: 'right' };
    currentRow += 2;

    // 2. SECCIÓN: DATOS INGRESADOS (Resumen)
    this.crearTituloSeccion(sheet, currentRow, 'Datos ingresados', 'A', 'E');
    currentRow++;
    
    // Mostrar datos en una fila horizontal o lista compacta para ahorrar espacio vertical
    const datosAMostrar = datosOriginales.slice(0, 50); // Mostrar hasta 50 para no alargar demasiado
    const datosTexto = datosAMostrar.join(', ') + (datosOriginales.length > 50 ? '...' : '');
    sheet.mergeCells(`A${currentRow}:E${currentRow + 1}`);
    const dataCell = sheet.getCell(`A${currentRow}`);
    dataCell.value = datosTexto;
    dataCell.alignment = { wrapText: true, vertical: 'top' };
    dataCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    currentRow += 3;

    // 3. SECCIÓN: ESTADÍSTICOS DESCRIPTIVOS
    this.crearTituloSeccion(sheet, currentRow, 'Estadísticos descriptivos', 'A', 'B');
    currentRow++;

    const headerEst = sheet.getRow(currentRow);
    headerEst.getCell(1).value = 'Métrica';
    headerEst.getCell(2).value = 'Valor';
    this.aplicarEstiloCabecera(headerEst, [1, 2]);
    currentRow++;

    const modaTexto = Array.isArray(estadisticos.moda) ? estadisticos.moda.join(', ') : estadisticos.moda;
    const filasEst = [
      ['Media', Number(estadisticos.media)],
      ['Mediana', Number(estadisticos.mediana)],
      ['Moda', modaTexto],
      ['Varianza', Number(estadisticos.varianza)],
      ['Desviación Estándar', Number(estadisticos.desviacion)],
      ['Mínimo', Number(estadisticos.min)],
      ['Máximo', Number(estadisticos.max)],
      ['Rango', Number(estadisticos.rango)],
      ['N (Total)', datosOriginales.length]
    ];

    filasEst.forEach(fila => {
      const row = sheet.getRow(currentRow);
      row.getCell(1).value = fila[0];
      row.getCell(2).value = fila[1];
      row.getCell(2).numFmt = typeof fila[1] === 'number' ? '0.00' : '@';
      this.aplicarBordes(row, [1, 2]);
      currentRow++;
    });
    currentRow += 2;

    // 4. SECCIÓN: TABLA DE FRECUENCIAS
    this.crearTituloSeccion(sheet, currentRow, 'Tabla de distribución de frecuencias', 'A', 'E');
    currentRow++;

    const headerFreq = sheet.getRow(currentRow);
    ['Valor (x)', 'fi', 'fr', 'Fi', 'Fr'].forEach((h, i) => {
      headerFreq.getCell(i + 1).value = h;
    });
    this.aplicarEstiloCabecera(headerFreq, [1, 2, 3, 4, 5]);
    currentRow++;

    frecuencias.forEach((f, index) => {
      const row = sheet.getRow(currentRow);
      row.getCell(1).value = f.valor;
      row.getCell(2).value = f.fi;
      row.getCell(3).value = Number(f.fr);
      row.getCell(4).value = f.Fi;
      row.getCell(5).value = Number(f.Fr);

      // Formato de porcentaje para fr y Fr
      row.getCell(3).numFmt = '0.00%';
      row.getCell(5).numFmt = '0.00%';

      // Filas con bandas (zebra)
      if (index % 2 === 1) {
        [1, 2, 3, 4, 5].forEach(col => {
          row.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
        });
      }

      this.aplicarBordes(row, [1, 2, 3, 4, 5]);
      currentRow++;
    });
    currentRow += 2;

    // 5. SECCIÓN: GRÁFICOS
    this.crearTituloSeccion(sheet, currentRow, 'Visualización de datos (Gráficos)', 'A', 'E');
    currentRow += 2;

    const titulosGraficos = [
      "Histograma y Polígono de Frecuencias",
      "Ojiva (Frecuencia Acumulada)",
      "Diagrama de Pareto",
      "Distribución Sectorial (Top 5)"
    ];

    // Insertar gráficos de 2 en 2
    for (let i = 0; i < imagenes.length; i++) {
      const colOffset = (i % 2 === 0) ? 0 : 3; // Columna A o D
      const rowOffset = Math.floor(i / 2) * 18; // Cada 18 filas una nueva fila de gráficos
      
      const startRow = currentRow + rowOffset;
      
      // Título del gráfico
      const titleCell = sheet.getCell(startRow, colOffset + 1);
      titleCell.value = titulosGraficos[i] || `Gráfico ${i + 1}`;
      titleCell.font = { bold: true, color: { argb: 'FF006BB4' } };
      
      const imageId = workbook.addImage({
        base64: imagenes[i],
        extension: 'png',
      });

      sheet.addImage(imageId, {
        tl: { col: colOffset, row: startRow },
        ext: { width: 450, height: 280 }
      });
    }

    // Nombre del archivo
    const fechaStr = ahora.toISOString().split('T')[0];
    const horaStr = ahora.toTimeString().split(' ')[0].replace(/:/g, '');
    const nombreArchivo = `reporte_estadistico_dashboard_${fechaStr}_${horaStr}.xlsx`;

    // Descarga
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), nombreArchivo);
  }

  crearTituloSeccion(sheet, row, titulo, colStart, colEnd) {
    sheet.mergeCells(`${colStart}${row}:${colEnd}${row}`);
    const cell = sheet.getCell(`${colStart}${row}`);
    cell.value = titulo.toUpperCase();
    cell.font = { bold: true, color: { argb: 'FF1E3A5F' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EFF7' } };
    cell.alignment = { horizontal: 'left' };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF1E3A5F' } } };
  }

  aplicarEstiloCabecera(row, cols) {
    cols.forEach(col => {
      const cell = row.getCell(col);
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  aplicarBordes(row, cols) {
    cols.forEach(col => {
      const cell = row.getCell(col);
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
      };
    });
  }
}
