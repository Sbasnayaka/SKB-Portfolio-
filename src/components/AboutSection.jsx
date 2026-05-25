import React, { useState } from 'react';
import { educationData, skillsData, achievementsData, languagesData } from '../data/projectsData';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Globe, 
  Heart,
  Code, 
  Server, 
  Database, 
  PenTool, 
  Wrench, 
  Video, 
  Sparkles 
} from 'lucide-react';

export default function AboutSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Unified list of categories for the Skills Section
  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Databases',
    'Languages',
    'Frameworks',
    'Design',
    'Creative Tech',
    'Media',
    'Arts & Poetry',
    'Soft Skills'
  ];

  // Helper to map specific skills to official Devicon icons
  const getSkillDeviconClass = (name) => {
    const normalized = name.toLowerCase().trim();
    if (normalized.includes('react')) return 'devicon-react-original colored';
    if (normalized.includes('three.js') || normalized.includes('threejs')) return 'devicon-threejs-original colored';
    if (normalized.includes('node')) return 'devicon-nodejs-plain colored';
    if (normalized.includes('php')) return 'devicon-php-plain colored';
    if (normalized.includes('mysql') || normalized.includes('sql')) return 'devicon-mysql-plain colored';
    if (normalized.includes('mongodb') || normalized.includes('mongo')) return 'devicon-mongodb-plain colored';
    if (normalized.includes('javascript') || normalized.includes('js')) return 'devicon-javascript-plain colored';
    if (normalized.includes('java') && !normalized.includes('script')) return 'devicon-java-plain colored';
    if (normalized.includes('c++')) return 'devicon-cplusplus-plain colored';
    if (normalized.includes('c#')) return 'devicon-csharp-plain colored';
    if (normalized === 'c') return 'devicon-c-plain colored';
    if (normalized.includes('c / c++ / c#')) return 'devicon-cplusplus-plain colored';
    if (normalized.includes('laravel')) return 'devicon-laravel-original colored';
    if (normalized.includes('bootstrap')) return 'devicon-bootstrap-plain colored';
    if (normalized.includes('html')) return 'devicon-html5-plain colored';
    if (normalized.includes('css')) return 'devicon-css3-plain colored';
    if (normalized.includes('figma')) return 'devicon-figma-plain colored';
    if (normalized.includes('git')) return 'devicon-git-plain colored';
    if (normalized.includes('jira')) return 'devicon-jira-plain colored';
    if (normalized.includes('wordpress')) return 'devicon-wordpress-plain colored';
    if (normalized.includes('photoshop')) return 'devicon-photoshop-plain colored';
    return null;
  };

  // Helper to map category to icon
  const getSkillIcon = (category) => {
    switch (category) {
      case 'Frontend':
      case 'Languages':
        return <Code size={16} />;
      case 'Backend':
      case 'Frameworks':
        return <Server size={16} />;
      case 'Databases':
        return <Database size={16} />;
      case 'Design':
      case 'Fine Arts':
      case 'Creative Arts':
        return <PenTool size={16} />;
      case 'Tools':
      case 'Methodologies':
        return <Wrench size={16} />;
      case 'Media':
        return <Video size={16} />;
      case 'Creative Tech':
      case 'Emerging Tech':
        return <Sparkles size={16} />;
      default:
        return <Heart size={16} />;
    }
  };

  // Compile all technical and soft skills into a single flat array
  const getAllSkills = () => {
    const items = [];
    
    // Add technical skills
    skillsData.technical.forEach(skill => {
      items.push({
        name: skill.name,
        category: skill.category,
        isSoft: false
      });
    });
    
    // Add soft skills
    skillsData.soft.forEach(skillName => {
      items.push({
        name: skillName,
        category: 'Soft Skills',
        isSoft: true
      });
    });
    
    return items;
  };

  const allSkills = getAllSkills();

  // Filter skills based on chosen active category
  const filteredSkills = allSkills.filter(skill => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Soft Skills') return skill.isSoft;
    if (activeCategory === 'Arts & Poetry') {
      return skill.category === 'Fine Arts' || skill.category === 'Creative Arts';
    }
    return skill.category === activeCategory;
  });

  return (
    <section id="about" className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Biography</span>
          <h2 className="section-title">About Me</h2>
        </div>

        {/* Top Grid: Education & Achievements */}
        <div className="about-grid">
          
          {/* Education Timeline */}
          <div>
            <h3 className="modal-section-title">
              <BookOpen size={20} /> Education
            </h3>
            <div className="timeline">
              {educationData.map((edu, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-dot" />
                  <span className="timeline-period">{edu.period}</span>
                  <h4 className="timeline-degree">{edu.degree}</h4>
                  <p className="timeline-inst">{edu.institution}</p>
                  <p className="timeline-details">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Languages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Certifications & Achievements */}
            <div>
              <h3 className="modal-section-title">
                <Award size={20} /> Accomplishments
              </h3>
              <div className="appreciation-board">
                {achievementsData.map((ach, index) => (
                  <div className="soft-skill-card" key={index} style={{ borderLeft: '3px solid var(--accent-color)', borderRadius: '0 12px 12px 0', display: 'flex', gap: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem 1.25rem' }}>
                    <CheckCircle size={18} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{ach.title}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ach.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="modal-section-title">
                <Globe size={20} /> Languages
              </h3>
              <div className="appreciation-board">
                {languagesData.map((lang, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: '600' }}>{lang.name}</span>
                    <span className="project-tech-tag" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)', fontSize: '0.75rem', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Skills & Talents bubbles */}
        <div style={{ marginTop: '6rem' }}>
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="section-tag">Competencies</span>
            <h2 className="section-title" style={{ fontSize: '2.2rem' }}>Skills & Talents</h2>
          </div>

          {/* Categories bar for jumping directly to filters */}
          <div className="skills-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bubbles flex container */}
          <div className="skills-bubbles-container">
            {filteredSkills.map((skill, index) => {
              // Create unique floating offsets so bubbles animate asynchronously
              const randomDelay = (index * 0.18) % 3.5;
              const randomDuration = 4.5 + (index % 4) * 1.2;
              const deviconClass = getSkillDeviconClass(skill.name);

              return (
                <div
                  key={index}
                  className="skill-bubble-card"
                  style={{
                    animationDelay: `-${randomDelay}s`,
                    animationDuration: `${randomDuration}s`
                  }}
                >
                  {deviconClass ? (
                    <i className={`${deviconClass} skill-icon`} style={{ fontSize: '18px' }} />
                  ) : (
                    getSkillIcon(skill.category)
                  )}
                  <span>{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
