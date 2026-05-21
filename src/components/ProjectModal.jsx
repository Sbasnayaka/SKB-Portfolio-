import React, { useState, useEffect, useRef } from 'react';
import { X, Github, ExternalLink, MessageSquare, Send } from 'lucide-react';
import { getAppreciations, addAppreciation } from '../db/firebase';

const BADGE_OPTIONS = [
  "✨ Awesome", 
  "💻 Brilliant Code", 
  "🎨 Beautiful UI", 
  "🔥 Creative Tech", 
  "💡 Inspiring"
];

export default function ProjectModal({ project, onClose }) {
  const [appreciations, setAppreciations] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(BADGE_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
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

  // Load and listen to appreciations, reset photo gallery when project changes
  useEffect(() => {
    if (!project) return;
    
    if (project.photoGallery && project.photoGallery.length > 0) {
      setActivePhoto(project.photoGallery[0]);
    } else {
      setActivePhoto('');
    }

    const unsubscribe = getAppreciations(project.id, (data) => {
      setAppreciations(data);
    });

    return () => unsubscribe();
  }, [project]);

  // Handle overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  // Submit appreciation handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setFormError('Please enter a feedback message.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      await addAppreciation(project.id, name || 'Anonymous User', message, selectedBadge);
      // Reset inputs
      setName('');
      setMessage('');
      setSelectedBadge(BADGE_OPTIONS[0]);
    } catch (err) {
      console.error(err);
      setFormError('Failed to add appreciation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Just now";
    }
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
                Grade: {project.grade}
              </span>
            )}
          </div>
        </div>

        {/* Project Video Demo (if exists) */}
        {project.videoUrl && (
          <div className="modal-media-container">
            <video 
              className="modal-video" 
              src={project.videoUrl} 
              controls 
              autoPlay 
              muted 
              playsInline
            />
          </div>
        )}

        {/* Project PDF presentation attachment (if exists) */}
        {project.pdfUrl && (
          <a 
            href={project.pdfUrl} 
            download 
            target="_blank" 
            rel="noopener noreferrer" 
            className="modal-pdf-link"
          >
            <span>📄 View / Download Project PDF ({project.pdfUrl.split('/').pop()})</span>
            <ExternalLink size={18} />
          </a>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p className="modal-desc" style={{ lineHeight: '1.6' }}>{project.description}</p>
          {project.details && (
            <p className="modal-details" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{project.details}</p>
          )}
        </div>

        {/* Appreciations Board */}
        <div>
          <h3 className="modal-section-title">
            <MessageSquare size={18} /> Appreciations ({appreciations.length})
          </h3>

          <div className="appreciation-board">
            
            {/* Feedback Input Form */}
            <form className="appreciation-form" onSubmit={handleSubmit}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', fontFamily: 'Outfit' }}>
                Explore the project and leave some feedback! ✨
              </h4>

              {formError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '500' }}>
                  {formError}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Anonymous"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                  />
                </div>

                <div className="form-group">
                  <label>Select Badge</label>
                  <div className="badge-selector-flex">
                    {BADGE_OPTIONS.map((badge, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`badge-option ${selectedBadge === badge ? 'selected' : ''}`}
                        onClick={() => setSelectedBadge(badge)}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  className="form-control"
                  rows="3"
                  placeholder="What did you appreciate about this project?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={250}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                    Send Appreciation <Send size={14} />
                  </span>
                )}
              </button>
            </form>

            {/* Comments Feed List */}
            <div className="appreciations-feed">
              {appreciations.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem' }}>
                  No appreciations yet. Be the first to leave one!
                </p>
              ) : (
                appreciations.map((app) => (
                  <div className="appreciation-card" key={app.id}>
                    <div className="appreciation-card-header">
                      <span className="appreciation-sender">{app.name}</span>
                      <span className="appreciation-badge">{app.badge}</span>
                    </div>
                    <p className="appreciation-msg" style={{ fontSize: '0.9rem', margin: '0.2rem 0' }}>{app.message}</p>
                    <span className="appreciation-time" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatDate(app.timestamp)}</span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
