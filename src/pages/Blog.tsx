import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="px-6 pb-20 pt-28 md:px-12 md:pt-36 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Writing Log
          </p>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Coming Soon
          </h1>
          <div className="mt-10 rounded-[2rem] border border-border/60 bg-card p-6 sm:p-10">
            <Calendar className="size-8 text-primary" strokeWidth={1.5} />
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              I'm preparing short notes on web development, system design, and lessons from shipping real projects.
            </p>
            <Button asChild variant="glass" className="mt-8 px-6 py-3 h-auto text-xs font-bold uppercase tracking-widest">
              <Link to="/projects" className="flex items-center gap-2">
                View Case Studies
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
