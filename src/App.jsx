import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const repository = useMemo(() => new LocalDatosRepository(), []);
  const servicios = useMemo(() => new ServiciosEstadistica(repository), [repository]);

  useEffect(() => {
    const datosGuardados = repository.get();
    if (datosGuardados) {
      setResultados(servicios.obtenerResultados(datosGuardados));
      setModo('manual');
    }
  }, [repository, servicios]);

  const handleOptionSelect = (selectedModo) => {
    setModo(selectedModo);
    setError(null);
    if (selectedModo === 'random') {
      const res = servicios.generarYProcesarAleatorios();
      setResultados(res);
    }
    navigate('/calculos');
  };

  const handleCalculateManual = (cadena) => {
    try {
      setError(null);
      const res = servicios.procesarCadena(cadena);
      setResultados(res);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleClear = () => {
    repository.clear();
    setModo(null);
    setResultados(null);
    setError(null);
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
        <Route path="/" element={<HomePage onOptionSelect={handleOptionSelect} />} />
        <Route path="/calculos" element={
          <CalculosPage 
            modo={modo}
            resultados={resultados}
            error={error}
            onCalculate={handleCalculateManual}
            onClearError={() => setError(null)}
            onRandom={() => handleOptionSelect('random')}
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
