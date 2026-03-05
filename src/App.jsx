import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './presentation/componentes/Layout';
import HomePage from './presentation/paginas/HomePage';
import CalculosPage from './presentation/paginas/CalculosPage';
import ConjuntosPage from './presentation/paginas/ConjuntosPage';
import ArbolPage from './presentation/paginas/ArbolPage';
import PermutacionesPage from './presentation/paginas/PermutacionesPage';
import DistribucionesPage from './presentation/paginas/DistribucionesPage';
import RegresionPage from './presentation/paginas/RegresionPage';
import PillNav from './presentation/componentes/PillNav';
import ClearButton from './presentation/componentes/ClearButton';
import { ServiciosEstadistica } from './application/implementaciones/ServiciosEstadistica';
import { LocalDatosRepository } from './infrastructure/implementaciones/LocalDatosRepository';
import { Datos } from './core/entidades/Datos';
import './presentation/estilos/global.css';

const AppContent = () => {
  const [modo, setModo] = useState(null);
  const [resultadosA, setResultadosA] = useState(null);
  const [resultadosB, setResultadosB] = useState(null);
  const [comparar, setComparar] = useState(false);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMainDock, setShowMainDock] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const repository = useMemo(() => new LocalDatosRepository(), []);
  const servicios = useMemo(() => new ServiciosEstadistica(repository), [repository]);

  useEffect(() => {
    const storedHistorial = JSON.parse(localStorage.getItem('historial_estadistica') || '[]');
    setHistorial(storedHistorial);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`Error al activar pantalla completa: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const actualizarHistorial = (datos) => {
    const nuevoHistorial = [
      datos,
      ...historial.filter(h => JSON.stringify(h) !== JSON.stringify(datos))
    ].slice(0, 5);
    setHistorial(nuevoHistorial);
    localStorage.setItem('historial_estadistica', JSON.stringify(nuevoHistorial));
  };

  const handleOptionSelect = (selectedModo, target = 'A') => {
    setModo(selectedModo);
    setError(null);
    if (selectedModo === 'random') {
      const res = servicios.generarYProcesarAleatorios();
      if (target === 'A') {
        setResultadosA(res);
        setResultadosB(null);
        setComparar(false);
        actualizarHistorial(res.datosOriginales);
      } else {
        setResultadosB(res);
        setComparar(true);
        actualizarHistorial(res.datosOriginales);
      }
      toast.success(`Datos aleatorios generados (Muestra ${target})`);
    }
    navigate('/calculos');
  };

  const handleCalculateManual = (cadena, target = 'A') => {
    try {
      setError(null);
      const res = servicios.procesarCadena(cadena);
      if (target === 'A') {
        setResultadosA(res);
        setComparar(false);
      } else {
        setResultadosB(res);
        setComparar(true);
      }
      actualizarHistorial(res.datosOriginales);
      toast.success(`¡Muestra ${target} procesada con éxito!`);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
  };

  const handleCargarHistorial = (datosArray) => {
    try {
      setModo('manual');
      const datosEntidad = new Datos(datosArray);
      const res = servicios.obtenerResultados(datosEntidad);
      setResultadosA(res);
      setResultadosB(null);
      setComparar(false);
      toast.success('Análisis cargado desde el historial');
      navigate('/calculos');
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar historial");
    }
  };

  const handleClear = () => {
    repository.clear();
    setModo(null);
    setResultadosA(null);
    setResultadosB(null);
    setComparar(false);
    setError(null);
    toast('Campos limpiados', { icon: '🧹' });
    navigate('/');
  };

  const navItems = [
    { label: 'Regresión', href: '/regresion' },
    { label: 'Distribuciones', href: '/distribuciones' },
    { label: 'Cálculos', href: '/calculos' },
    { label: 'Conjuntos', href: '/conjuntos' },
    { label: 'Árbol', href: '/arbol' },
    { label: 'Permutaciones', href: '/permutaciones' },
    { label: 'Home', href: '/' }
  ];

  const showClearButton = location.pathname !== '/';

  // Centrado inteligente: si hay sidebar (300px), el dock debe centrarse en el resto del espacio
  const hasSidebar = location.pathname === '/calculos' && showSidebar && !isFullscreen;
  
  const dockWrapperStyle = {
    width: isFullscreen ? '100%' : 'calc(100% - ' + (hasSidebar ? '300px' : '0px') + ')',
    marginLeft: hasSidebar ? '300px' : '0',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '25px 0',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: showMainDock ? 'translateY(0)' : 'translateY(-150%)',
    opacity: showMainDock ? 1 : 0,
    position: 'relative'
  };

  const abacusUrl = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Abacus.png";

  return (
    <Layout>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#162325',
            color: '#fff',
            border: '1px solid var(--color-lime)',
          },
        }}
      />

      <AnimatePresence>
        {!showMainDock && !isFullscreen && (
          <motion.div 
            key="abacus-toggle-btn"
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            onClick={() => setShowMainDock(true)}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              zIndex: 2000,
              cursor: 'pointer',
              width: '65px',
              height: '65px',
              background: 'rgba(6, 0, 16, 0.85)',
              border: '1px solid var(--color-lime)',
              borderRadius: '22px',
              padding: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Mostrar menú de navegación"
          >
            <img src={abacusUrl} alt="Abrir" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isFullscreen && (
        <div style={dockWrapperStyle}>
          <PillNav 
            logo={abacusUrl}
            items={navItems}
            activeHref={location.pathname}
            baseColor="#fff"
            pillColor="#060010"
            hoveredPillTextColor="#caf438"
            onLogoClick={() => setShowMainDock(false)}
          />
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage onOptionSelect={handleOptionSelect} historial={historial} onCargarHistorial={handleCargarHistorial} />} />
        <Route path="/calculos" element={
          <CalculosPage 
            modo={modo}
            resultadosA={resultadosA}
            resultadosB={resultadosB}
            comparar={comparar}
            error={error}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onCalculate={(cadena, target) => handleCalculateManual(cadena, target)}
            onClearError={() => setError(null)}
            onRandom={(target) => handleOptionSelect('random', target)}
            onClear={handleClear}
            showSidebar={showSidebar}
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
          />
        } />
        <Route path="/regresion" element={<RegresionPage />} />
        <Route path="/distribuciones" element={<DistribucionesPage />} />
        <Route path="/conjuntos" element={<ConjuntosPage />} />
        <Route path="/arbol" element={<ArbolPage />} />
        <Route path="/permutaciones" element={<PermutacionesPage />} />
      </Routes>

      {showClearButton && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <ClearButton onClick={handleClear} />
        </div>
      )}
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
