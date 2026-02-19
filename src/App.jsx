import React, { useState, useMemo } from 'react';
import Layout from './presentation/componentes/Layout';
import HomePage from './presentation/paginas/HomePage';
import CalculosPage from './presentation/paginas/CalculosPage';
import { ServiciosEstadistica } from './application/implementaciones/ServiciosEstadistica';
import { LocalDatosRepository } from './infrastructure/implementaciones/LocalDatosRepository';
import './presentation/estilos/global.css';

const App = () => {
  const [step, setStep] = useState('home'); // 'home', 'calculos'
  const [modo, setModo] = useState(null); // 'manual', 'random'
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  // Inyección de dependencias
  const servicios = useMemo(() => {
    const repository = new LocalDatosRepository();
    return new ServiciosEstadistica(repository);
  }, []);

  const handleOptionSelect = (selectedModo) => {
    setModo(selectedModo);
    setStep('calculos');
    
    if (selectedModo === 'random') {
      const res = servicios.generarYProcesarAleatorios();
      setResultados(res);
    }
  };

  const handleCalculateManual = (cadena) => {
    try {
      const res = servicios.procesarCadena(cadena);
      setResultados(res);
      setError(null);
    } catch (e) {
      alert(e.message);
      setError(e.message);
    }
  };

  const handleClear = () => {
    servicios.limpiar();
    setStep('home');
    setModo(null);
    setResultados(null);
    setError(null);
  };

  return (
    <Layout>
      {step === 'home' ? (
        <HomePage onOptionSelect={handleOptionSelect} />
      ) : (
        <CalculosPage 
          modo={modo}
          resultados={resultados}
          onCalculate={handleCalculateManual}
          onRandom={() => handleOptionSelect('random')}
          onClear={handleClear}
        />
      )}
    </Layout>
  );
};

export default App;