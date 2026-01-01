import { Github, Linkedin, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ContactModal } from './ContactModal';
import { ContactCTA } from './ContactCTA';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
];

const socialLinks = [
  { href: 'https://github.com/Ghufrnainun', icon: Github, label: 'GitHub' },
  {
    href: 'https://www.linkedin.com/in/ghufronainun-najib/',
    icon: Linkedin,
    label: 'LinkedIn',
  },
  { href: 'mailto:ghufrnainunajib@gmail.com', icon: Mail, label: 'Email' },
];

interface FooterProps {
  showCTA?: boolean;
}

export function Footer({ showCTA = true }: FooterProps) {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isAtBottom && !hasShownOnce) {
        setShowEasterEgg(true);
        setHasShownOnce(true);

        setTimeout(() => {
          setShowEasterEgg(false);
        }, 3000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShownOnce]);

  return (
    <>
      <footer className="relative bg-background">
        {/* PART 1: The CTA (Mic Drop) - Only on landing page */}
        {showCTA && (
          <ContactCTA onGetInTouch={() => setIsContactModalOpen(true)} />
        )}

        {/* PART 2: Utility Footer */}
        <div className="border-t border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Column 1: Identity */}
              <div className="md:col-span-1">
                <a href="#" className="inline-block group mb-4">
                  <h3 className="text-xl font-bold tracking-tight">
                    Ghufron <span className="text-gray-400">Ainun Najib</span>
                  </h3>
                </a>
                <p className="text-gray-500 text-sm font-mono">
                  Engineering systems, not just interfaces.
                </p>
              </div>

              {/* Column 2: Navigation */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider mb-4 text-gray-600">
                  Navigation
                </h4>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="font-mono text-sm hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Connect */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider mb-4 text-gray-600">
                  Connect
                </h4>
                <ul className="space-y-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Status */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider mb-4 text-gray-600">
                  Status
                </h4>
                <div className="flex items-center gap-2">
                  {/* Pulsing green dot */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="font-mono text-sm">
                    Open for opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PART 3: Copyright Bar */}
        <div className="border-t border-gray-900">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 font-mono">
                © 2026 Ghufron Ainun Najib.
              </p>
              <p className="text-sm text-gray-600 font-mono">
                Built with React & Tailwind.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Easter Egg */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl p-6 shadow-2xl max-w-md mx-4 pointer-events-auto font-mono"
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                <span>// easter_egg.ts</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-4 border border-border">
                <pre className="text-sm text-left">
                  <code>
                    <span className="text-muted-foreground">const</span>{' '}
                    <span className="text-foreground">visitor</span> = {'{'}"
                    {'\n'} scrolledToBottom:{' '}
                    <span className="text-muted-foreground">true</span>,{'\n'}{' '}
                    status: <span className="text-green-400">"awesome"</span>,
                    {'\n'} action:{' '}
                    <span className="text-green-400">"hire_me()"</span>
                    {'\n'}
                    {'}'};
                  </code>
                </pre>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                <span className="text-primary font-bold">Tip:</span> Press{' '}
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-foreground border border-border">
                  G
                </kbd>
                {' + '}
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-foreground border border-border">
                  A
                </kbd>{' '}
                to visit GitHub
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </>
  );
}
