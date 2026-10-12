import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export function SectionNavigator() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show navigator after scrolling past hero
      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.5);

      // Determine active section
      const sectionElements = sections
        .map((s) => ({
          id: s.id,
          element: document.getElementById(s.id),
        }))
        .filter((s) => s.element);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      // If at top, set to hero
      if (scrollY < 100) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {sections.map((section) => (
        <motion.button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group relative flex items-center justify-end"
          whileHover={{ x: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Label tooltip */}
          <span
            className="pointer-events-none absolute right-8 px-2.5 py-1 text-[11px] font-mono font-medium bg-card/95 border border-border/80 rounded-md shadow-md backdrop-blur-md opacity-0 translate-x-1 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-[opacity,transform] duration-150 ease-out origin-right whitespace-nowrap"
          >
            {section.label}
          </span>

          {/* Dot indicator */}
          <motion.div
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-150 ${
              activeSection === section.id
                ? 'bg-primary'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
            animate={{
              scale: activeSection === section.id ? 1.25 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />

          {/* Active indicator ring */}
          {activeSection === section.id && (
            <motion.div
              className="absolute w-5 h-5 rounded-full border-2 border-primary/50"
              layoutId="activeIndicator"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </motion.nav>
  );
}
