import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  href: string;
  label: string;
  isPage?: boolean;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Overview', isPage: true },
  { href: '/about', label: 'About', isPage: true },
  { href: '/projects', label: 'Projects', isPage: true },
  { href: '/blog', label: 'Blog', isPage: true },
];

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // On homepage, show only after scrolling down
      // On subpages, always show (or at least show at top)
      if (isHomePage) {
        setIsVisible(scrollY > window.innerHeight * 0.6);
      } else {
        setIsVisible(true);
      }

      // Detect active section logic (mostly for homepage scroll anchors if needed,
      // but we are using page routes now so this might be less relevant,
      // keeping it simple for now)
      const sections = navLinks.map((link) => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (!isHomePage) {
      window.location.href = '/' + href;
    }
  };

  return (
    <>
      {/* ==================== DESKTOP LAYOUT ==================== */}

      {/* Zone 1: Logo (Top Left) - Desktop Only */}
      <Link
        to="/"
        className="fixed top-6 left-8 z-50 hidden md:block font-bold text-xl text-foreground tracking-tight hover:opacity-80 transition-opacity cursor-pointer select-none"
      >
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          Ghufron A.N.
        </motion.span>
      </Link>

      {/* Zone 2: Glass Pill Navbar (Center) - Desktop Only */}
      <motion.nav
        className="fixed top-6 inset-x-0 mx-auto w-fit z-50 hidden md:flex h-12 items-center gap-1 bg-card/80 backdrop-blur-md border border-border rounded-full px-6 py-2 shadow-2xl"
        initial={{ y: -100, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;

          return (
            <motion.div key={link.href} whileHover={{ scale: 1.02 }}>
              {link.isPage ? (
                <Link
                  to={link.href}
                  className={`relative px-5 py-2 font-mono text-sm font-medium rounded-full transition-all ${
                    isActive
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
              ) : (
                <a
                  href={isHomePage ? link.href : '/' + link.href}
                  className={`relative px-5 py-2 font-mono text-sm font-medium rounded-full transition-all ${
                    isActive
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </a>
              )}
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Zone 3: Actions (Top Right) - Desktop Only */}
      <motion.div
        className="fixed top-6 right-8 z-50 hidden md:flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/resume"
          className="border border-border hover:border-primary text-foreground text-sm font-mono px-5 py-2 rounded-full transition-all bg-card/50 backdrop-blur-md"
        >
          Resume
        </Link>
        <ThemeToggle />
      </motion.div>

      {/* ==================== MOBILE LAYOUT ==================== */}

      {/* Mobile Header Bar - Hidden on Hero, shows after scroll */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 md:hidden h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-lg border-b border-border"
        initial={{ y: -100, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-bold text-lg text-foreground tracking-tight"
        >
          Ghufron A.N.
        </a>

        {/* Right Side - Menu Button Only */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center justify-center w-10 h-10 text-foreground rounded-lg hover:bg-secondary active:bg-secondary/80 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </motion.header>

      {/* Premium Full-Screen Overlay Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[999] bg-background flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Header in Menu (Logo + Close) */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <span className="font-bold text-lg text-foreground tracking-tight">
                Ghufron A.N.
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links - Center */}
            <nav className="flex-1 flex flex-col items-center justify-center space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-bold text-foreground tracking-tight hover:text-primary transition-colors text-center"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom Section - Social & Resume */}
            <motion.div
              className="p-8 flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Social Icons */}
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/Ghufrnainun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ghufronainunnajib/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="mailto:ghufrnainunajib@gmail.com"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>

              {/* Resume Button */}
              <Link
                to="/resume"
                className="border border-border hover:border-primary text-foreground text-sm font-mono px-8 py-3 rounded-full transition-all"
              >
                Download Resume
              </Link>

              {/* Theme Toggle */}
              <div className="pt-4">
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
