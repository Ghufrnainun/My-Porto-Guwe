import { useEffect, useCallback } from 'react';

const sectionMap: Record<string, string> = {
  '1': 'hero',
  '2': 'about',
  '3': 'skills',
  '4': 'projects',
  '5': 'education',
  '6': 'contact',
};

export function useKeyboardNavigation() {
  const scrollToSection = useCallback((id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Number keys 1-6 for section navigation
      const section = sectionMap[e.key];
      if (section) {
        e.preventDefault();
        scrollToSection(section);
      }

      // Home key goes to top
      if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // End key goes to contact
      if (e.key === 'End') {
        e.preventDefault();
        scrollToSection('contact');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToSection]);
}
