import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LoadingOverlay from './components/LoadingOverlay';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WorkSection from './components/WorkSection';
import AppreciationsSection from './components/AppreciationsSection';
import ContactSection from './components/ContactSection';

function AppContent() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* 3-Step Animated Loading & Purple Paint Blast Overlay */}
      {loading && (
        <LoadingOverlay onComplete={() => setLoading(false)} />
      )}
      
      {/* Main Portfolio Content */}
      <div className="portfolio-app">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <WorkSection />
          <AppreciationsSection />
          <ContactSection />
        </main>

        {/* Floating WhatsApp Widget */}
        <a 
          href="https://wa.me/94740665317" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="whatsapp-widget"
          title="Chat with me on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.458 3.486 1.332 5.008L2 22l5.163-1.354c1.474.805 3.125 1.229 4.849 1.229 5.506 0 9.988-4.482 9.988-9.988S17.518 2 12.012 2zm4.7 13.916c-.223.63-1.295 1.218-1.785 1.265-.48.047-.95.228-3.076-.606-2.716-1.066-4.43-3.83-4.566-4.01-.137-.18-1.096-1.462-1.096-2.79 0-1.328.694-1.98.942-2.247.248-.266.544-.334.726-.334.18 0 .363.003.52.01.164.007.387-.062.603.456.223.53.76 1.854.827 1.987.067.134.11.29.02.47-.09.18-.135.29-.27.45-.133.16-.28.36-.4.48-.135.136-.277.284-.12.553.156.27.693 1.144 1.488 1.852.822.734 1.516.96 1.73.188s.457-.225.59-.448c.134-.223.067-.358-.02-.513-.09-.155-.405-.513-.518-.69-.113-.18-.225-.136-.36-.09-.134.045-.853.284-.966.39-.113.106-.226.155-.45.045-.226-.11-1.077-.397-2.05-1.266-.757-.674-1.268-1.508-1.417-1.76-.148-.254-.016-.39.108-.515.112-.113.248-.29.37-.435.125-.145.166-.248.248-.415.083-.165.042-.31-.02-.446-.063-.135-.603-1.455-.826-1.99-.217-.52-.452-.45-.62-.458-.168-.008-.362-.01-.555-.01-.194 0-.51.073-.777.368-.267.295-1.02 1.002-1.02 2.443 0 1.44 1.05 2.833 1.196 3.03.147.198 2.067 3.156 5.01 4.433.7.304 1.247.485 1.674.62.704.224 1.346.192 1.853.117.564-.084 1.733-.71 1.978-1.393.247-.684.247-1.272.172-1.393-.075-.12-.27-.193-.564-.343z"/>
          </svg>
        </a>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
