import React, { useState } from 'react';
import { projectsData } from '../data/projectsData';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const CATEGORIES = ["All", "Web Applications", "CMS Systems", "UI/UX Designs", "Photography/Videography", "Creative Experiments", "Data & Analysis"];

export default function WorkSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects based on selected category
  const filteredProjects = activeCategory === "All" 
    ? projectsData 
    : projectsData.filter(p => p.category === activeCategory);

  return (
    <section id="work" className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Showcase</span>
          <h2 className="section-title">Projects & Portfolio</h2>
        </div>

        {/* Filter Navigation Buttons */}
        <div className="projects-filter-bar">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Responsive Grid */}
        <div className="grid-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={setSelectedProject}
            />
          ))}
        </div>

        {/* Project detail slide-out drawer (if selected) */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}

      </div>
    </section>
  );
}
