import React from 'react';
import { MessageSquare, Quote } from 'lucide-react';
import mentorPic from '../assets/tharindu-janaka-sir.png';

const MENTOR_FEEDBACKS = [
  {
    quote: "Superb Sanduni! Outstanding speed and clean structures on all modules.",
    project: "E-Commerce CMS (Dark Lavender)"
  },
  {
    quote: "Great work on the mobile responsive views. Clients loved the adaptivity.",
    project: "E9Shop Mobile Web"
  },
  {
    quote: "Excellent dedication. The tour booking panel is perfectly implemented.",
    project: "SaoirseTours CMS"
  },
  {
    quote: "Awesome work re-branding the hospitality frontend. Extremely fluid animations.",
    project: "Jetwing Travels UI"
  }
];

export default function AppreciationsSection() {
  return (
    <section id="appreciations" className="section" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Industry Feedback</span>
          <h2 className="section-title">Mentor Appreciations</h2>
        </div>

        {/* Mentor Profile Banner */}
        <div className="glass-card mentor-profile-card" style={{ maxWidth: '800px', margin: '0 auto 4rem auto', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          <div className="mentor-img-wrapper" style={{ flexShrink: 0, width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent-color)', boxShadow: '0 0 15px var(--pastel-purple-glow)' }}>
            <img 
              src={mentorPic} 
              alt="Tharindu Janaka" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Fallback if image fails to load
                e.target.src = 'https://placehold.co/150x150/34312a/dac09d?text=TJ';
              }}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', fontFamily: 'Outfit', fontWeight: '700', marginBottom: '0.2rem' }}>
              Tharindu Janaka
            </h3>
            <p style={{ color: 'var(--accent-color)', fontWeight: '600', fontSize: '1rem', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>
              Mentor & Technical Lead
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Asseminate Solutions Private Limited
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
              "Sanduni has been an invaluable asset to our development cycle, delivering real client projects with exceptional quality, responsiveness, and clean code."
            </p>
          </div>
          <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', opacity: 0.08, color: 'var(--text-primary)' }}>
            <Quote size={80} />
          </div>
        </div>

        {/* Feedbacks Grid */}
        <div className="grid-2" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {MENTOR_FEEDBACKS.map((item, index) => (
            <div 
              key={index} 
              className="glass-card feedback-item-card" 
              style={{ 
                padding: '1.8rem', 
                borderLeft: '4px solid var(--accent-color)',
                borderRadius: '0 16px 16px 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <p style={{ fontSize: '1.05rem', fontWeight: '500', color: 'var(--text-primary)', lineHeight: '1.6', fontStyle: 'italic' }}>
                "{item.quote}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(128, 105, 87, 0.2)', paddingTop: '0.8rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.project}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  — via Slack / Teams
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
