import React from 'react';
import { Mail, Github, Linkedin, Figma, ArrowUp, FileText } from 'lucide-react';

export default function ContactSection() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer id="contact" className="contact-section">
      <div className="container">
        
        <span className="section-tag">Connection</span>
        <h2 className="section-title">Get In Touch</h2>
        
        <p style={{ maxWidth: '600px', margin: '2rem auto 1rem auto', color: 'var(--text-secondary)' }}>
          Whether you want to discuss full-stack projects, creative designs, 3D WebGL components, 
          or literary works, feel free to reach out. I am open to internships and junior developer roles!
        </p>

        {/* Big direct email link */}
        <a 
          href="mailto:sandunibasnayakawork@gmail.com" 
          className="contact-email"
          title="Send me an email"
        >
          sandunibasnayakawork@gmail.com
        </a>

        {/* Social Links List */}
        <ul className="social-links">
          <li>
            <a 
              href="https://github.com/Sbasnayaka" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <Github size={20} />
            </a>
          </li>
          <li>
            <a 
              href="https://www.linkedin.com/in/s-basnayaka" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          </li>
          <li>
            <a 
              href="/sanduni_basnayaka_cv.pdf" 
              download
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              title="Download Resume / CV"
              aria-label="Download Resume"
            >
              <FileText size={20} />
            </a>
          </li>
        </ul>

        {/* Scroll back to top */}
        <div style={{ marginTop: '3.5rem' }}>
          <button 
            className="btn-secondary" 
            onClick={handleScrollToTop}
            style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, justifyContent: 'center' }}
            title="Scroll to Top"
            aria-label="Scroll to Top"
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Footer credits */}
        <div className="footer-credits">
          <p>© {currentYear} Sanduni Kaveesha Basnayaka.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>Designed with a splash of pastel purple and real-time appreciations.</p>
        </div>

      </div>
    </footer>
  );
}
