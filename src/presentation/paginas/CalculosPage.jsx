import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { VscListSelection, VscDiffAdded, VscCheckAll, VscArrowLeft } from 'react-icons/vsc';
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
  resultadosA, 
  resultadosB,
  comparar,
  error,
  onCalculate, 
  onClearError,
  onRandom,
  onClear
}) => {
  const chartsRef = useRef(null);
  const [graficosImgs, setGraficosImgs] = useState([]);
  const [generando, setGenerando] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInputB, setShowInputB] = useState(false);

  const excelExporter = useMemo(() => new ExportadorExcel(), []);

  useEffect(() => {
    if (resultadosA || resultadosB) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [resultadosA, resultadosB]);

  const capturarGraficos = async () => {
    if (!chartsRef.current) return [];
    const chartCanvases = chartsRef.current.querySelectorAll('canvas');
    const imgs = [];
    for (const canvas of chartCanvases) {
      imgs.push(canvas.toDataURL('image/png'));
    }
    return imgs;
  };

  const manejarExportarExcel = async () => {
    setExportandoExcel(true);
    try {
      const imagenes = await capturarGraficos();
      await excelExporter.exportar(
        resultadosA.estadisticos,
        resultadosA.frecuencias,
        imagenes,
        resultadosA.datosOriginales
      );
    } catch (err) {
      console.error(err);
    } finally {
      setExportandoExcel(false);
    }
  };

  const secciones = [
    { id: 'estadisticos', label: 'Estadísticos', icon: '📊' },
    { id: 'probabilidad', label: 'Probabilidad', icon: '🎯' },
    { id: 'tabla', label: 'Frecuencias', icon: '📋' },
    { id: 'tallo-hoja', label: 'Tallo y Hoja', icon: '🌿' },
    { id: 'graficos', label: 'Gráficos', icon: '📈' },
    { id: 'interpretacion', label: 'Interpretación', icon: '💡' }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!resultadosA && modo === 'manual') {
    return <div className="calculos-page input-view"><InputForm onCalculate={(val) => onCalculate(val, 'A')} onRandom={() => onRandom('A')} error={error} onClearError={onClearError} /></div>;
  }

  if (!resultadosA) return null;

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="calculos-container-wrapper" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      
      {/* 1. SIDEBAR DE NAVEGACIÓN */}
      <nav className="sticky-sidebar glass">
        <div className="sidebar-header">
          <span className="sidebar-logo">🔍</span>
          <h3>ÍNDICE</h3>
        </div>
        <ul className="sidebar-menu">
          {secciones.map(s => (
            <li key={s.id} onClick={() => scrollTo(s.id)}>
              <span className="menu-icon">{s.icon}</span>
              <span className="menu-label">{s.label}</span>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button className="back-home-btn" onClick={onClear}>
            <VscArrowLeft /> VOLVER
          </button>
        </div>
      </nav>

      <div className="calculos-page results-view main-scroll-content">
        <header className="results-header-new glass">
          <div className="header-info">
            <h2>Análisis {comparar ? 'Comparativo' : 'Estadístico'}</h2>
            <p className="sample-tag">Muestra A: {resultadosA.datosOriginales.length} datos</p>
            {resultadosB && <p className="sample-tag sample-b">Muestra B: {resultadosB.datosOriginales.length} datos</p>}
          </div>
          
          <div className="header-actions">
            {!resultadosB && !showInputB && (
              <button className="action-btn-pill compare-btn" onClick={() => setShowInputB(true)}>
                <VscDiffAdded /> COMPARAR CON OTRA MUESTRA
              </button>
            )}
            
            <button className="action-btn-pill excel-btn-new" onClick={manejarExportarExcel} disabled={exportandoExcel}>
              {exportandoExcel ? <Spinner size="14px" /> : '📊 Excel Dashboard'}
            </button>
          </div>
        </header>

        {showInputB && !resultadosB && (
          <div className="compare-input-overlay glass">
            <div className="overlay-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Configurar Muestra B</h3>
                <button onClick={() => setShowInputB(false)} className="close-btn">×</button>
              </div>
              <InputForm onCalculate={(val) => onCalculate(val, 'B')} onRandom={() => onRandom('B')} error={error} onClearError={onClearError} />
            </div>
          </div>
        )}

        <main className="results-grid-layout">
          {/* SECCIONES DINÁMICAS CON SCROLL REVEAL */}
          <motion.section 
            id="estadisticos" 
            className="results-section-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealVariants}
          >
            <div className="section-title"><h3>Estadísticos Básicos</h3></div>
            <div className={comparar ? 'comparison-flex' : ''}>
              <div className="sample-column">
                {comparar && <h4 className="col-label">Muestra A</h4>}
                <StatsGrid estadisticos={resultadosA.estadisticos} />
              </div>
              {comparar && resultadosB && (
                <div className="sample-column">
                  <h4 className="col-label label-b">Muestra B</h4>
                  <StatsGrid estadisticos={resultadosB.estadisticos} />
                </div>
              )}
            </div>
          </motion.section>

          <motion.section 
            id="probabilidad" 
            className="results-section-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealVariants}
          >
            <div className="section-title"><h3>Análisis de Probabilidad</h3></div>
            <div className={comparar ? 'comparison-flex' : ''}>
              <div className="sample-column"><Probabilidad datos={resultadosA.datosOriginales} /></div>
              {comparar && resultadosB && <div className="sample-column"><Probabilidad datos={resultadosB.datosOriginales} /></div>}
            </div>
          </motion.section>

          <div className={comparar ? 'comparison-flex' : 'results-flex-dual'}>
            <motion.section 
              id="tabla" 
              className="results-section-card flex-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={revealVariants}
            >
              <div className="section-title"><h3>Frecuencias</h3></div>
              <TablaFrecuencias frecuencias={resultadosA.frecuencias} hoverIndex={hoverIndex} />
              {comparar && resultadosB && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 className="col-label label-b">Frecuencias Muestra B</h4>
                  <TablaFrecuencias frecuencias={resultadosB.frecuencias} />
                </div>
              )}
            </motion.section>

            <motion.section 
              id="tallo-hoja" 
              className="results-section-card flex-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={revealVariants}
            >
              <div className="section-title"><h3>Diagrama Tallo y Hoja</h3></div>
              <StemLeafDiagram datos={resultadosA.datosOriginales} />
              {comparar && resultadosB && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 className="col-label label-b">Tallo y Hoja Muestra B</h4>
                  <StemLeafDiagram datos={resultadosB.datosOriginales} />
                </div>
              )}
            </motion.section>
          </div>

          <motion.section 
            id="graficos" 
            className="results-section-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={revealVariants}
          >
            <div className="section-title"><h3>Visualización Gráfica</h3></div>
            <div ref={chartsRef} className={comparar ? 'comparison-flex' : ''}>
              <div className="sample-column">
                {comparar && <h4 className="col-label">Gráficos Muestra A</h4>}
                <Graficos frecuencias={resultadosA.frecuencias} datosOriginales={resultadosA.datosOriginales} estadisticos={resultadosA.estadisticos} onHoverIndex={setHoverIndex} />
              </div>
              {comparar && resultadosB && (
                <div className="sample-column">
                  <h4 className="col-label label-b">Gráficos Muestra B</h4>
                  <Graficos frecuencias={resultadosB.frecuencias} datosOriginales={resultadosB.datosOriginales} estadisticos={resultadosB.estadisticos} />
                </div>
              )}
            </div>
          </motion.section>

          <motion.section 
            id="interpretacion" 
            className="results-section-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealVariants}
          >
            <ExplicacionProcedimiento resultados={resultadosA} />
          </motion.section>
        </main>
      </div>

      <style jsx>{`
        .calculos-container-wrapper {
          background: var(--color-bg);
          color: #fff;
        }
        
        .sticky-sidebar {
          width: 240px;
          height: 100vh;
          position: sticky;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          padding: 2rem 1rem;
          border-right: 1px solid rgba(255,255,255,0.05);
          z-index: 100;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 2rem;
        }

        .sidebar-logo { font-size: 1.5rem; }
        .sidebar-menu { list-style: none; padding: 0; flex: 1; }
        
        .sidebar-menu li {
          padding: 12px 15px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          margin-bottom: 5px;
          color: #aaa;
        }

        .sidebar-menu li:hover {
          background: rgba(202, 244, 56, 0.1);
          color: var(--color-lime);
          transform: translateX(5px);
        }

        .main-scroll-content {
          flex: 1;
          padding: 2rem 3rem;
          max-width: calc(100vw - 240px);
        }

        .results-header-new {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
        }

        .sample-tag {
          display: inline-block;
          background: rgba(0, 107, 180, 0.2);
          color: var(--color-sky);
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-top: 5px;
          margin-right: 10px;
        }

        .sample-b { background: rgba(202, 244, 56, 0.1); color: var(--color-lime); }

        .action-btn-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 10px 20px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .compare-btn:hover { background: var(--color-sky); color: #000; }
        .excel-btn-new:hover { background: #1D6F42; border-color: #2ecc71; }

        .comparison-flex {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .col-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-sky);
          margin-bottom: 1rem;
          border-left: 3px solid var(--color-blue);
          padding-left: 10px;
        }

        .label-b { color: var(--color-lime); border-color: var(--color-lime); }

        .results-section-card {
          margin-bottom: 3rem;
          animation: fadeIn 0.5s ease-out;
        }

        .section-title h3 {
          font-size: 1.2rem;
          color: var(--color-lime);
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .compare-input-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .overlay-content {
          width: 90%;
          max-width: 800px;
          padding: 3rem;
          border-radius: 30px;
          position: relative;
        }

        .close-btn {
          background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .sticky-sidebar { display: none; }
          .main-scroll-content { max-width: 100%; padding: 1rem; }
          .comparison-flex { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default CalculosPage;
