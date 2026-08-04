import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Globe, Calendar } from 'lucide-react';

export function AboutPreview() {
  return (
    <section id="about" className="relative bg-transparent py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Layout: Marginalia (Left Column Stats, Right Column Content) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Left Column: Stats */}
          <div className="md:col-span-3 flex flex-row md:flex-col gap-8 border-t md:border-t-0 border-border md:border-r pt-8 md:pt-0 md:pr-8">
            <div className="flex gap-4">
              <div className="text-primary mt-1">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">Location</p>
                <p className="text-sm font-medium text-foreground">Semarang, ID</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-primary mt-1">
                <Globe className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">Status</p>
                <p className="text-sm font-medium text-foreground">Open to Work</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-primary mt-1">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">Experience</p>
                <p className="text-sm font-medium text-foreground">1+ Years</p>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-9 lg:col-span-8 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground leading-[1.05] tracking-tight text-wrap-pretty">
                Backend logic that <span className="text-primary font-medium">scales.</span> Frontend interfaces that <span className="text-muted-foreground/80 font-medium">feel alive.</span>
              </h2>
              <div className="prose prose-lg text-muted-foreground/90 leading-relaxed font-sans max-w-2xl text-wrap-pretty">
                <p className="mb-6 text-base md:text-lg">
                  I build full-stack applications from Semarang, Indonesia. Instead of settling for defaults, I focus on the micro-interactions and performance details that make software feel tactile and responsive.
                </p>
                <p className="text-base md:text-lg">
                  Currently leading a 5-person team to ship the official certification platform for my polytechnic. I write pragmatic code—prioritizing maintainable architecture over chasing the latest trends.
                </p>
              </div>
            </div>

            <div>
              <Link to="/about" className="group inline-flex items-center gap-3 text-sm font-semibold font-display text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                <span className="border-b border-primary/20 group-hover:border-primary transition-all pb-1">
                  Read full story
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
