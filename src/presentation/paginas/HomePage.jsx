import React, { useState } from 'react';
import BlurText from '../componentes/BlurText';
import StartButton from '../componentes/StartButton';
import Dock from '../componentes/Dock';
import { VscArchive, VscSettingsGear } from 'react-icons/vsc';

const HomePage = ({ onOptionSelect }) => {
  const [showDock, setShowDock] = useState(false);

  const items = [
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
    <div className="home-page">
      <div className="center-content">
        <BlurText
          text="Calculadora de variables"
          delay={200}
          animateBy="words"
          direction="top"
          className="text-title"
        />
        {!showDock && (
          <div className="start-btn-container">
            <StartButton onClick={() => setShowDock(true)} />
          </div>
        )}
      </div>
      
      {showDock && (
        <div className="dock-container">
          <Dock 
            items={items}
            panelHeight={68}
            baseItemSize={56}
            magnification={80}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;