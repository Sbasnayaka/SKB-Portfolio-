import React, { useState, useEffect, useRef } from 'react';
import { X, Github, ExternalLink } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  // Photo gallery state
  const [activePhoto, setActivePhoto] = useState(
    project?.photoGallery && project.photoGallery.length > 0 ? project.photoGallery[0] : ''
  );

  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset photo gallery when project changes
  useEffect(() => {
    if (!project) return;
    if (project.photoGallery && project.photoGallery.length > 0) {
      setActivePhoto(project.photoGallery[0]);
    } else {
      setActivePhoto('');
    }
  }, [project]);

  // Handle overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  // Convert Google Drive view URLs to preview format for iframe nesting
  const getGoogleDriveEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      // Replaces /view?usp=sharing or similar paths with /preview
      return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
    }
    return url;
  };

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div ref={modalRef} className="modal-content">
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close project details">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <span className="project-sub">{project.subcategory}</span>
          <h2 className="modal-title">{project.title}</h2>
          
          <div className="modal-links" style={{ marginTop: '0.5rem' }}>
            {project.githubUrl && project.githubUrl !== '#' && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
                <Github size={16} /> Source Code
              </a>
            )}
            {project.liveUrl && project.liveUrl !== '#' && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
            {project.grade && (
              <span className="academic-grade-badge" style={{ marginTop: 0 }}>
                {project.grade}
              </span>
            )}
          </div>
        </div>

        {/* Project Video Demo (if exists, supporting local or embedded Drive videos) */}
        {project.videoUrl && (
          <div className="modal-media-container" style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: '#000' }}>
            {project.videoUrl.includes('drive.google.com') ? (
              <iframe
                src={getGoogleDriveEmbedUrl(project.videoUrl)}
                title={`Video of ${project.title}`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video 
                className="modal-video" 
                src={project.videoUrl} 
                controls 
                autoPlay 
                muted 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
          </div>
        )}

        {/* Embedded PDF presentation previewer (if exists) */}
        {project.pdfUrl && (
          <div className="modal-pdf-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                📄 Project Presentation & Details (PDF Preview)
              </h4>
              <a 
                href={project.pdfUrl} 
                download 
                target="_blank" 
                rel="noopener noreferrer" 
                className="modal-link"
                style={{ fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Download PDF
              </a>
            </div>
            <div style={{ width: '100%', height: '520px', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--bg-card)' }}>
              <iframe
                src={`${project.pdfUrl}#toolbar=0`}
                title={`PDF Preview of ${project.title}`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Photo Gallery slideshow (if exists) */}
        {project.photoGallery && project.photoGallery.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Project Gallery
            </h3>
            <img 
              src={activePhoto} 
              alt="Expanded view" 
              className="modal-photo-viewer" 
            />
            <div className="modal-photo-grid">
              {project.photoGallery.map((photo, idx) => (
                <img 
                  key={idx}
                  src={photo} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className={`modal-photo-thumbnail ${activePhoto === photo ? 'active' : ''}`}
                  onClick={() => setActivePhoto(photo)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack List */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>
            Technologies Used
          </h3>
          <ul className="project-tech-list">
            {project.technologies.map((tech, idx) => (
              <li key={idx} className="project-tech-tag" style={{ fontSize: '0.85rem' }}>
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* Full Details Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          <p className="modal-desc" style={{ lineHeight: '1.6' }}>{project.description}</p>
          {project.details && (
            <p className="modal-details" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{project.details}</p>
          )}
        </div>

      </div>
    </div>
  );
}
