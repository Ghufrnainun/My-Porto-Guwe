import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const socialLinks = [
  { href: 'https://github.com/Ghufrnainun', icon: Github, label: 'GitHub' },
  {
    href: 'https://linkedin.com/in/ghufronainun',
    icon: Linkedin,
    label: 'LinkedIn',
  },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'mailto:ghufrnainunajib@gmail.com', icon: Mail, label: 'Email' },
];

const quickLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  // { href: '/blog', label: 'Blog' }, // TODO: Enable when blog content is ready
  { href: '#contact', label: 'Contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  // Easter Egg C: Modal popup when scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // Check if scrolled to bottom
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      // Only show once per session
      if (isAtBottom && !hasShownOnce) {
        setShowEasterEgg(true);
        setHasShownOnce(true);

        // Auto-hide after 3 seconds
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
      <footer className="py-12 border-t border-border bg-card/50 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-gradient">Ghufron Ainun</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Fullstack Developer shipping production web apps with Laravel,
                React, and MySQL.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                    aria-label={link.label}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              © {currentYear} Ghufron Ainun. Made with
              <Heart className="h-4 w-4 text-destructive fill-current" />
              and lots of coffee.
            </p>
          </div>
        </div>
      </footer>

      {/* Easter Egg C: Modal Popup */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-primary/30 rounded-lg p-6 shadow-2xl max-w-md mx-4 pointer-events-auto font-mono"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="text-xs text-muted-foreground mb-2">
                // easter_egg.ts
              </div>
              <pre className="text-sm text-left">
                <code>
                  <span className="text-primary">const</span>{' '}
                  <span className="text-foreground">visitor</span> = {'{'}
                  {'\n'} scrolledToBottom:{' '}
                  <span className="text-primary">true</span>,{'\n'} status:{' '}
                  <span className="text-green-500">"awesome"</span>,{'\n'}{' '}
                  action: <span className="text-green-500">"hire_me()"</span>
                  {'\n'}
                  {'}'};
                </code>
              </pre>
              <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                <span className="text-primary">Tip:</span> Press{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">
                  G
                </kbd>
                {' + '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">
                  A
                </kbd>{' '}
                to visit GitHub
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
