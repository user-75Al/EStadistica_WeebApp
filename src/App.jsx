import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './presentation/componentes/Layout';
import HomePage from './presentation/paginas/HomePage';
import CalculosPage from './presentation/paginas/CalculosPage';
import ConjuntosPage from './presentation/paginas/ConjuntosPage';
import ArbolPage from './presentation/paginas/ArbolPage';
import PermutacionesPage from './presentation/paginas/PermutacionesPage';
import PillNav from './presentation/componentes/PillNav';
import { ServiciosEstadistica } from './application/implementaciones/ServiciosEstadistica';
import { LocalDatosRepository } from './infrastructure/implementaciones/LocalDatosRepository';
import './presentation/estilos/global.css';

const AppContent = () => {
  const [modo, setModo] = useState(null);
  const [resultados, setResultados] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Inyección de dependencias
  const servicios = useMemo(() => {
    const repository = new LocalDatosRepository();
    return new ServiciosEstadistica(repository);
  }, []);

  const handleOptionSelect = (selectedModo) => {
    setModo(selectedModo);
    if (selectedModo === 'random') {
      const res = servicios.generarYProcesarAleatorios();
      setResultados(res);
    }
    navigate('/calculos');
  };

  const handleCalculateManual = (cadena) => {
    try {
      const res = servicios.procesarCadena(cadena);
      setResultados(res);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleClear = () => {
    servicios.limpiar();
    setModo(null);
    setResultados(null);
    navigate('/');
  };

  const navItems = [
    { label: 'Conjuntos', href: '/conjuntos' },
    { label: 'Árbol', href: '/arbol' },
    { label: 'Permutaciones', href: '/permutaciones' },
    { label: 'Home', href: '/' },
    { label: 'Limpiar', href: '#', onClick: handleClear }
  ];

  return (
    <Layout>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1000 }}>
        <PillNav 
          logo="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Abacus.png"
          items={navItems}
          activeHref={location.pathname}
          baseColor="#fff"
          pillColor="#060010"
          hoveredPillTextColor="#060010"
        />
      </div>

      <Routes>
        <Route path="/" element={<HomePage onOptionSelect={handleOptionSelect} />} />
        <Route path="/calculos" element={
          <CalculosPage 
            modo={modo}
            resultados={resultados}
            onCalculate={handleCalculateManual}
            onRandom={() => handleOptionSelect('random')}
            onClear={handleClear}
          />
        } />
        <Route path="/conjuntos" element={<ConjuntosPage />} />
        <Route path="/arbol" element={<ArbolPage />} />
        <Route path="/permutaciones" element={<PermutacionesPage />} />
      </Routes>
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