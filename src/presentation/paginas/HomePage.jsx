import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BlurText from '../componentes/BlurText';
import StartButton from '../componentes/StartButton';
import Dock from '../componentes/Dock';
import { VscArchive, VscSettingsGear, VscChevronUp } from 'react-icons/vsc';

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
      <section id="top" style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'transparent' }}>
        <div style={{ zIndex: 2, padding: '0 20px' }}>
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
            ¿Desea continuar?
          </motion.p>

          {!showDock ? (
            <div className="start-btn-container">
              <StartButton onClick={() => setShowDock(true)} />
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Dock 
                items={dockItems}
                panelHeight={window.innerWidth < 768 ? 60 : 80}
                baseItemSize={window.innerWidth < 768 ? 50 : 65}
                magnification={window.innerWidth < 768 ? 80 : 100}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* SECCIONES DE IMÁGENES INTERCALADAS - RESPONSIVO */}
      <div className="conceptos-scroll" style={{ position: 'relative', zIndex: 10, width: '100vw', background: '#000000' }}>
        {listaFinal.map((item, idx) => (
          <section 
            key={idx}
            style={{ 
              height: item.type === 'divider' ? 'auto' : 'auto', 
              minHeight: item.type === 'divider' ? '30vh' : '60vh',
              width: '100vw', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden',
              margin: 0,
              padding: item.type === 'divider' ? '2rem 0' : '0',
              background: '#000000',
              position: 'relative'
            }}
          >
            <motion.img 
              src={item.src} 
              alt={`Imagen ${idx + 1}`} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.2 }}
              style={{ 
                width: '100%', 
                height: 'auto', // Cambiado para que no se estire
                maxWidth: '100%',
                maxHeight: '100vh',
                display: 'block', 
                objectFit: 'contain', // Cambiado de cover a contain para móviles
                margin: 0,
                padding: 0
              }} 
            />

            {/* BOTÓN VOLVER ARRIBA */}
            {idx === listaFinal.length - 1 && (
              <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
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
