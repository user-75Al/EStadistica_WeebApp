import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export class ExportadorExcel {
  async exportar(resultadosA, resultadosB, imagenesA, imagenesB, comparar) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Dashboard Estadístico');
    
    // CONFIGURACIÓN DE CUADRÍCULA PROFESIONAL
    // Muestra A: A,B | Separador: C,D | Muestra B: E,F
    if (comparar) {
      sheet.getColumn('A').width = 28;
      sheet.getColumn('B').width = 22;
      sheet.getColumn('C').width = 12; // Celda de separación 1
      sheet.getColumn('D').width = 12; // Celda de separación 2
      sheet.getColumn('E').width = 28;
      sheet.getColumn('F').width = 22;
    } else {
      sheet.getColumn('A').width = 35;
      sheet.getColumn('B').width = 25;
      sheet.getColumn('C').width = 15;
      sheet.getColumn('D').width = 15;
      sheet.getColumn('E').width = 15;
    }

    let currentRow = 1;

    // 1. ENCABEZADO
    sheet.mergeCells(comparar ? 'A1:F2' : 'A1:E2');
    const titleCell = sheet.getCell('A1');
    titleCell.value = comparar ? 'ANÁLISIS ESTADÍSTICO COMPARATIVO (A VS B)' : 'INFORME ESTADÍSTICO DETALLADO';
    titleCell.font = { name: 'Arial Black', size: 16, bold: true, color: { argb: 'FF1E3A5F' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
    currentRow = 4;

    // 2. SECCIÓN: ESTADÍSTICOS
    this.crearTituloSeccion(sheet, currentRow, 'Métricas Descriptivas', 'A', comparar ? 'F' : 'E');
    currentRow += 2;

    const headRow = sheet.getRow(currentRow);
    headRow.height = 35; 
    headRow.getCell(1).value = 'Parámetro';
    headRow.getCell(2).value = 'Valor Muestra A';
    if (comparar) {
      headRow.getCell(5).value = 'Parámetro';
      headRow.getCell(6).value = 'Valor Muestra B';
    }
    this.aplicarEstiloCabecera(headRow, comparar ? [1, 2, 5, 6] : [1, 2]);
    currentRow++;

    const metricas = [
      ['Media Aritmética', 'media'], ['Mediana', 'mediana'], ['Moda', 'moda'],
      ['Desviación Estándar', 'desviacion'], ['Varianza', 'varianza'],
      ['Valor Mínimo', 'min'], ['Valor Máximo', 'max'], ['Rango', 'rango'],
      ['Muestra (N)', 'n']
    ];

    metricas.forEach(([label, key]) => {
      const row = sheet.getRow(currentRow);
      row.height = 25;
      row.getCell(1).value = label;
      let valA = key === 'n' ? resultadosA.datosOriginales.length : resultadosA.estadisticos[key];
      row.getCell(2).value = Array.isArray(valA) ? valA.join(', ') : Number(valA) || valA;
      row.getCell(2).numFmt = typeof valA === 'number' ? '0.00' : '@';
      if (comparar && resultadosB) {
        row.getCell(5).value = label;
        let valB = key === 'n' ? resultadosB.datosOriginales.length : resultadosB.estadisticos[key];
        row.getCell(6).value = Array.isArray(valB) ? valB.join(', ') : Number(valB) || valB;
        row.getCell(6).numFmt = typeof valB === 'number' ? '0.00' : '@';
      }
      this.aplicarBordes(row, comparar ? [1, 2, 5, 6] : [1, 2]);
      currentRow++;
    });
    currentRow += 5;

    // 3. SECCIÓN: GRÁFICOS (CON SEPARACIÓN GARANTIZADA)
    this.crearTituloSeccion(sheet, currentRow, 'Visualización Comparativa', 'A', comparar ? 'F' : 'E');
    currentRow += 3;

    const titulos = ["Histograma", "Curva Ojiva", "Pareto", "Top 5"];
    
    for (let i = 0; i < 4; i++) {
      const tRow = sheet.getRow(currentRow);
      tRow.height = 30;
      sheet.getCell(currentRow, 1).value = `GRÁFICO A: ${titulos[i]}`;
      if (comparar) sheet.getCell(currentRow, 5).value = `GRÁFICO B: ${titulos[i]}`;
      tRow.font = { bold: true, size: 12, color: { argb: 'FF006BB4' } };
      currentRow += 2;
      
      // Dimensiones para evitar desbordamiento al separador
      const imgWidth = 380;
      const imgHeight = 240;

      // Imagen A (Columna A)
      if (imagenesA[i]) {
        const imgA = workbook.addImage({ base64: imagenesA[i], extension: 'png' });
        sheet.addImage(imgA, { 
          tl: { col: 0, row: currentRow - 1 }, 
          ext: { width: imgWidth, height: imgHeight } 
        });
      }

      // Imagen B (Columna E - Deja C y D libres como separación de 2 celdas)
      if (comparar && imagenesB && imagenesB[i]) {
        const imgB = workbook.addImage({ base64: imagenesB[i], extension: 'png' });
        sheet.addImage(imgB, { 
          tl: { col: 4, row: currentRow - 1 }, 
          ext: { width: imgWidth, height: imgHeight } 
        });
      }
      
      currentRow += 25; 
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `reporte_estadistico_${new Date().getTime()}.xlsx`);
  }

  crearTituloSeccion(sheet, row, titulo, colStart, colEnd) {
    sheet.mergeCells(`${colStart}${row}:${colEnd}${row}`);
    const cell = sheet.getCell(`${colStart}${row}`);
    cell.value = titulo.toUpperCase();
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(row).height = 40; 
  }

  aplicarEstiloCabecera(row, cols) {
    cols.forEach(col => {
      const cell = row.getCell(col);
      cell.font = { bold: true, color: { argb: 'FF1E3A5F' }, size: 12 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EFF7' } };
      cell.border = { bottom: { style: 'medium', color: '#1E3A5F' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  }

  aplicarBordes(row, cols) {
    cols.forEach(col => {
      row.getCell(col).border = { 
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, 
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
      };
      row.getCell(col).alignment = { horizontal: 'center', vertical: 'middle' };
    });
  }
}
