import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import * as THREE from 'three';
import heroImg from '../assets/hero-img.png';
import '../styles/Hero.css';

export default function HeroSection() {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Create offscreen canvas to sample the face image pixels ---
    const img = new Image();
    img.src = heroImg;

    let scene, camera, renderer, particles, geometry, material;
    let frameId;
    let originalPositions = [];

    img.onload = () => {
      // Setup Three.js scene components after image loaded to avoid flickering
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 21; // Fit the face particles nicely in viewport

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const w = 110;
      const h = 110;
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');
      offscreenCanvas.width = w;
      offscreenCanvas.height = h;

      // Draw and retrieve pixel attributes
      offscreenCtx.drawImage(img, 0, 0, w, h);
      const imgData = offscreenCtx.getImageData(0, 0, w, h).data;

      const positions = [];
      const colors = [];

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx] / 255;
          const g = imgData[idx + 1] / 255;
          const b = imgData[idx + 2] / 255;
          const a = imgData[idx + 3] / 255;

          // Process only non-transparent, non-pure-black face coordinates
          if (a > 0.15 && (r + g + b > 0.15)) {
            // Normalize and center positions
            const posX = (x - w / 2) * 0.22;
            const posY = -(y - h / 2) * 0.22; // Invert Y axis for WebGL coordinate space
            const posZ = (Math.random() - 0.5) * 1.2; // Tiny initial Z depth noise

            positions.push(posX, posY, posZ);
            colors.push(r, g, b);
            originalPositions.push(posX, posY, posZ);
          }
        }
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

      // Make point clouds feel elegant and soft
      material = new THREE.PointsMaterial({
        size: window.innerWidth <= 768 ? 0.12 : 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      });

      particles = new THREE.Points(geometry, material);
      
      // Center the face slightly and scale for mobile
      if (window.innerWidth <= 768) {
        particles.scale.set(0.8, 0.8, 0.8);
      }

      scene.add(particles);

      // --- Animation Loop ---
      const animate = () => {
        frameId = requestAnimationFrame(animate);

        // Slow hover rotation tracking cursor positioning
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

        if (particles) {
          particles.rotation.y = mouseRef.current.x * 0.45;
          particles.rotation.x = -mouseRef.current.y * 0.35;

          // Wave breathing/drifting effect for face particles
          const posAttribute = geometry.getAttribute('position');
          const posArr = posAttribute.array;
          const time = performance.now() * 0.0014;

          for (let i = 0; i < posArr.length; i += 3) {
            const origX = originalPositions[i];
            const origY = originalPositions[i + 1];
            const origZ = originalPositions[i + 2];

            // Wave motion along Z axis based on height and time
            posArr[i + 2] = origZ + Math.sin(time + origX * 0.4 + origY * 0.4) * 0.4;
            // Eased horizontal breathing drift
            posArr[i] = origX + Math.cos(time + origY * 0.35) * 0.08;
          }
          posAttribute.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    const handleMouseMove = (event) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Text Info */}
          <div className="hero-content">
            <p className="hero-tagline">Full-Stack Web Developer Intern</p>
            <h1 className="hero-title">
              <span>Creating digital</span>
              <span className="text-gradient">experiences that</span>
              <span>matter.</span>
            </h1>
            <p className="hero-desc">
              I am Sanduni Kaveesha Basnayaka, a computer science student specializing in building 
              responsive full-stack projects, interactive graphics, and creative web solutions.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary" 
                onClick={() => {
                  const el = document.getElementById('work');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore My Work <ArrowUpRight size={18} />
              </button>
              <button className="btn-secondary" onClick={scrollToAbout}>
                Get in Touch
              </button>
            </div>
          </div>

          {/* Right Column: Particle face canvas */}
          <div ref={containerRef} className="hero-canvas-container" />
        </div>
      </div>

      {/* Bouncing Scroll Cue */}
      <div className="scroll-indicator" onClick={scrollToAbout}>
        <span>Scroll Down</span>
        <ArrowDown size={18} />
      </div>
    </section>
  );
}
