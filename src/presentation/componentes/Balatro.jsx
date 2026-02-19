import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const Balatro = ({
  color1 = "#DE443B",
  color2 = "#006BB4",
  color3 = "#162325",
  mouseInteraction = true,
  pixelFilter = 745,
  isRotate = false
}) => {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    };

    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const c3 = hexToRgb(color3);

    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0, 1);
        }
      `,
      fragment: `
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          p.x *= uResolution.x / uResolution.y;
          
          float time = uTime * 0.2;
          
          vec3 col = uColor3;
          
          for(float i=1.0; i<4.0; i++) {
            p.x += 0.3 / i * sin(i * 3.0 * p.y + time);
            p.y += 0.3 / i * cos(i * 3.0 * p.x + time);
          }
          
          float f = 0.5 + 0.5 * sin(p.x + p.y);
          col = mix(uColor1, uColor2, f);
          col = mix(col, uColor3, 0.5 + 0.5 * cos(p.x - p.y));
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [0, 0] },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uColor3: { value: c3 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
    };

    window.addEventListener('resize', resize);
    resize();

    let request;
    const update = (time) => {
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
      request = requestAnimationFrame(update);
    };

    request = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(request);
      window.removeEventListener('resize', resize);
      if (containerRef.current) {
        containerRef.current.removeChild(gl.canvas);
      }
    };
  }, [color1, color2, color3]);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default Balatro;