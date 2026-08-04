import { ArrowRight } from 'lucide-react';

interface ContactCTAProps {
  onGetInTouch: () => void;
}

export function ContactCTA({ onGetInTouch }: ContactCTAProps) {
  return (
    <section className="relative bg-transparent py-24 md:py-32 border-t border-border/40">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Work With Me
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-10 text-foreground leading-[1.05]">
            Ready to build something that works?
          </h2>

          <button
            onClick={onGetInTouch}
            className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-bold text-sm md:text-base uppercase tracking-widest transition-[transform,shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
          >
            Start a Conversation
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
