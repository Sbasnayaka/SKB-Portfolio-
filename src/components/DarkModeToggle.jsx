import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      className="theme-toggle-wrapper" 
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle dark mode"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleTheme();
        }
      }}
    >
      {/* Background indicators */}
      <div className="theme-toggle-bg-icons">
        <Sun size={14} />
        <Moon size={14} />
      </div>
      
      {/* Sliding thumb wrapper */}
      <div className="theme-toggle-thumb">
        {theme === 'dark' ? (
          <Moon className="theme-toggle-icon" size={14} />
        ) : (
          <Sun className="theme-toggle-icon" size={14} />
        )}
      </div>
    </div>
  );
}
