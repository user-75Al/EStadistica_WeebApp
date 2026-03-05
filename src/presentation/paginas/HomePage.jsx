import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VscArchive, VscSettingsGear, VscChevronUp, VscHistory } from 'react-icons/vsc';
import BlurText from '../componentes/BlurText';
import StartButton from '../componentes/StartButton';
import Dock from '../componentes/Dock';

const HomePage = ({ onOptionSelect, historial = [], onCargarHistorial }) => {
  const dockItems = [
    { 
      icon: <VscArchive size={24} />, 
      label: 'Entrada Manual', 
      onClick: () => onOptionSelect('manual') 
    },
    { 
      icon: <VscSettingsGear size={24} />, 
      label: 'Datos Aleatorios', 
      onClick: () => onOptionSelect('random') 
    },
  ];

  const imagenesConceptos = [
    process.env.PUBLIC_URL + "/assets/img1.png",
    process.env.PUBLIC_URL + "/assets/img2.png",
    process.env.PUBLIC_URL + "/assets/img3.png",
    process.env.PUBLIC_URL + "/assets/img4.png",
    process.env.PUBLIC_URL + "/assets/img5.png"
  ];

  const imagenIntercalada = process.env.PUBLIC_URL + "/assets/img_intercalada.png";

  const listaFinal = [];
  imagenesConceptos.forEach((img, index) => {
    listaFinal.push({ src: img, type: 'full' });
    if (index < imagenesConceptos.length - 1) {
      listaFinal.push({ src: imagenIntercalada, type: 'divider' });
    }
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container" style={{ width: '100vw', overflowX: 'hidden', margin: 0, padding: 0, background: 'transparent' }}>
      
      {/* SECCIÓN PRINCIPAL (HERO) */}
      <section id="top" style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'transparent', padding: '100px 20px' }}>
        <div style={{ zIndex: 2, maxWidth: '800px', width: '100%' }}>
          <BlurText
            text="Calculadora Estadística"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-title"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)', color: 'var(--color-gray)', margin: '1rem 0 2rem' }}
          >
            Selecciona un método para comenzar el análisis profesional.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}
          >
            <Dock 
              items={dockItems}
              panelHeight={window.innerWidth < 768 ? 70 : 90}
              baseItemSize={window.innerWidth < 768 ? 55 : 75}
              magnification={window.innerWidth < 768 ? 90 : 110}
            />
          </motion.div>

          {historial.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="recent-history glass"
              style={{
                marginTop: '2rem',
                padding: '20px',
                borderRadius: '20px',
                textAlign: 'left',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)',
                width: '100%',
                maxWidth: '600px',
                margin: '2rem auto 0'
              }}
            >
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-lime)', marginBottom: '15px', fontSize: '1rem', fontWeight: 'bold' }}>
                <VscHistory /> ANÁLISIS RECIENTES
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {historial.map((datos, index) => (
                  <div 
                    key={index} 
                    onClick={() => onCargarHistorial(datos)}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: '0.2s',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(202, 244, 56, 0.1)';
                      e.currentTarget.style.borderColor = 'var(--color-lime)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Muestra #{historial.length - index}</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--color-sky)', fontSize: '0.9rem' }}>
                      {Array.isArray(datos) ? datos.slice(0, 4).join(', ') : ''}...
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>({datos.length} datos)</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* SECCIONES DE IMÁGENES INTERCALADAS - FULL WIDTH RESPONSIVE */}
      <div className="conceptos-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', background: '#000000', lineHeight: 0 }}>
        {listaFinal.map((item, idx) => (
          <section 
            key={idx}
            style={{ 
              width: '100vw', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: 0,
              padding: 0,
              background: '#000000',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.img 
              src={item.src} 
              alt={`Imagen Concepto ${idx + 1}`} 
              className="concepto-imagen-fluida"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              style={{ 
                width: '100%', 
                height: item.type === 'divider' ? 'clamp(120px, 20vh, 250px)' : 'auto',
                display: 'block', 
                objectFit: 'cover',
                margin: 0,
                padding: 0,
                filter: 'brightness(0.9)'
              }} 
            />

            {/* BOTÓN VOLVER ARRIBA */}
            {idx === listaFinal.length - 1 && (
              <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  padding: '0.8rem 1.5rem',
                  background: 'var(--color-lime)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  zIndex: 20,
                  fontSize: '0.9rem'
                }}
              >
                <VscChevronUp size={20} />
                VOLVER AL INICIO
              </motion.button>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
