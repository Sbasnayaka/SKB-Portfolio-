import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/Loading.css';

const PROFESSIONS = [
  "Full-Stack Developer",
  "Frontend Engineer",
  "Web Developer",
  "Software Engineer",
  "UI/UX Designer",
  "Wordpress Developer",
  "AI Prompt Engineer",
  "Content Writer",
  "Social Media Maintainer",
  "Creative Tech Explorer",
  "Systems Developer",
  "Database Developer",
  "Mobile Web Developer",
  "Solution Designer",
  "Technical Writer",
  "Graphic Editor",
  "Sinhala Poet",
  "Digital Artist",
  "Visual Curator",
  "Portfolio Designer",
  "Interactive Programmer",
  "Full Stack Engineer",
  "Web Architect",
  "UI Designer",
  "Frontend Specialist"
];

export default function LoadingOverlay({ onComplete }) {
  const [stage, setStage] = useState(1);
  const [isDissolving, setIsDissolving] = useState(false);
  const [splashRoles, setSplashRoles] = useState([]);
  
  const nameRef = useRef(null);
  const exploreRef = useRef(null);
  const exploreBtnRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable scrolling when loading is active
    document.body.classList.add('no-scroll');

    // --- STAGE 1: Name Reveal ---
    if (stage === 1) {
      const nameEl = nameRef.current;
      if (nameEl) {
        gsap.to(nameEl, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          onComplete: () => {
            // Wait 2.2 seconds then move to Stage 2
            gsap.delayedCall(2.2, () => {
              gsap.to(nameEl, {
                opacity: 0,
                y: -50,
                duration: 0.6,
                ease: "power2.in",
                onComplete: () => setStage(2)
              });
            });
          }
        });
      }
    }

    // --- STAGE 2: Spawning Loop (handled in separate useEffect below) ---

    // --- STAGE 3: Let's Explore Button ---
    if (stage === 3) {
      setTimeout(() => {
        const exploreEl = exploreRef.current;
        const btnEl = exploreBtnRef.current;
        if (exploreEl && btnEl) {
          gsap.timeline()
            .to(exploreEl, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(btnEl, {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "back.out(2)"
            }, "-=0.4");
        }
      }, 50);
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [stage]);

  // Stage 2: Spawning interval for job roles
  useEffect(() => {
    if (stage !== 2) return;

    let intervalId;
    let transitionTimeoutId;
    let idCounter = 0;

    // Spawn a role tag every 140ms
    intervalId = setInterval(() => {
      const randomRole = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
      const left = Math.random() * 80 + 10; // 10% to 90%
      const top = Math.random() * 80 + 10;  // 10% to 90%
      const scale = Math.random() * 0.6 + 0.8; // 0.8 to 1.4
      const rotation = Math.random() * 30 - 15; // -15deg to 15deg
      
      // Theme colors matching dark/light accents (using primary accent shades)
      const colors = ["#ffffff", "#7F49B4", "#c084fc", "#e9d5ff", "#a78bfa", "#9333ea"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const newRole = {
        id: idCounter++,
        name: randomRole,
        left,
        top,
        scale,
        rotation,
        color
      };

      setSplashRoles(prev => [...prev, newRole]);

      // Remove role from DOM after 1.8 seconds (matching CSS animation duration)
      setTimeout(() => {
        setSplashRoles(prev => prev.filter(r => r.id !== newRole.id));
      }, 1800);
    }, 140);

    // Let the loop splash for 4.5 seconds, then fade out and proceed to stage 3
    transitionTimeoutId = setTimeout(() => {
      clearInterval(intervalId);
      
      gsap.to(".splash-tag", {
        opacity: 0,
        scale: 0.5,
        filter: "blur(8px)",
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          setStage(3);
        }
      });
    }, 4500);

    return () => {
      clearInterval(intervalId);
      clearTimeout(transitionTimeoutId);
    };
  }, [stage]);

  // Stage 3: Paint Blast Canvas Simulation
  const handleExploreClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    class PaintParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 24;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.radius = 6 + Math.random() * 28; 
        
        const purples = [
          'rgba(182, 158, 250, ', 
          'rgba(197, 180, 227, ', 
          'rgba(211, 194, 253, ', 
          'rgba(127, 73, 180, ', 
          'rgba(167, 139, 250, '
        ];
        this.colorBase = purples[Math.floor(Math.random() * purples.length)];
        
        this.alpha = 1;
        this.decay = 0.008 + Math.random() * 0.012;
        this.gravity = 0.06;
        this.friction = 0.98;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.decay;
        this.radius += 0.04;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `${this.colorBase}${this.alpha})`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() > 0.65) {
          ctx.beginPath();
          ctx.arc(
            this.x + this.vx * 1.4, 
            this.y + this.vy * 1.4, 
            this.radius * 0.28, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }

    const particles = [];
    for (let i = 0; i < 300; i++) {
      particles.push(new PaintParticle(startX, startY));
    }

    let animId;
    const animateBlast = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = 0;
      particles.forEach(p => {
        if (p.alpha > 0) {
          p.update();
          p.draw();
          activeParticles++;
        }
      });

      if (activeParticles > 0) {
        animId = requestAnimationFrame(animateBlast);
      } else {
        cancelAnimationFrame(animId);
      }
    };
    
    animateBlast();

    setIsDissolving(true);
    
    gsap.to([exploreRef.current, exploreBtnRef.current], {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: "power2.in"
    });

    sessionStorage.setItem('hasSeenIntro', 'true');
    
    gsap.delayedCall(0.9, () => {
      document.body.classList.remove('no-scroll');
      onComplete();
    });
  };

  return (
    <div className={`loading-container ${isDissolving ? 'dissolving' : ''}`}>
      <canvas ref={canvasRef} className="paint-blast-canvas" />

      {/* Stage 1: Hi, I'm Sanduni Kaveesha Basnayaka */}
      {stage === 1 && (
        <div className="intro-name-wrapper">
          <h1 ref={nameRef} className="intro-name">
            <span className="intro-hi">Hi, I'm</span>
            <span className="intro-fullname">Sanduni Kaveesha Basnayaka</span>
          </h1>
        </div>
      )}

      {/* Stage 2: Fast-spawning roles scattered in viewport */}
      {stage === 2 && (
        <div className="professions-wrapper">
          {splashRoles.map((r) => (
            <div
              key={r.id}
              className="splash-tag"
              style={{
                left: `${r.left}%`,
                top: `${r.top}%`,
                color: r.color,
                transform: `translate(-50%, -50%) scale(${r.scale}) rotate(${r.rotation}deg)`
              }}
            >
              {r.name}
            </div>
          ))}
        </div>
      )}

      {/* Stage 3: Let's Explore */}
      {stage === 3 && (
        <div className="explore-wrapper">
          <h2 ref={exploreRef} className="explore-text text-purple-gradient">
            let's explore my portfolio
          </h2>
          <button
            ref={exploreBtnRef}
            onClick={handleExploreClick}
            className="explore-btn"
          >
            Enter Experience
          </button>
        </div>
      )}
    </div>
  );
}
