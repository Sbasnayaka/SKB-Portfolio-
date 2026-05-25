import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import * as THREE from 'three';
import '../styles/Hero.css';
import profileImg from '../assets/hero-img.png';

export default function HeroSection() {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene, camera, renderer, particles, geometry, material;
    let lineSegments, lineGeometry, lineMaterial;
    let frameId;

    const particleCount = window.innerWidth <= 768 ? 80 : 160;
    const maxConnections = 400;
    
    // Bounds for particle drift
    const bounds = {
      x: 18,
      y: 12,
      z: 8
    };

    // Keep track of particle physics
    const particleData = [];
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Initial state
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * bounds.x * 1.8;
      const y = (Math.random() - 0.5) * bounds.y * 1.8;
      const z = (Math.random() - 0.5) * bounds.z * 1.8;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Velocities
      particleData.push({
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        vz: (Math.random() - 0.5) * 0.04
      });

      // Colors: Elegant purple nodes mixed with soft white
      const isPurple = Math.random() > 0.4;
      colors[i * 3] = isPurple ? 127/255 : 1.0;
      colors[i * 3 + 1] = isPurple ? 73/255 : 1.0;
      colors[i * 3 + 2] = isPurple ? 180/255 : 1.0;
    }

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic glowing circle canvas texture helper
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(127, 73, 180, 0.8)');
      gradient.addColorStop(1, 'rgba(127, 73, 180, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Particles setup
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
      size: window.innerWidth <= 768 ? 0.35 : 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: createCircleTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connection lines setup
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // --- Animation Loop ---
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Project mouse coordinate to world coordinates on the Z=0 plane
      const mouse3D = {
        x: mouseRef.current.x * 16,
        y: mouseRef.current.y * 10
      };

      const posAttribute = geometry.getAttribute('position');
      const posArr = posAttribute.array;

      // Physics logic
      for (let i = 0; i < particleCount; i++) {
        let px = posArr[i * 3];
        let py = posArr[i * 3 + 1];
        let pz = posArr[i * 3 + 2];
        const data = particleData[i];

        // Apply velocity drift
        px += data.vx;
        py += data.vy;
        pz += data.vz;

        // Mouse repulsion (flee physics)
        if (mouseRef.current.active) {
          const dx = px - mouse3D.x;
          const dy = py - mouse3D.y;
          const dz = pz - 0; // Mouse is in Z=0
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Flee if within 5.5 units range (Antigravity force field)
          if (dist < 5.5) {
            const force = (5.5 - dist) / 5.5;
            const repelStrength = 0.12;
            data.vx += (dx / dist) * force * repelStrength;
            data.vy += (dy / dist) * force * repelStrength;
            data.vz += (dz / dist) * force * repelStrength;
          }
        }

        // Apply drag to velocities so they don't fly off to infinity
        data.vx *= 0.92;
        data.vy *= 0.92;
        data.vz *= 0.92;

        // Ensure small baseline drift velocity
        const speed = Math.sqrt(data.vx * data.vx + data.vy * data.vy + data.vz * data.vz);
        if (speed < 0.012) {
          data.vx += (Math.random() - 0.5) * 0.003;
          data.vy += (Math.random() - 0.5) * 0.003;
          data.vz += (Math.random() - 0.5) * 0.003;
        }

        // Bounded boundaries check (bounce with energy preservation)
        if (Math.abs(px) > bounds.x) {
          data.vx *= -1;
          px = Math.sign(px) * bounds.x;
        }
        if (Math.abs(py) > bounds.y) {
          data.vy *= -1;
          py = Math.sign(py) * bounds.y;
        }
        if (Math.abs(pz) > bounds.z) {
          data.vz *= -1;
          pz = Math.sign(pz) * bounds.z;
        }

        // Write positions back
        posArr[i * 3] = px;
        posArr[i * 3 + 1] = py;
        posArr[i * 3 + 2] = pz;
      }
      posAttribute.needsUpdate = true;

      // --- Connection Line Builder ---
      let lineIdx = 0;
      const linePosArr = lineGeometry.attributes.position.array;
      const lineColArr = lineGeometry.attributes.color.array;

      for (let i = 0; i < particleCount; i++) {
        const px1 = posArr[i * 3];
        const py1 = posArr[i * 3 + 1];
        const pz1 = posArr[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const px2 = posArr[j * 3];
          const py2 = posArr[j * 3 + 1];
          const pz2 = posArr[j * 3 + 2];

          const dx = px1 - px2;
          const dy = py1 - py2;
          const dz = pz1 - pz2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Draw segments if within connection distance (5.0 units)
          if (dist < 5.0 && lineIdx < maxConnections) {
            const idx = lineIdx * 6;
            linePosArr[idx] = px1;
            linePosArr[idx + 1] = py1;
            linePosArr[idx + 2] = pz1;
            
            linePosArr[idx + 3] = px2;
            linePosArr[idx + 4] = py2;
            linePosArr[idx + 5] = pz2;

            // Faint purple links mapping distance to transparency
            const opacity = (1 - dist / 5.0) * 0.35;
            const colIdx = lineIdx * 6;
            
            // #7F49B4 purple accent line colors
            const r = (127 / 255) * opacity;
            const g = (73 / 255) * opacity;
            const b = (180 / 255) * opacity;

            lineColArr[colIdx] = r;
            lineColArr[colIdx + 1] = g;
            lineColArr[colIdx + 2] = b;
            
            lineColArr[colIdx + 3] = r;
            lineColArr[colIdx + 4] = g;
            lineColArr[colIdx + 5] = b;

            lineIdx++;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIdx * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      // Slow orbital rotate effect
      if (particles) {
        particles.rotation.y += 0.001;
      }
      if (lineSegments) {
        lineSegments.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseMove = (event) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(event.clientY / window.innerHeight - 0.5) * 2; // Invert Y
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (lineGeometry) lineGeometry.dispose();
      if (lineMaterial) lineMaterial.dispose();
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
            <p className="hero-tagline">Full-Stack Web Developer </p>
            <h1 className="hero-title">
              <span>Creating digital</span>
              <span className="text-purple-gradient">experiences that</span>
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

          {/* Right Column: Zero-Gravity Particle field */}
          <div className="hero-canvas-container">
  <div ref={containerRef} className="hero-canvas" />
  <div className="hero-profile-overlay">
    <img src={profileImg} alt="Sanduni Basnayaka" />
  </div>
</div>
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
