import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { toJpeg, toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import emailjs from '@emailjs/browser';
import { VscDiffAdded, VscArrowLeft, VscFilePdf, VscMail, VscScreenFull, VscEyeClosed, VscSettings, VscReport } from 'react-icons/vsc';
import StatsGrid from '../componentes/StatsGrid';
import TablaFrecuencias from '../componentes/TablaFrecuencias';
import Graficos from '../componentes/Graficos';
import StemLeafDiagram from '../componentes/StemLeafDiagram';
import InputForm from '../componentes/InputForm';
import Probabilidad from '../componentes/Probabilidad';
import ReportePDF from '../componentes/ReportePDF';
import Spinner from '../componentes/Spinner';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';
import EmptyState from '../componentes/EmptyState';
import { ExportadorExcel } from '../../application/ExportadorExcel';
import { usePreferences } from '../../hooks/usePreferences';

const CalculosPage = ({ 
  modo, resultadosA, resultadosB, comparar, error, onCalculate, onClearError, onRandom, onClear 
}) => {
  const chartsContainerRef = useRef(null);
  const { preferences, toggleChart } = usePreferences();
  const [showPrefs, setShowPrefs] = useState(false);
  
  const [graficosImgs, setGraficosImgs] = useState([]);
  const [graficosImgsB, setGraficosImgsB] = useState([]);
  const [generando, setGenerando] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInputB, setShowInputB] = useState(false);
  const [probabilidadResult, setProbabilidadResult] = useState(null);
  const [horaAnalisis, setHoraAnalisis] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [modoPresentacion, setModoPresentacion] = useState(false);

  const excelExporter = useMemo(() => new ExportadorExcel(), []);

  const secciones = [
    { id: 'estadisticos', label: 'Estadísticos', icon: '📊' },
    { id: 'probabilidad', label: 'Probabilidad', icon: '🎯' },
    { id: 'tabla', label: 'Tablas', icon: '📋' },
    { id: 'tallo-hoja', label: 'Distribución', icon: '🌿' },
    { id: 'graficos', label: 'Gráficos', icon: '📈' },
    { id: 'interpretacion', label: 'Análisis', icon: '💡' }
  ];

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    if (resultadosA || resultadosB) {
      setIsLoading(true);
      setHoraAnalisis(new Date().toLocaleTimeString());
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [resultadosA, resultadosB]);

  useEffect(() => {
    setGraficosImgs([]);
    setGraficosImgsB([]);
  }, [probabilidadResult, resultadosA, resultadosB, comparar]);

  const capturarGrafico = async (el) => {
    if (!el) return null;
    const originalStyle = el.style.cssText;
    
    // Ajuste de tamaño temporal para que Chart.js renderice todo
    el.style.width = '1000px';
    el.style.height = '600px';
    el.style.padding = '40px';
    
    // Forzamos un pequeño retraso para el redibujado
    await new Promise(r => setTimeout(r, 1200));

    try {
      const img = await toPng(el, { 
        pixelRatio: 2, // 2 es ideal para evitar imágenes negras por exceso de memoria
        backgroundColor: '#162325',
        skipFonts: true,
        style: { margin: '0' }
      });
      return img;
    } catch (e) {
      console.error("Error capturando gráfico:", e);
      return null;
    } finally {
      el.style.cssText = originalStyle;
    }
  };

  const prepararPDF = async () => {
    setGenerando(true);
    const tid = toast.loading('Capturando gráficas completas...');
    try {
      if (!chartsContainerRef.current) return;
      const targets = chartsContainerRef.current.querySelectorAll('.sample-column-target');
      
      const imgsA = [];
      const boxesA = targets[0]?.querySelectorAll('.chart-box') || [];
      for (const b of boxesA) {
        const img = await capturarGrafico(b);
        if (img) imgsA.push(img);
      }

      const imgsB = [];
      if (comparar && targets[1]) {
        const boxesB = targets[1].querySelectorAll('.chart-box');
        for (const b of boxesB) {
          const img = await capturarGrafico(b);
          if (img) imgsB.push(img);
        }
      }

      setGraficosImgs(imgsA);
      setGraficosImgsB(imgsB);
      toast.success('Reporte UHD listo', { id: tid });
    } catch (e) {
      toast.error('Error al preparar captura', { id: tid });
    } finally {
      setGenerando(false);
    }
  };

  const manejarEnvioCorreo = async (e) => {
    e.preventDefault();
    if (!graficosImgs.length) {
      toast.error('Primero debes preparar el PDF');
      return;
    }
    setEnviandoEmail(true);
    const tid = toast.loading('Enviando...');
    try {
      const doc = <ReportePDF 
        datosA={resultadosA.datosOriginales} estadisticosA={resultadosA.estadisticos} 
        frecuenciasA={resultadosA.frecuencias} graficosImgsA={graficosImgs} 
        datosB={resultadosB?.datosOriginales || []} estadisticosB={resultadosB?.estadisticos || {}} 
        frecuenciasB={resultadosB?.frecuencias || []} graficosImgsB={graficosImgsB} 
        comparar={comparar} probabilidadA={probabilidadResult} 
      />;
      const blob = await pdf(doc).toBlob();
      const reader = new FileReader();
      const base64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });
      await emailjs.send("service_eojd6cj", "template_13sk7qc", {
        to_email: email, content: base64, message: `Reporte generado a las ${horaAnalisis}.`
      }, "pAGIZIiEgJJTqr-bo");
      toast.success('¡Reporte enviado!', { id: tid });
      setShowEmailModal(false);
    } catch (err) {
      toast.error('Error al enviar', { id: tid });
    } finally {
      setEnviandoEmail(false);
    }
  };

  const manejarExportarExcel = async () => {
    setExportandoExcel(true);
    const tid = toast.loading('Generando Excel...');
    try {
      const targets = chartsContainerRef.current.querySelectorAll('.sample-column-target');
      const imgsA = [];
      const boxesA = targets[0]?.querySelectorAll('.chart-box') || [];
      for (const b of boxesA) imgsA.push(await capturarGrafico(b));
      const imgsB = [];
      if (comparar && targets[1]) {
        const boxesB = targets[1].querySelectorAll('.chart-box');
        for (const b of boxesB) imgsB.push(await capturarGrafico(b));
      }
      await excelExporter.exportar(resultadosA, resultadosB, imgsA, imgsB, comparar);
      toast.success('Excel descargado', { id: tid });
    } catch (e) { toast.error('Error en Excel', { id: tid }); } finally { setExportandoExcel(false); }
  };

  if (!resultadosA) {
    return <EmptyState onManual={() => onClear()} onRandom={() => onRandom('A')} />;
  }

  return (
    <div className={`calculos-container-wrapper ${modoPresentacion ? 'presentation-active' : ''}`}>
      
      <div className="floating-prefs no-print">
        <button className="action-btn-pill" onClick={() => setShowPrefs(!showPrefs)} title="Ajustes de visualización">
          <VscSettings />
        </button>
        <button className="action-btn-pill" onClick={() => window.print()} title="Modo Impresión">
          <VscReport />
        </button>
      </div>

      <AnimatePresence>
        {showPrefs && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="prefs-panel glass no-print">
            <h4 style={{ color: 'var(--color-lime)', fontSize: '0.8rem', marginBottom: '1rem' }}>MOSTRAR GRÁFICOS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.keys(preferences.visibleCharts).map(id => (
                <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={preferences.visibleCharts[id]} onChange={() => toggleChart(id)} />
                  {id.toUpperCase()}
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!modoPresentacion && (
        <nav className="sticky-sidebar glass no-print">
          <div className="sidebar-header"><span>🔍</span><h3>ÍNDICE</h3></div>
          <ul className="sidebar-menu">
            {secciones.map(s => (
              <li key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'})}>
                <span className="menu-icon">{s.icon}</span>
                <span className="menu-label">{s.label.toUpperCase()}</span>
              </li>
            ))}
          </ul>
          <button className="back-home-btn" onClick={onClear}><VscArrowLeft /> VOLVER</button>
        </nav>
      )}

      <div className="main-scroll-content" ref={chartsContainerRef}>
        <header className="results-header-new glass">
          <div className="header-info">
            <h2>Análisis de Datos <span style={{fontSize:'0.8rem', color:'#888', fontWeight:'normal'}}>({horaAnalisis})</span></h2>
            <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
              <span className="sample-tag">A: {resultadosA.datosOriginales.length} datos</span>
              {resultadosB && <span className="sample-tag sample-b">B: {resultadosB.datosOriginales.length} datos</span>}
            </div>
          </div>
          <div className="header-actions no-print">
            <button className="action-btn-pill" onClick={() => setModoPresentacion(!modoPresentacion)}>
              {modoPresentacion ? <><VscEyeClosed/> SALIR</> : <><VscScreenFull/> MODO TV</>}
            </button>
            <button className="action-btn-pill" onClick={() => setShowEmailModal(true)}><VscMail /> ENVIAR</button>
            {!resultadosB && !showInputB && <button className="action-btn-pill compare-btn" onClick={()=>setShowInputB(true)}><VscDiffAdded/> COMPARAR</button>}
            <button className="action-btn-pill excel-btn-new" onClick={manejarExportarExcel} disabled={exportandoExcel}>{exportandoExcel ? <Spinner size="14px"/> : '📊 EXCEL'}</button>
            {graficosImgs.length > 0 ? (
              <PDFDownloadLink document={<ReportePDF datosA={resultadosA.datosOriginales} estadisticosA={resultadosA.estadisticos} frecuenciasA={resultadosA.frecuencias} graficosImgsA={graficosImgs} datosB={resultadosB?.datosOriginales || []} estadisticosB={resultadosB?.estadisticos || {}} frecuenciasB={resultadosB?.frecuencias || []} graficosImgsB={graficosImgsB} comparar={comparar} probabilidadA={probabilidadResult} />} fileName="reporte.pdf">
                <button className="action-btn-pill pdf-btn-new"><VscFilePdf/> DESCARGAR PDF</button>
              </PDFDownloadLink>
            ) : <button className="action-btn-pill pdf-btn-prep" onClick={prepararPDF} disabled={generando}>{generando ? <Spinner size="14px"/> : <><VscFilePdf/> PREPARAR</>}</button>}
          </div>
        </header>

        <AnimatePresence>
          {showEmailModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="compare-input-overlay glass no-print">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="overlay-content">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}>
                  <h3>✉️ Enviar Reporte PDF</h3>
                  <button className="close-btn" onClick={()=>setShowEmailModal(false)}>×</button>
                </div>
                <form onSubmit={manejarEnvioCorreo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <input type="email" required placeholder="tu@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} style={{ padding: '15px', borderRadius: '10px', background: '#060010', border: '1px solid #444', color: '#fff' }} />
                  <button type="submit" disabled={enviandoEmail} className="action-btn-pill pdf-btn-new" style={{ width: '100%', justifyContent: 'center' }}>
                    {enviandoEmail ? <Spinner size="18px"/> : 'ENVIAR REPORTE'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showInputB && !resultadosB && (
          <div className="compare-input-overlay glass no-print">
            <div className="overlay-content">
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}><h3>Muestra B</h3><button className="close-btn" onClick={()=>setShowInputB(false)}>×</button></div>
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
            <motion.section id="probabilidad" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>🎯 ANÁLISIS DE PROBABILIDAD</h3></div>
              <div className="dual-grid">
                <div className="column-a"><Probabilidad datos={resultadosA.datosOriginales} onResultadoChange={setProbabilidadResult} /></div>
                <div className="column-b"><Probabilidad datos={resultadosB.datosOriginales} /></div>
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
              <div ref={chartsContainerRef} className="dual-grid">
                <div className="sample-column-target column-a">
                  <Graficos frecuencias={resultadosA.frecuencias} datosOriginales={resultadosA.datosOriginales} estadisticos={resultadosA.estadisticos} onHoverIndex={setHoverIndex} visibleCharts={preferences.visibleCharts} />
                </div>
                <div className="sample-column-target column-b">
                  <Graficos frecuencias={resultadosB.frecuencias} datosOriginales={resultadosB.datosOriginales} estadisticos={resultadosB.estadisticos} visibleCharts={preferences.visibleCharts} />
                </div>
              </div>
            </motion.section>
            <motion.section id="interpretacion" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>💡 ANÁLISIS INTERPRETATIVO</h3></div>
              <div className="zoom-container">
                <ExplicacionProcedimiento resultados={resultadosA} resultadosB={resultadosB} comparar={comparar} />
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
              <div ref={chartsContainerRef} className="sample-column-target zoom-container">
                <Graficos frecuencias={resultadosA.frecuencias} datosOriginales={resultadosA.datosOriginales} estadisticos={resultadosA.estadisticos} onHoverIndex={setHoverIndex} visibleCharts={preferences.visibleCharts} />
              </div>
            </motion.section>
            <motion.section id="interpretacion" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>💡 ANÁLISIS INTERPRETATIVO</h3></div>
              <div className="zoom-container">
                <ExplicacionProcedimiento resultados={resultadosA} />
              </div>
            </motion.section>
          </div>
        )}
      </div>

      <style>{`
        .calculos-container-wrapper { display: flex; background: var(--color-bg); min-height: 100vh; width: 100%; transition: all 0.5s ease; }
        .presentation-active .sticky-sidebar { display: none; }
        .presentation-active .main-scroll-content { width: 100%; padding: 3rem 10%; }
        
        .sticky-sidebar { width: 300px; height: 100vh; position: sticky; top: 0; padding: 3rem 1.5rem; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; z-index: 100; }
        .sidebar-header h3 { font-size: 1.6rem; letter-spacing: 3px; color: var(--color-lime); font-weight: 900; }
        .sidebar-menu li { padding: 18px 25px; border-radius: 15px; cursor: pointer; color: #888; display: flex; align-items: center; gap: 15px; transition: 0.3s; font-weight: bold; font-size: 1rem; margin-bottom: 12px; }
        .sidebar-menu li:hover { background: rgba(202, 244, 56, 0.15); color: var(--color-lime); transform: translateX(12px); }
        
        .main-scroll-content { flex: 1; padding: 3rem 5%; width: calc(100% - 300px); }
        .results-header-new { display: flex; justify-content: space-between; align-items: center; padding: 2rem 3.5rem; border-radius: 24px; margin-bottom: 5rem; }
        .results-header-new h2 { font-size: 2.2rem; font-weight: 800; }
        
        .zoom-container { max-width: 1250px; margin: 0 auto; width: 100%; }
        .dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; width: 100%; }
        .section-title h3 { font-size: 2.2rem; color: var(--color-lime); margin-bottom: 4rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 900; text-align: center; }
        .label-a { color: var(--color-sky); border-left: 6px solid var(--color-blue); padding-left: 20px; margin-bottom: 2.5rem; text-transform: uppercase; }
        .label-b { color: var(--color-lime); border-left: 6px solid var(--color-lime); padding-left: 20px; margin-bottom: 2.5rem; text-transform: uppercase; }
        .action-btn-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 14px 30px; border-radius: 50px; cursor: pointer; font-weight: 800; display: flex; align-items: center; gap: 12px; }
        .pdf-btn-new { background: var(--color-lime); color: #000; border: none; }
        .back-home-btn { background: rgba(222,68,59,0.1); border: 1px solid var(--color-red); color: var(--color-red); padding: 18px; border-radius: 15px; font-weight: 900; margin-top: auto; }
        .compare-input-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .overlay-content { background: #060010; padding: 3rem; border-radius: 30px; border: 1px solid var(--color-lime); width: 90%; max-width: 600px; }
        .close-btn { background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }
        
        .floating-prefs { position: fixed; top: 100px; right: 30px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
        .prefs-panel { position: fixed; top: 160px; right: 30px; width: 250px; padding: 20px; z-index: 1000; border: 1px solid rgba(202, 244, 56, 0.3); border-radius: 20px; }
        .pref-item { display: flex; alignItems: center; gap: 10px; cursor: pointer; margin-bottom: 10px; font-size: 0.85rem; }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .calculos-container-wrapper { display: block !important; }
          .main-scroll-content { width: 100% !important; padding: 0 !important; }
          .glass { border: none !important; background: none !important; box-shadow: none !important; backdrop-filter: none !important; }
          .results-section-card { page-break-inside: avoid; }
          .section-title h3 { color: #000 !important; border-bottom: 2px solid #000; }
        }
      `}</style>
    </div>
  );
};

export default CalculosPage;
