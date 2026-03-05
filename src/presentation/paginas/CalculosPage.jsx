import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { VscDiffAdded, VscArrowLeft, VscFilePdf } from 'react-icons/vsc';
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
  modo, resultadosA, resultadosB, comparar, error, onCalculate, onClearError, onRandom, onClear 
}) => {
  const chartsContainerRef = useRef(null);
  const [graficosImgs, setGraficosImgs] = useState([]);
  const [graficosImgsB, setGraficosImgsB] = useState([]);
  const [generando, setGenerando] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInputB, setShowInputB] = useState(false);
  const [probabilidadResult, setProbabilidadResult] = useState(null);

  const excelExporter = useMemo(() => new ExportadorExcel(), []);

  useEffect(() => {
    if (resultadosA || resultadosB) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [resultadosA, resultadosB]);

  useEffect(() => {
    setGraficosImgs([]);
    setGraficosImgsB([]);
  }, [probabilidadResult, resultadosA, resultadosB, comparar]);

  const captureConfig = {
    backgroundColor: '#162325',
    pixelRatio: 3,
    style: {
      padding: '40px',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  const prepararPDF = async () => {
    setGenerando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      if (!chartsContainerRef.current) return;
      const targets = chartsContainerRef.current.querySelectorAll('.sample-column-target');
      
      const imgsA = [];
      const boxesA = targets[0]?.querySelectorAll('.chart-box') || [];
      for (const box of boxesA) {
        imgsA.push(await toPng(box, captureConfig));
      }

      const imgsB = [];
      if (comparar && targets[1]) {
        const boxesB = targets[1].querySelectorAll('.chart-box');
        for (const box of boxesB) {
          imgsB.push(await toPng(box, captureConfig));
        }
      }

      setGraficosImgs(imgsA);
      setGraficosImgsB(imgsB);
      toast.success('Reporte PDF listo');
    } catch (err) {
      toast.error('Error al capturar gráficos');
    } finally {
      setGenerando(false);
    }
  };

  const manejarExportarExcel = async () => {
    setExportandoExcel(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const targets = chartsContainerRef.current.querySelectorAll('.sample-column-target');
      
      const imgsA = [];
      const boxesA = targets[0]?.querySelectorAll('.chart-box') || [];
      for (const box of boxesA) {
        imgsA.push(await toPng(box, captureConfig));
      }

      const imgsB = [];
      if (comparar && targets[1]) {
        const boxesB = targets[1].querySelectorAll('.chart-box');
        for (const box of boxesB) {
          imgsB.push(await toPng(box, captureConfig));
        }
      }

      await excelExporter.exportar(resultadosA, resultadosB, imgsA, imgsB, comparar);
      toast.success('Excel generado correctamente');
    } catch (err) {
      toast.error('Error al generar Excel');
    } finally {
      setExportandoExcel(false);
    }
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (!resultadosA && modo === 'manual') {
    return <div className="calculos-page input-view"><InputForm onCalculate={(v)=>onCalculate(v,'A')} onRandom={()=>onRandom('A')} error={error} onClearError={onClearError} /></div>;
  }

  if (!resultadosA) return null;

  return (
    <div className="calculos-container-wrapper">
      <nav className="sticky-sidebar glass">
        <div className="sidebar-header"><span>🔍</span><h3>ÍNDICE</h3></div>
        <ul className="sidebar-menu">
          {['estadisticos', 'probabilidad', 'tabla', 'tallo-hoja', 'graficos', 'interpretacion'].map(id => (
            <li key={id} onClick={() => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}>
              {id.toUpperCase()}
            </li>
          ))}
        </ul>
        <button className="back-home-btn" onClick={onClear}><VscArrowLeft /> VOLVER</button>
      </nav>

      <div className="main-scroll-content" ref={chartsContainerRef}>
        <header className="results-header-new glass">
          <div className="header-info">
            <h2>Análisis de Datos</h2>
            <div style={{display:'flex', gap:'10px'}}>
              <span className="sample-tag">A: {resultadosA.datosOriginales.length} datos</span>
              {resultadosB && <span className="sample-tag sample-b">B: {resultadosB.datosOriginales.length} datos</span>}
            </div>
          </div>
          <div className="header-actions">
            {!resultadosB && !showInputB && <button className="action-btn-pill compare-btn" onClick={()=>setShowInputB(true)}><VscDiffAdded/> COMPARAR</button>}
            <button className="action-btn-pill excel-btn-new" onClick={manejarExportarExcel} disabled={exportandoExcel}>{exportandoExcel ? <Spinner size="14px"/> : '📊 EXCEL'}</button>
            
            {graficosImgs.length > 0 ? (
              <PDFDownloadLink 
                document={<ReportePDF datosA={resultadosA.datosOriginales} estadisticosA={resultadosA.estadisticos} frecuenciasA={resultadosA.frecuencias} graficosImgsA={graficosImgs} datosB={resultadosB?.datosOriginales} estadisticosB={resultadosB?.estadisticos} frecuenciasB={resultadosB?.frecuencias} graficosImgsB={graficosImgsB} comparar={comparar} probabilidadA={probabilidadResult} />} 
                fileName="reporte_analisis.pdf"
              >
                {({ loading }) => (
                  <button className="action-btn-pill pdf-btn-new">
                    <VscFilePdf/> {loading ? '...' : 'DESCARGAR PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            ) : (
              <button className="action-btn-pill pdf-btn-prep" onClick={prepararPDF} disabled={generando}>
                {generando ? <Spinner size="14px"/> : <><VscFilePdf/> PREPARAR PDF</>}
              </button>
            )}
          </div>
        </header>

        {showInputB && !resultadosB && (
          <div className="compare-input-overlay glass">
            <div className="overlay-content">
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}><h3>Configurar Muestra B</h3><button className="close-btn" onClick={()=>setShowInputB(false)}>×</button></div>
              <InputForm onCalculate={(v)=>onCalculate(v,'B')} onRandom={()=>onRandom('B')} error={error} onClearError={onClearError} />
            </div>
          </div>
        )}

        {comparar && resultadosB ? (
          <div className="comparison-view">
            <motion.section id="estadisticos" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>📊 MÉTRICAS COMPARATIVAS</h3></div>
              <div className="dual-grid">
                <div className="column-a"><h4 className="label-a">MUESTRA A</h4><StatsGrid estadisticos={resultadosA.estadisticos} /></div>
                <div className="column-b"><h4 className="label-b">MUESTRA B</h4><StatsGrid estadisticos={resultadosB.estadisticos} /></div>
              </div>
            </motion.section>
            <motion.section id="tabla" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>📋 TABLAS DE FRECUENCIA</h3></div>
              <div className="dual-grid">
                <div className="column-a"><TablaFrecuencias frecuencias={resultadosA.frecuencias} hoverIndex={hoverIndex} /></div>
                <div className="column-b"><TablaFrecuencias frecuencias={resultadosB.frecuencias} /></div>
              </div>
            </motion.section>
            <motion.section id="tallo-hoja" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>🌿 DISTRIBUCIÓN TALLO Y HOJA</h3></div>
              <div className="dual-grid">
                <div className="column-a"><StemLeafDiagram datos={resultadosA.datosOriginales} /></div>
                <div className="column-b"><StemLeafDiagram datos={resultadosB.datosOriginales} /></div>
              </div>
            </motion.section>
            <motion.section id="graficos" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>📈 ANÁLISIS VISUAL SIMÉTRICO</h3></div>
              <div className="dual-grid">
                <div className="sample-column-target column-a"><Graficos frecuencias={resultadosA.frecuencias} datosOriginales={resultadosA.datosOriginales} estadisticos={resultadosA.estadisticos} onHoverIndex={setHoverIndex} /></div>
                <div className="sample-column-target column-b"><Graficos frecuencias={resultadosB.frecuencias} datosOriginales={resultadosB.datosOriginales} estadisticos={resultadosB.estadisticos} /></div>
              </div>
            </motion.section>
          </div>
        ) : (
          <div className="single-sample-view">
            <motion.section id="estadisticos" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>📊 ESTADÍSTICOS BÁSICOS</h3></div>
              <div className="zoom-container"><StatsGrid estadisticos={resultadosA.estadisticos} /></div>
            </motion.section>
            <motion.section id="probabilidad" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>🎯 ANÁLISIS DE PROBABILIDAD</h3></div>
              <div className="zoom-container"><Probabilidad datos={resultadosA.datosOriginales} onResultadoChange={setProbabilidadResult} /></div>
            </motion.section>
            <motion.section id="tabla" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>📋 TABLA DE DISTRIBUCIÓN</h3></div>
              <div className="zoom-container"><TablaFrecuencias frecuencias={resultadosA.frecuencias} hoverIndex={hoverIndex} /></div>
            </motion.section>
            <motion.section id="tallo-hoja" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>🌿 DIAGRAMA DE TALLO Y HOJA</h3></div>
              <div className="zoom-container"><StemLeafDiagram datos={resultadosA.datosOriginales} /></div>
            </motion.section>
            <motion.section id="graficos" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>📈 REPRESENTACIÓN GRÁFICA</h3></div>
              <div className="sample-column-target zoom-container">
                <Graficos frecuencias={resultadosA.frecuencias} datosOriginales={resultadosA.datosOriginales} estadisticos={resultadosA.estadisticos} onHoverIndex={setHoverIndex} />
              </div>
            </motion.section>
            <motion.section id="interpretacion" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="zoom-container"><ExplicacionProcedimiento resultados={resultadosA} /></div>
            </motion.section>
          </div>
        )}
      </div>

      <style jsx>{`
        .calculos-container-wrapper { display: flex; background: var(--color-bg); min-height: 100vh; width: 100%; }
        .sticky-sidebar { width: 300px; height: 100vh; position: sticky; top: 0; padding: 3rem 1.5rem; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; z-index: 100; }
        .sidebar-header { display: flex; align-items: center; gap: 15px; margin-bottom: 3rem; }
        .sidebar-header h3 { font-size: 1.6rem; letter-spacing: 3px; color: var(--color-lime); font-weight: 900; }
        .sidebar-menu { list-style: none; padding: 0; flex: 1; margin-top: 2rem; }
        .sidebar-menu li { padding: 18px 25px; border-radius: 15px; cursor: pointer; color: #888; display: flex; align-items: center; gap: 15px; transition: 0.3s; font-weight: bold; font-size: 1rem; margin-bottom: 12px; border: 1px solid transparent; }
        .sidebar-menu li:hover { background: rgba(202, 244, 56, 0.15); color: var(--color-lime); transform: translateX(12px); border-color: rgba(202, 244, 56, 0.3); }
        .main-scroll-content { flex: 1; padding: 3rem 5%; width: calc(100% - 300px); }
        .results-header-new { display: flex; justify-content: space-between; align-items: center; padding: 2rem 3.5rem; border-radius: 24px; margin-bottom: 5rem; }
        .zoom-container { max-width: 1250px; margin: 0 auto; width: 100%; }
        .dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; width: 100%; }
        .section-title.centered { text-align: center; width: 100%; }
        .section-title h3 { font-size: 2.2rem; color: var(--color-lime); margin-bottom: 4rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 900; }
        .label-a { color: var(--color-sky); border-left: 6px solid var(--color-blue); padding-left: 20px; margin-bottom: 2.5rem; text-transform: uppercase; font-size: 1.1rem; }
        .label-b { color: var(--color-lime); border-left: 6px solid var(--color-lime); padding-left: 20px; margin-bottom: 2.5rem; text-transform: uppercase; font-size: 1.1rem; }
        .results-section-card { margin-bottom: 8rem; width: 100%; }
        .sample-tag { background: rgba(0,107,180,0.25); color: var(--color-sky); padding: 10px 25px; border-radius: 50px; font-weight: 800; font-size: 1rem; }
        .sample-b { background: rgba(202, 244, 56, 0.15); color: var(--color-lime); }
        .action-btn-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 14px 30px; border-radius: 50px; cursor: pointer; font-weight: 800; font-size: 1rem; display: flex; align-items: center; gap: 12px; transition: 0.4s; }
        .pdf-btn-new { background: var(--color-lime); color: #000; border: none; }
        .back-home-btn { background: rgba(222,68,59,0.1); border: 1px solid var(--color-red); color: var(--color-red); padding: 18px; border-radius: 15px; font-weight: 900; cursor: pointer; margin-top: auto; font-size: 1.1rem; }
        @media (max-width: 1024px) { .dual-grid { grid-template-columns: 1fr; } .sticky-sidebar { display: none; } .main-scroll-content { width: 100%; } }
      `}</style>
    </div>
  );
};

export default CalculosPage;
