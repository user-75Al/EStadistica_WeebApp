import React from 'react';
import Balatro from './Balatro';
import '../estilos/App.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Balatro 
        color1="#DE443B"
        color2="#006BB4"
        color3="#162325"
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;