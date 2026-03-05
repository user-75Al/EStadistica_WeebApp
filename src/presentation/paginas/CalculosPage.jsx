import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { VscDiffAdded, VscArrowLeft, VscFilePdf, VscMail, VscScreenFull, VscEyeClosed, VscSettings, VscReport, VscChevronUp, VscListSelection } from 'react-icons/vsc';
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
  modo, resultadosA, resultadosB, comparar, error, onCalculate, onClearError, onRandom, onClear,
  isFullscreen, onToggleFullscreen, showSidebar, onToggleSidebar
}) => {
  const chartsContainerRef = useRef(null);
  const { preferences, toggleChart } = usePreferences();
  const [showPrefs, setShowPrefs] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [imagenes, setImagenes] = useState({ a: [], b: [] });
  const [pdfPreparado, setPdfPreparado] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showInputB, setShowInputB] = useState(false);
  const [showInputA, setShowInputA] = useState(modo === 'manual');
  const [probabilidadResult, setProbabilidadResult] = useState(null);
  const [horaAnalisis, setHoraAnalisis] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excelExporter = useMemo(() => new ExportadorExcel(), []);

  const secciones = [
    { id: 'estadisticos', label: 'Estadísticos', icon: '📊' },
    { id: 'probabilidad', label: 'Probabilidad', icon: '🎯' },
    { id: 'tabla', label: 'Tablas', icon: '📋' },
    { id: 'tallo-hoja', label: 'Distribución', icon: '🌿' },
    { id: 'graficos', label: 'Gráficos', icon: '📈' },
    { id: 'boxplot', label: 'Boxplot', icon: '📦' },
    { id: 'interpretacion', label: 'Análisis', icon: '💡' }
  ];

  const revealVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      scale: 0.95,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        type: 'spring',
        stiffness: 50,
        damping: 20,
        duration: 0.8 
      } 
    }
  };

  useEffect(() => {
    if (resultadosA || resultadosB) {
      setHoraAnalisis(new Date().toLocaleTimeString());
      setProbabilidadResult(null);
    }
  }, [resultadosA, resultadosB]);

  useEffect(() => {
    if (modo === 'manual' && !resultadosA) {
      setShowInputA(true);
    }
  }, [modo, resultadosA]);

  useEffect(() => {
    setImagenes({ a: [], b: [] });
    setPdfPreparado(false);
  }, [probabilidadResult, resultadosA, resultadosB, comparar]);

  const capturarGrafico = async (elemento, intentos = 3) => {
    console.log(`[PDF] Iniciando captura de elemento:`, elemento);
    for (let i = 0; i < intentos; i++) {
      try {
        if (!elemento) throw new Error('Elemento nulo');
        const canvas = elemento.querySelector('canvas');
        if (!canvas) throw new Error('No hay canvas');
        
        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`[PDF] Intento ${i + 1}: Canvas sin dimensiones, esperando...`);
          await new Promise(resolve => setTimeout(resolve, 300));
          continue;
        }

        const ctx = canvas.getContext('2d');
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const hasContent = pixels.some(channel => channel !== 0);
        
        if (!hasContent) {
          console.warn(`[PDF] Intento ${i + 1}: Canvas vacío (sin píxeles), esperando...`);
          await new Promise(resolve => setTimeout(resolve, 400));
          continue;
        }
        
        const dataUrlOriginal = canvas.toDataURL('image/png');
        if (dataUrlOriginal && dataUrlOriginal.length > 1000) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          tempCtx.fillStyle = '#162325';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(canvas, 0, 0);
          
          const dataUrl = tempCanvas.toDataURL('image/png');
          console.log(`[PDF] Captura exitosa con fondo. Tamaño: ${dataUrl.length} caracteres.`);
          return dataUrl;
        }
      } catch (error) {
        console.warn(`[PDF] Intento ${i + 1} de captura fallido:`, error);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return null;
  };

  const prepararPDF = async () => {
    setGenerando(true);
    setPdfPreparado(false);
    const tid = toast.loading('Capturando gráficas en alta resolución...');
    try {
      if (!chartsContainerRef.current) throw new Error('Contenedor de gráficas no encontrado');
      
      let targets;
      if (comparar) {
        targets = Array.from(chartsContainerRef.current.querySelectorAll('.sample-column-target'));
      } else {
        targets = [chartsContainerRef.current];
      }

      console.log(`[PDF] Targets encontrados: ${targets.length}`);
      if (targets.length === 0) throw new Error('No se encontraron los contenedores de gráficas');
      
      const capsA = [];
      const boxesA = targets[0]?.querySelectorAll('.chart-box') || [];
      for (const box of Array.from(boxesA)) {
        const img = await capturarGrafico(box);
        capsA.push(img);
      }

      const capsB = [];
      if (comparar && targets[1]) {
        const boxesB = targets[1].querySelectorAll('.chart-box') || [];
        for (const box of Array.from(boxesB)) {
          const img = await capturarGrafico(box);
          capsB.push(img);
        }
      }

      console.log(`[PDF] Capturas finalizadas. A: ${capsA.filter(c => c).length}, B: ${capsB.filter(c => c).length}`);

      if (capsA.length === 0 || capsA.every(img => img === null)) {
        throw new Error('No se pudieron capturar las gráficas de la muestra A');
      }

      setImagenes({ a: capsA, b: capsB });
      setPdfPreparado(true);
      toast.success('Reporte preparado correctamente', { id: tid });
    } catch (e) {
      console.error("[PDF] Error al preparar PDF:", e);
      toast.error(e.message || 'Error al capturar las gráficas', { id: tid });
      setPdfPreparado(false);
    } finally {
      setGenerando(false);
    }
  };

  const manejarEnvioCorreo = async (e) => {
    e.preventDefault();
    if (!pdfPreparado) {
      toast.error('Primero debes preparar el PDF');
      return;
    }
    setEnviandoEmail(true);
    const tid = toast.loading('Enviando...');
    try {
      const doc = <ReportePDF 
        datosA={resultadosA.datosOriginales} estadisticosA={resultadosA.estadisticos} 
        frecuenciasA={resultadosA.frecuencias} graficosImgsA={imagenes.a} 
        datosB={resultadosB?.datosOriginales || []} estadisticosB={resultadosB?.estadisticos || {}} 
        frecuenciasB={resultadosB?.frecuencias || []} graficosImgsB={imagenes.b} 
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
      let targets;
      if (comparar) {
        targets = Array.from(chartsContainerRef.current.querySelectorAll('.sample-column-target'));
      } else {
        targets = [chartsContainerRef.current];
      }
      
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
    return (
      <div className="calculos-container-wrapper initial-entry" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1500,
        background: 'var(--color-bg)'
      }}>
        <AnimatePresence mode="wait">
          {showInputA ? (
            <motion.div 
              key="input-form-a"
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="overlay-content glass" 
              style={{ 
                maxWidth: '700px', 
                width: '90%', 
                padding: '3rem', 
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-lime)', letterSpacing: '2px', fontWeight: '900' }}>📊 INGRESO DE DATOS - MUESTRA A</h3>
                <button className="close-btn" onClick={() => { setShowInputA(false); onClear(); }}>×</button>
              </div>
              <InputForm 
                onCalculate={(v) => {
                  onCalculate(v, 'A');
                  setShowInputA(false);
                }} 
                onRandom={() => onRandom('A')} 
                error={error} 
                onClearError={onClearError} 
              />
            </motion.div>
          ) : (
            <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState 
                onManual={() => setShowInputA(true)} 
                onRandom={() => onRandom('A')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`calculos-container-wrapper ${isFullscreen ? 'presentation-active' : ''} ${!showSidebar ? 'sidebar-hidden' : ''}`}>
      
      {!isFullscreen && (
        <button 
          className="toggle-sidebar-btn" 
          onClick={onToggleSidebar}
          style={{
            position: 'fixed',
            bottom: '120px',
            left: showSidebar ? '260px' : '20px',
            zIndex: 2000,
            background: showSidebar ? 'rgba(6, 0, 16, 0.8)' : 'var(--color-lime)',
            border: '1px solid var(--color-lime)',
            color: showSidebar ? 'var(--color-lime)' : '#000',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s ease',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
          title={showSidebar ? "Ocultar Índice" : "Mostrar Índice"}
        >
          {showSidebar ? <VscArrowLeft size={20}/> : <VscListSelection size={20}/>}
        </button>
      )}

      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="scroll-top-btn" 
            onClick={scrollToTop}
            title="Volver arriba"
          >
            <VscChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

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

      {!isFullscreen && showSidebar && (
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

      <div className="main-scroll-content" style={{ 
        width: (!isFullscreen && showSidebar) ? 'calc(100% - 300px)' : '100%',
        padding: (!isFullscreen && showSidebar) ? '0 5% 3rem' : '0 10% 3rem',
        flex: '1',
        transition: 'all 0.4s ease'
      }} ref={chartsContainerRef}>
        <header className="results-header-new glass">
          <div className="header-info">
            <h2>Análisis de Datos <span style={{fontSize:'0.8rem', color:'#888', fontWeight:'normal'}}>({horaAnalisis})</span></h2>
            <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
              <span className="sample-tag">A: {resultadosA.datosOriginales.length} datos</span>
              {resultadosB && <span className="sample-tag sample-b">B: {resultadosB.datosOriginales.length} datos</span>}
            </div>
          </div>
          
          <div className="header-actions no-print">
            <div className="action-toolbar glass">
              <button className="toolbar-btn" onClick={onToggleFullscreen} title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                {isFullscreen ? <><VscEyeClosed/> SALIR</> : <><VscScreenFull/> PANTALLA COMPLETA</>}
              </button>
              
              <div className="toolbar-divider" />
              
              <button className="toolbar-btn" onClick={() => setShowEmailModal(true)} title="Enviar por correo">
                <VscMail /> <span>ENVIAR</span>
              </button>

              {!resultadosB && !showInputB && (
                <button className="toolbar-btn compare-btn" onClick={() => setShowInputB(true)} title="Comparar con otra muestra">
                  <VscDiffAdded/> <span>COMPARAR</span>
                </button>
              )}

              <button className="toolbar-btn excel-btn" onClick={manejarExportarExcel} disabled={exportandoExcel} title="Exportar a Excel">
                {exportandoExcel ? <Spinner size="14px"/> : <><span style={{color: '#217346'}}>📊</span> EXCEL</>}
              </button>

              {pdfPreparado ? (
                <PDFDownloadLink 
                  document={<ReportePDF datosA={resultadosA.datosOriginales} estadisticosA={resultadosA.estadisticos} frecuenciasA={resultadosA.frecuencias} graficosImgsA={imagenes.a} datosB={resultadosB?.datosOriginales || []} estadisticosB={resultadosB?.estadisticos || {}} frecuenciasB={resultadosB?.frecuencias || []} graficosImgsB={imagenes.b} comparar={comparar} probabilidadA={probabilidadResult} />} 
                  fileName="reporte.pdf"
                >
                  {({ loading }) => (
                    <button className="toolbar-btn pdf-btn" disabled={loading} title="Descargar PDF">
                      {loading ? <Spinner size="14px"/> : <><VscFilePdf style={{color: '#ff4d4d'}}/> PDF</>}
                    </button>
                  )}
                </PDFDownloadLink>
              ) : (
                <button className="toolbar-btn pdf-btn-prep" onClick={prepararPDF} disabled={generando} title="Preparar reporte PDF">
                  {generando ? <Spinner size="14px"/> : <><VscFilePdf/> PREPARAR</>}
                </button>
              )}
            </div>
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
              <div className="section-title centered"><h3>💡 IA INSIGHTS & ANÁLISIS</h3></div>
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
            <motion.section id="probabilidad" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true, amount: 0.3}}>
              <div className="section-title centered"><h3>🎯 ANÁLISIS DE PROBABILIDAD</h3></div>
              <div className="zoom-container" style={{ maxWidth: '800px' }}>
                <Probabilidad datos={resultadosA.datosOriginales} onResultadoChange={setProbabilidadResult} />
              </div>
            </motion.section>
            <motion.section id="tabla" className="results-section-card" initial="hidden" whileInView="visible" variants={revealVariants} viewport={{once:true}}>
              <div className="section-title centered"><h3>📋 TABLA DE DISTRIBUCIÓN</h3></div>
              <div className="zoom-container narrow-table-container">
                <TablaFrecuencias frecuencias={resultadosA.frecuencias} hoverIndex={hoverIndex} />
              </div>
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
              <div className="section-title centered"><h3>💡 IA INSIGHTS & ANÁLISIS</h3></div>
              <div className="zoom-container">
                <ExplicacionProcedimiento resultados={resultadosA} />
              </div>
            </motion.section>
          </div>
        )}
      </div>

      <style>{`
        .calculos-container-wrapper { display: flex; background: var(--color-bg); min-height: 100vh; width: 100%; transition: all 0.5s ease; }
        .sidebar-hidden .sticky-sidebar { display: none !important; }
        
        .sticky-sidebar { width: 300px; height: 100vh; position: sticky; top: 0; padding: 3rem 1.5rem; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; z-index: 100; transition: transform 0.4s ease; }
        .sidebar-header h3 { font-size: 1.6rem; letter-spacing: 3px; color: var(--color-lime); font-weight: 900; }
        .sidebar-menu li { padding: 18px 25px; border-radius: 15px; cursor: pointer; color: #888; display: flex; align-items: center; gap: 15px; transition: 0.3s; font-weight: bold; font-size: 1rem; margin-bottom: 12px; }
        .sidebar-menu li:hover { background: rgba(202, 244, 56, 0.15); color: var(--color-lime); transform: translateX(12px); }
        
        .main-scroll-content { flex: 1; transition: all 0.4s ease; }
        .results-header-new { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 1.5rem 3.5rem; 
          border-radius: 30px; 
          margin-top: 4rem;
          margin-bottom: 6rem; 
          background: rgba(6, 0, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .scroll-top-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: var(--color-lime);
          color: #000;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
          z-index: 1000;
          transition: 0.3s;
        }
        .scroll-top-btn:hover { transform: translateY(-5px); background: #fff; }
        
        .results-section-card { 
          margin-bottom: 8rem; 
          padding: 2rem;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        
        .zoom-container { max-width: 1250px; margin: 0 auto; width: 100%; }
        .narrow-table-container { max-width: 850px !important; }
        .dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; width: 100%; }
        .section-title h3 { font-size: 2.2rem; color: var(--color-lime); margin-bottom: 4rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 900; text-align: center; }
        
        /* Toolbar Styles */
        .action-toolbar { display: flex; align-items: center; gap: 8px; padding: 8px 15px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); background: rgba(22, 35, 37, 0.6); }
        .toolbar-btn { background: transparent; border: none; color: #fff; padding: 10px 15px; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.85rem; transition: 0.2s; white-space: nowrap; }
        .toolbar-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: var(--color-lime); }
        
        @media (max-width: 1024px) {
          .action-toolbar { border-radius: 20px; flex-wrap: wrap; justify-content: center; }
          .results-header-new { padding: 1.5rem; flex-direction: column; gap: 1.5rem; text-align: center; }
        }

        .back-home-btn { background: rgba(222,68,59,0.1); border: 1px solid var(--color-red); color: var(--color-red); padding: 18px; border-radius: 15px; font-weight: 900; margin-top: auto; }
        
        @media print {
          .no-print { display: none !important; }
          .calculos-container-wrapper { display: block !important; }
          .main-scroll-content { width: 100% !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default CalculosPage;
