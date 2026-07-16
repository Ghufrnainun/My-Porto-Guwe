import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Github, Linkedin, Mail } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Overview' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
      // Always show on subpages, on homepage show after scrolling down
      if (location.pathname === '/') {
        setIsVisible(scrollY > window.innerHeight * 0.1);
      } else {
        setIsVisible(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <>
      {/* ==================== DESKTOP LAYOUT ==================== */}

      {/* Unified Floating Glass Header (Desktop) */}
      <motion.header
        className="fixed top-6 inset-x-6 mx-auto max-w-5xl z-50 hidden md:flex h-14 items-center justify-between bg-card/85 backdrop-blur-md border border-border/60 rounded-xl px-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        initial={{ y: -100, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Left Side: Logo */}
        <Link
          to="/"
          className="font-bold text-base text-foreground tracking-tight hover:text-primary transition-colors cursor-pointer select-none"
        >
          Ghufron A.N.
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 bg-secondary/30 p-1 rounded-lg border border-border/10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-1.5 font-mono text-xs font-semibold rounded-md transition-colors duration-300 ${
                  isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-card rounded-md shadow-sm border border-border/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/resume"
            className="border border-border/80 hover:border-primary text-foreground text-xs font-mono font-semibold px-4 py-1.5 rounded-md transition-all bg-secondary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Resume
          </Link>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* ==================== MOBILE LAYOUT ==================== */}

      {/* Floating Mobile Header - Closed State */}
      <motion.header
        className="fixed top-4 inset-x-4 z-50 md:hidden h-14 bg-card/85 backdrop-blur-lg border border-border/50 rounded-xl px-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
        initial={{ y: -100, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-sm text-foreground tracking-tight pl-1 hover:text-primary transition-colors"
        >
          Ghufron A.N.
        </Link>

        {/* Custom Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="group flex flex-col gap-1.5 items-end justify-center w-10 h-10 text-foreground rounded-md hover:bg-secondary/80 active:bg-secondary/60 transition-colors pr-1"
          aria-label="Open menu"
        >
          <span className="w-5 h-[1.5px] bg-foreground transition-all duration-300 group-hover:bg-primary" />
          <span className="w-3 h-[1.5px] bg-foreground transition-all duration-300 group-hover:w-5 group-hover:bg-primary" />
        </button>
      </motion.header>

      {/* Premium Full-Screen Overlay Menu (Drawer when open) */}
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
                className="text-foreground p-2 hover:bg-secondary rounded-md transition-colors border border-transparent hover:border-border/40"
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
                  className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="w-6 h-6" strokeWidth={1.5} />
                </a>
                <a
                  href="https://www.linkedin.com/in/ghufronainunnajib/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" strokeWidth={1.5} />
                </a>
                <a
                  href="mailto:ghufrnainunajib@gmail.com"
                  className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6" strokeWidth={1.5} />
                </a>
              </div>

              {/* Resume Button */}
              <Link
                to="/resume"
                className="border border-border hover:border-primary text-foreground text-sm font-mono px-8 py-3 rounded-md transition-all bg-secondary/30"
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
