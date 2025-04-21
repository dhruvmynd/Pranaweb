import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export interface Section {
  id: string;
  label: string;
}

export const homeSections: Section[] = [
  { id: 'hero', label: 'Welcome' },
  { id: 'wave', label: 'Experience' },
  { id: 'science', label: 'Science' },
  { id: 'vision', label: 'Vision' },
  { id: 'newsletter', label: 'Newsletter' }
];

export function DotNavigation({ sections = homeSections }: { sections?: Section[] }) {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px',
        threshold: 0
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col items-center gap-3">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center"
            aria-label={`Scroll to ${label} section`}
          >
            {/* Outer circle (appears on hover) */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.8, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Inner dot */}
            <motion.div
              className={`relative w-2 h-2 rounded-full transition-colors duration-300 ${
                activeSection === id
                  ? 'bg-primary'
                  : 'bg-gray-300 group-hover:bg-primary'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Label */}
            <span className="absolute right-full mr-4 py-1 px-2 rounded-md bg-white/80 backdrop-blur-sm text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}