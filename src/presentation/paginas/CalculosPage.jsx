import React, { useRef, useState, useMemo, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import StatsGrid from '../componentes/StatsGrid';
import TablaFrecuencias from '../componentes/TablaFrecuencias';
import Graficos from '../componentes/Graficos';
import StemLeafDiagram from '../componentes/StemLeafDiagram';
import InputForm from '../componentes/InputForm';
import Probabilidad from '../componentes/Probabilidad';
import ReportePDF from '../componentes/ReportePDF';
import Spinner from '../componentes/Spinner';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';
import { ExportadorExcel } from '../../application/ExportadorExcel';

const CalculosPage = ({ 
  modo, 
  resultados, 
  error,
  onCalculate, 
  onClearError,
  onRandom
}) => {
  const chartsRef = useRef(null);
  const [graficosImgs, setGraficosImgs] = useState([]);
  const [generando, setGenerando] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [errorPDF, setErrorPDF] = useState(null);
  const [probabilidadResult, setProbabilidadResult] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const excelExporter = useMemo(() => new ExportadorExcel(), []);

  // Simular carga con Skeletons al recibir nuevos resultados
  useEffect(() => {
    if (resultados) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [resultados]);

  const capturarGraficos = async () => {
    if (!chartsRef.current) throw new Error("No se encontró el contenedor de gráficos");
    const chartCanvases = chartsRef.current.querySelectorAll('canvas');
    const imgs = [];
    for (const canvas of chartCanvases) {
      const dataUrl = canvas.toDataURL('image/png');
      imgs.push(dataUrl);
    }
    return imgs;
  };

  const prepararPDF = async () => {
    setGenerando(true);
    setErrorPDF(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      if (!chartsRef.current) throw new Error("No se encontró el contenedor de gráficos");
      const chartCanvases = chartsRef.current.querySelectorAll('canvas');
      const imgs = [];
      for (const canvas of chartCanvases) {
        const dataUrl = await toPng(canvas.parentElement, { 
          backgroundColor: '#162325',
          pixelRatio: 2,
        });
        imgs.push(dataUrl);
      }
      setGraficosImgs(imgs);
    } catch (err) {
      console.error("Error capturando gráficos:", err);
      setErrorPDF("Error al procesar los gráficos.");
    } finally {
      setGenerando(false);
    }
  };

  const manejarExportarExcel = async () => {
    setExportandoExcel(true);
    try {
      const imagenes = await capturarGraficos();
      await excelExporter.exportar(
        resultados.estadisticos,
        resultados.frecuencias,
        imagenes,
        resultados.datosOriginales
      );
    } catch (err) {
      console.error("Error al exportar Excel:", err);
    } finally {
      setExportandoExcel(false);
    }
  };

  if (!resultados && modo === 'manual') {
    return (
      <div className="calculos-page input-view">
        <InputForm 
          onCalculate={onCalculate} 
          onRandom={onRandom} 
          error={error} 
          onClearError={onClearError} 
        />
      </div>
    );
  }

  if (!resultados) return null;

  if (isLoading) {
    return (
      <div className="calculos-page results-view">
        <div className="results-header">
          <Skeleton height={40} width={300} baseColor="#162325" highlightColor="#1d2d2f" />
          <Skeleton height={60} baseColor="#162325" highlightColor="#1d2d2f" />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Skeleton height={200} count={1} baseColor="#162325" highlightColor="#1d2d2f" />
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div style={{ flex: 1 }}><Skeleton height={400} baseColor="#162325" highlightColor="#1d2d2f" /></div>
            <div style={{ flex: 1 }}><Skeleton height={400} baseColor="#162325" highlightColor="#1d2d2f" /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calculos-page results-view">
      <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Análisis de Datos</h2>
          <div className="data-preview">
             <strong>Datos ({resultados.datosOriginales.length}):</strong> 
             <p>{resultados.datosOriginales.join(', ')}</p>
          </div>
        </div>
        
        <div className="actions" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            className="action-btn excel-btn" 
            onClick={manejarExportarExcel} 
            disabled={exportandoExcel}
          >
            <div className="btn-content">
              {exportandoExcel ? <Spinner size="18px" /> : (
                <>
                  <span className="btn-icon">📊</span>
                  <div className="btn-text">
                    <span className="btn-main">Excel</span>
                    <span className="btn-sub">Dashboard completo</span>
                  </div>
                </>
              )}
            </div>
          </button>

          {graficosImgs.length > 0 ? (
            <PDFDownloadLink
              document={
                <ReportePDF 
                  datos={resultados.datosOriginales}
                  estadisticos={resultados.estadisticos}
                  frecuencias={resultados.frecuencias}
                  graficosImgs={graficosImgs}
                  probabilidad={probabilidadResult}
                />
              }
              fileName={`reporte-${new Date().getTime()}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <div className="action-btn pdf-btn">
                  <div className="btn-content">
                    <span className="btn-icon">📄</span>
                    <div className="btn-text">
                      <span className="btn-main">{loading ? 'Procesando...' : 'PDF'}</span>
                      <span className="btn-sub">Reporte Profesional</span>
                    </div>
                  </div>
                </div>
              )}
            </PDFDownloadLink>
          ) : (
            <button className="action-btn pdf-btn-prep" onClick={prepararPDF} disabled={generando}>
              <div className="btn-content">
                {generando ? <Spinner size="18px" /> : (
                  <>
                    <span className="btn-icon">📄</span>
                    <div className="btn-text">
                      <span className="btn-main">PDF</span>
                      <span className="btn-sub">Preparar Reporte</span>
                    </div>
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      <section className="results-section">
        <h3>Estadísticos Básicos</h3>
        <StatsGrid estadisticos={resultados.estadisticos} />
      </section>

      <Probabilidad 
        datos={resultados.datosOriginales} 
        onResultadoChange={setProbabilidadResult}
      />

      <div className="results-flex">
        <section className="results-section table-section">
          <h3>Tabla de Frecuencias</h3>
          <TablaFrecuencias frecuencias={resultados.frecuencias} hoverIndex={hoverIndex} />
          
          <div style={{ marginTop: '2rem' }}>
            <StemLeafDiagram datos={resultados.datosOriginales} />
          </div>
        </section>

        <section className="results-section charts-section">
          <h3>Representación Gráfica</h3>
          <div ref={chartsRef}>
            <Graficos 
              frecuencias={resultados.frecuencias} 
              datosOriginales={resultados.datosOriginales} 
              estadisticos={resultados.estadisticos}
              onHoverIndex={setHoverIndex}
            />
          </div>
        </section>
      </div>

      <ExplicacionProcedimiento resultados={resultados} />
    </div>
  );
};

export default CalculosPage;
