import React, { useRef, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import StatsGrid from '../componentes/StatsGrid';
import TablaFrecuencias from '../componentes/TablaFrecuencias';
import Graficos from '../componentes/Graficos';
import InputForm from '../componentes/InputForm';
import Probabilidad from '../componentes/Probabilidad';
import ReportePDF from '../componentes/ReportePDF';
import Spinner from '../componentes/Spinner';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';

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
  const [errorPDF, setErrorPDF] = useState(null);
  const [probabilidadResult, setProbabilidadResult] = useState(null);

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
        
        <div className="actions">
          {graficosImgs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                fileName="reporte-estadistico.pdf"
                className="send-button"
                style={{ textDecoration: 'none', backgroundColor: 'var(--color-lime)', color: '#000' }}
              >
                {({ loading }) => (loading ? 'Construyendo...' : '⬇️ DESCARGAR AHORA')}
              </PDFDownloadLink>
            </div>
          ) : (
            <button className="send-button" onClick={prepararPDF} disabled={generando}>
              {generando ? <Spinner size="18px" /> : 'Preparar Reporte PDF'}
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
          <TablaFrecuencias frecuencias={resultados.frecuencias} />
        </section>

        <section className="results-section charts-section">
          <h3>Representación Gráfica</h3>
          <div ref={chartsRef}>
            <Graficos 
              frecuencias={resultados.frecuencias} 
              datosOriginales={resultados.datosOriginales} 
            />
          </div>
        </section>
      </div>

      {/* REUBICADO: Explicación al final de la página */}
      <ExplicacionProcedimiento resultados={resultados} />
    </div>
  );
};

export default CalculosPage;
