import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
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
import './presentation/estilos/global.css';

const AppContent = () => {
  const [modo, setModo] = useState(null);
  const [resultadosA, setResultadosA] = useState(null);
  const [resultadosB, setResultadosB] = useState(null);
  const [comparar, setComparar] = useState(false);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const repository = useMemo(() => new LocalDatosRepository(), []);
  const servicios = useMemo(() => new ServiciosEstadistica(repository), [repository]);

  useEffect(() => {
    const storedHistorial = JSON.parse(localStorage.getItem('historial_estadistica') || '[]');
    setHistorial(storedHistorial);
  }, []);

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
      } else {
        setResultadosB(res);
        setComparar(true);
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

  const handleCargarHistorial = (datos) => {
    try {
      const res = servicios.obtenerResultados({ getDatos: () => datos });
      setResultadosA(res);
      setResultadosB(null);
      setComparar(false);
      setModo('manual');
      toast.success('Análisis recuperado del historial');
      navigate('/calculos');
    } catch (e) {
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
    toast('Sesión reiniciada', { icon: '🧹' });
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
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1000 }}>
        <PillNav 
          logo="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Abacus.png"
          items={navItems}
          activeHref={location.pathname}
          baseColor="#fff"
          pillColor="#060010"
          hoveredPillTextColor="#caf438"
        />
      </div>

      <Routes>
        <Route path="/" element={<HomePage onOptionSelect={handleOptionSelect} historial={historial} onCargarHistorial={handleCargarHistorial} />} />
        <Route path="/calculos" element={
          <CalculosPage 
            modo={modo}
            resultadosA={resultadosA}
            resultadosB={resultadosB}
            comparar={comparar}
            error={error}
            onCalculate={(cadena, target) => handleCalculateManual(cadena, target)}
            onClearError={() => setError(null)}
            onRandom={(target) => handleOptionSelect('random', target)}
            onClear={handleClear}
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
