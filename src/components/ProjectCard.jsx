import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position of cursor relative to card center
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    
    // Max rotation in degrees
    const maxRotation = 10; 
    
    // Calculate rotation angles
    const rotateY = (x / (width / 2)) * maxRotation;
    const rotateX = -(y / (height / 2)) * maxRotation;

    // Set custom variables for index.css radial light effect
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      className="glass-card project-card"
      style={{ 
        transform: transformStyle,
        transition: transformStyle ? 'transform 0.1s ease, box-shadow 0.3s ease' : 'transform 0.5s ease, box-shadow 0.3s ease'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
    >
      {/* Visual Badge */}
      {project.badge && (
        <span className="project-badge">{project.badge}</span>
      )}

      {/* Cover Image Wrapper */}
      <div className="project-card-image-wrapper">
        <img 
          src={project.imageUrl || 'https://placehold.co/600x400/34312a/dac09d?text=Project'} 
          alt={project.title} 
          className="project-card-image"
          loading="lazy"
        />
      </div>

      {/* Content wrapper with correct margins */}
      <div className="project-card-info">
        {/* Header */}
        <div className="project-card-header">
          <span className="project-sub">{project.subcategory}</span>
          <h3 className="project-card-title">{project.title}</h3>
          
          {/* Academic Grade Badge */}
          {project.grade && (
            <span className="academic-grade-badge">{project.grade}</span>
          )}
        </div>

        {/* Description */}
        <p className="project-card-body">
          {project.description}
        </p>

        {/* Footer */}
        <div className="project-card-footer">
          <ul className="project-tech-list">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <li key={idx} className="project-tech-tag">
                {tech}
              </li>
            ))}
            {project.technologies.length > 3 && (
              <li className="project-tech-tag" style={{ borderStyle: 'dashed' }}>
                +{project.technologies.length - 3} more
              </li>
            )}
          </ul>
          <span className="project-arrow">
            <ArrowRight size={20} />
          </span>
        </div>
      </div>
    </div>
  );
}
