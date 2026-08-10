import { ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactCTAProps {
  onGetInTouch: () => void;
}

const springEase = [0.32, 0.72, 0, 1];

export function ContactCTA({ onGetInTouch }: ContactCTAProps) {
  return (
    <section className="relative bg-transparent py-24 md:py-32 border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div 
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: springEase }}
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Let's work together
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 text-foreground leading-[1.05]">
            Have a role or project in mind?
          </h2>

          <p className="text-xl text-muted-foreground mb-10 text-wrap-pretty max-w-2xl leading-relaxed">
            Tell me what you're building or where I could help.
          </p>

          <button
            onClick={onGetInTouch}
            className="group inline-flex items-center gap-3 glass-pill text-foreground px-8 py-4 rounded-full font-bold text-sm md:text-base tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Start a Conversation
            <ArrowRight className="w-5 h-5 transition-transform duration-500 ease-out-spring group-hover:translate-x-1.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
