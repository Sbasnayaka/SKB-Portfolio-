import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/Loading.css';

const PROFESSIONS = [
  "Full-Stack Developer",
  "UI/UX Designer",
  "Artist",
  "Video Editor",
  "AI Prompt Engineer",
  "Poet"
];

export default function LoadingOverlay({ onComplete }) {
  const [stage, setStage] = useState(1);
  const [isDissolving, setIsDissolving] = useState(false);
  
  const nameRef = useRef(null);
  const professionsContainerRef = useRef(null);
  const tagRefs = useRef([]);
  const exploreRef = useRef(null);
  const exploreBtnRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize refs array
  tagRefs.current = [];
  const addToTagRefs = (el) => {
    if (el && !tagRefs.current.includes(el)) {
      tagRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Disable scrolling when loading is active
    document.body.classList.add('no-scroll');

    // Check if session has already seen the intro
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro') === 'true';
    if (hasSeenIntro) {
      // Direct jump to end, but let's allow it to play once per tab session.
      // If we want it to show every time, just comment this.
    }

    // --- STAGE 1: Name Typing Animation ---
    if (stage === 1) {
      const nameEl = nameRef.current;
      if (nameEl) {
        gsap.to(nameEl, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            // Wait 2.2 seconds then move to Stage 2
            gsap.delayedCall(2.2, () => {
              gsap.to(nameEl, {
                opacity: 0,
                y: -30,
                duration: 0.6,
                ease: "power2.in",
                onComplete: () => setStage(2)
              });
            });
          }
        });
      }
    }

    // --- STAGE 2: Professions Cluster and Scatter ---
    if (stage === 2) {
      // Wait for DOM to render tags
      setTimeout(() => {
        const tags = tagRefs.current;
        if (tags.length === 0) return;

        // Reset tags to center stacked
        gsap.set(tags, {
          x: 0,
          y: 0,
          scale: 0.2,
          opacity: 0,
          filter: "blur(10px)"
        });

        // 1. Staggered reveal in center
        gsap.to(tags, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          onComplete: () => {
            // 2. Scatter to corners
            scatterProfessions();
          }
        });
      }, 50);
    }

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
      // Re-enable scrolling on cleanup
      document.body.classList.remove('no-scroll');
    };
  }, [stage]);

  // Scatter positions calculation
  const scatterProfessions = () => {
    const tags = tagRefs.current;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Define target areas around the edges / corners
    // Corner zones: Top-Left, Top-Right, Mid-Left, Mid-Right, Bottom-Left, Bottom-Right
    const targets = [
      { x: -w * 0.35, y: -h * 0.35, rot: -15 },  // Top Left
      { x: w * 0.35, y: -h * 0.35, rot: 15 },    // Top Right
      { x: -w * 0.38, y: h * 0.05, rot: 10 },    // Mid Left
      { x: w * 0.38, y: -h * 0.05, rot: -10 },   // Mid Right
      { x: -w * 0.3, y: h * 0.35, rot: -8 },     // Bottom Left
      { x: w * 0.3, y: h * 0.35, rot: 12 }       // Bottom Right
    ];

    tags.forEach((tag, index) => {
      const target = targets[index % targets.length];
      
      // Expand from center to corner
      gsap.to(tag, {
        x: target.x + (Math.random() * 40 - 20),
        y: target.y + (Math.random() * 40 - 20),
        rotation: target.rot,
        color: index % 2 === 0 ? "#DAC09D" : "#806957", // Stagger colors
        duration: 1.5,
        ease: "power4.out",
        onComplete: () => {
          // After scatter, add gentle floating movement (yoyo sine wave)
          gsap.to(tag, {
            y: `+=20`,
            x: `+=10`,
            rotation: `+=${Math.random() * 4 - 2}`,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      });
    });

    // Stagger fade out of stage 2 and load stage 3
    gsap.delayedCall(3.5, () => {
      gsap.to(tags, {
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.in",
        onComplete: () => {
          setStage(3);
        }
      });
    });
  };

  // Stage 3: Paint Blast Canvas Simulation
  const handleExploreClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get click location or fallback to center
    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Particle class for paint blast
    class PaintParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Random angle and speed
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 22; // Exploding velocity
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // Paint splat sizes
        this.radius = 5 + Math.random() * 25; 
        
        // Palette of pastel purple shades
        const purples = [
          'rgba(182, 158, 250, ', // #B69EFA
          'rgba(197, 180, 227, ', // #C5B4E3
          'rgba(211, 194, 253, ', // #D3C2FD
          'rgba(159, 131, 236, ', // #9F83EC
          'rgba(167, 139, 250, '  // #A78BFA
        ];
        this.colorBase = purples[Math.floor(Math.random() * purples.length)];
        
        this.alpha = 1;
        this.decay = 0.008 + Math.random() * 0.015;
        this.gravity = 0.08;
        this.friction = 0.985;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.decay;
        
        // Splat gets slightly wider/flatter as it flies (optional)
        this.radius += 0.05;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `${this.colorBase}${this.alpha})`;
        
        // Render organic paint splat shape (a main circle + tiny satellite drops)
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw sub-droplet for paint splat authenticity
        if (Math.random() > 0.6) {
          ctx.beginPath();
          ctx.arc(
            this.x + this.vx * 1.5, 
            this.y + this.vy * 1.5, 
            this.radius * 0.3, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }

    // Spawn 250 paint splats
    const particles = [];
    for (let i = 0; i < 280; i++) {
      particles.push(new PaintParticle(startX, startY));
    }

    // Animate loop
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

    // Trigger dissolution sequence
    setIsDissolving(true);
    
    // Stagger fade-out of explore components
    gsap.to([exploreRef.current, exploreBtnRef.current], {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: "power2.in"
    });

    // Mark seen & close overlay
    sessionStorage.setItem('hasSeenIntro', 'true');
    
    // Complete overall sequence after 1s (giving time for the paint splash to spread)
    gsap.delayedCall(1.0, () => {
      document.body.classList.remove('no-scroll');
      onComplete();
    });
  };

  return (
    <div className={`loading-container ${isDissolving ? 'dissolving' : ''}`}>
      {/* Dynamic Canvas Layer for Purple Paint Blast */}
      <canvas ref={canvasRef} className="paint-blast-canvas" />

      {/* Stage 1: Hi, I'm Sanduni */}
      {stage === 1 && (
        <div className="intro-name-wrapper">
          <h1 ref={nameRef} className="intro-name">
            Hi, I'm Sanduni Kaveesha Basnayaka
          </h1>
        </div>
      )}

      {/* Stage 2: Center Expand floating professions */}
      {stage === 2 && (
        <div ref={professionsContainerRef} className="professions-wrapper">
          {PROFESSIONS.map((profession, index) => (
            <div
              key={index}
              ref={addToTagRefs}
              className="profession-tag"
            >
              {profession}
            </div>
          ))}
          {/* Centered focal reference element */}
          <div className="profession-tag center-cluster">•</div>
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
