import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BlurText from '../componentes/BlurText';
import StartButton from '../componentes/StartButton';
import Dock from '../componentes/Dock';
import { VscArchive, VscSettingsGear } from 'react-icons/vsc';

const HomePage = ({ onOptionSelect }) => {
  const [showDock, setShowDock] = useState(false);

  const dockItems = [
    { 
      icon: <VscArchive size={24} />, 
      label: 'Ingresar cadena', 
      onClick: () => onOptionSelect('manual') 
    },
    { 
      icon: <VscSettingsGear size={24} />, 
      label: 'Generar aleatorios', 
      onClick: () => onOptionSelect('random') 
    },
  ];

  return (
    <div className="home-page" style={{ height: 'auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 20px 40px' }}>
      
      {/* Sección Educativa (NUEVA) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ 
          maxWidth: '900px', 
          width: '100%',
          marginBottom: '4rem',
          padding: '2.5rem',
          background: 'rgba(22, 35, 37, 0.4)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          textAlign: 'left'
        }}
      >
        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--color-lime)', fontWeight: '800' }}>Conceptos básicos de estadística</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', color: 'var(--color-white)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <div>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Población vs Muestra:</strong> La población es el conjunto total de elementos; la muestra es un subconjunto representativo.</p>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Media:</strong> Promedio de todos los valores.</p>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Mediana:</strong> Valor central cuando los datos están ordenados.</p>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Moda:</strong> Valor(es) que más se repiten.</p>
          </div>
          <div>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Mínimo y Máximo:</strong> Valor más pequeño y más grande.</p>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Rango:</strong> Diferencia entre máximo y mínimo.</p>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Frecuencias:</strong> Cuántas veces aparece cada valor.</p>
            <p style={{ marginBottom: '0.8rem' }}><strong style={{ color: 'var(--color-sky)' }}>Gráficos:</strong> Histograma, polígono, ojiva, Pareto.</p>
          </div>
        </div>
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'var(--color-gray)', fontSize: '1rem', fontStyle: 'italic' }}>
            "Esta calculadora te permite ingresar datos numéricos y obtener automáticamente todos estos estadísticos, tablas de frecuencias, gráficos y operaciones avanzadas como probabilidad, conjuntos, permutaciones y diagramas de árbol."
          </p>
        </div>
      </motion.div>

      {/* Contenido Original Rediseñado */}
      <div className="center-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BlurText
          text="Calculadora de variables"
          delay={200}
          animateBy="words"
          direction="top"
          className="text-title"
        />
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ fontSize: '1.4rem', color: 'var(--color-gray)', margin: '1rem 0 2rem' }}
        >
          ¿Desea ingresar sus valores?
        </motion.p>

        {!showDock && (
          <div className="start-btn-container" style={{ marginTop: '0' }}>
            <StartButton onClick={() => setShowDock(true)} />
          </div>
        )}
      </div>
      
      {showDock && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dock-container"
          style={{ position: 'relative', marginTop: '3rem', bottom: 'auto', transform: 'none' }}
        >
          <Dock 
            items={dockItems}
            panelHeight={68}
            baseItemSize={56}
            magnification={80}
          />
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
