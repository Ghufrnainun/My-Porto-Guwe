import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ContactCTA } from './ContactCTA';
import { ContactModal } from './ContactModal';

interface FooterProps {
  showCTA?: boolean;
}

export function Footer({ showCTA = true }: FooterProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <footer className="relative bg-background">
        {showCTA && <ContactCTA onGetInTouch={() => setIsContactModalOpen(true)} />}

        <div className="container mx-auto px-6 py-12 md:px-12 lg:px-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-sm">
              <Link to="/" className="group inline-block mb-4">
                <h3 className="text-2xl font-serif font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Ghufron A.N.
                </h3>
              </Link>
              <p className="font-sans text-base text-muted-foreground leading-relaxed text-wrap-pretty">
                Engineering systems, not just interfaces. Based in Semarang, Indonesia.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono text-sm uppercase tracking-wider">
              <a href="https://github.com/Ghufrnainun" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors">
                GitHub <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="https://www.linkedin.com/in/ghufronainunnajib/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="mailto:ghufrnainunajib@gmail.com" className="group flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Email <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            <p>© {new Date().getFullYear()} Ghufron Ainun Najib.</p>
            <div className="flex items-center gap-2">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              <span>Available for new opportunities</span>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
    </>
  );
}
