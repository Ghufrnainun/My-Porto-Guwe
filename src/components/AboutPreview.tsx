import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Globe, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const springEase = [0.32, 0.72, 0, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: springEase }
  },
};

export function AboutPreview() {
  return (
    <section id="about" className="relative bg-transparent py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Left Column: Stats */}
          <div className="md:col-span-3 flex flex-row md:flex-col gap-8 border-t md:border-t-0 border-border md:border-r pt-8 md:pt-0 md:pr-8">
            <motion.div variants={itemVariants} className="flex gap-4 group cursor-default">
              <div className="text-primary mt-1 transition-transform duration-500 ease-out-spring group-hover:scale-125 group-hover:rotate-12">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1 transition-colors group-hover:text-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">Semarang, ID</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4 group cursor-default">
              <div className="text-primary mt-1 transition-transform duration-500 ease-out-spring group-hover:scale-125 group-hover:rotate-12">
                <Globe className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1 transition-colors group-hover:text-foreground">Status</p>
                <p className="text-sm font-medium text-foreground">Open to Work</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4 group cursor-default">
              <div className="text-primary mt-1 transition-transform duration-500 ease-out-spring group-hover:scale-125 group-hover:rotate-12">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1 transition-colors group-hover:text-foreground">Experience</p>
                <p className="text-sm font-medium text-foreground">1+ Years</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-9 lg:col-span-8 flex flex-col justify-center">
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground leading-[1.05] tracking-tight text-wrap-pretty">
                Backend logic that <span className="text-primary font-medium">scales.</span> Frontend interfaces that <span className="text-muted-foreground/80 font-medium">feel alive.</span>
              </h2>
              <div className="prose prose-lg text-muted-foreground/90 leading-relaxed font-sans max-w-2xl text-wrap-pretty">
                <p className="mb-6 text-base md:text-lg">
                  I build full-stack applications from Semarang, Indonesia. I refuse to settle for defaults—focusing instead on the micro-interactions and performance details that make software feel physical, tactile, and instantly responsive.
                </p>
                <p className="text-base md:text-lg">
                  Currently leading a 5-person team to ship the official certification platform for my polytechnic. I write pragmatic code—prioritizing maintainable architecture over chasing the latest trends.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/about" className="group inline-flex items-center gap-3 text-sm font-semibold font-display text-primary hover:text-primary/80 transition-colors uppercase tracking-widest bg-primary/5 px-5 py-2.5 rounded-full border border-primary/20 hover:border-primary/50 hover:bg-primary/10 active:scale-95">
                <span>
                  Read full story
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
