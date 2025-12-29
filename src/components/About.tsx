import { MapPin, GraduationCap, Heart } from 'lucide-react';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const infoItems = [
  { icon: MapPin, text: 'Semarang, Indonesia' },
  { icon: GraduationCap, text: 'Computer Engineering' },
  { icon: Heart, text: 'Open to Opportunities' },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      className="py-24 md:py-32 relative overflow-hidden bg-background"
    >
      <ParallaxBackground variant="dots" />
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div ref={ref} className="max-w-4xl mx-auto relative z-10">
          {/* Section Header - matches Hero typography */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              About Me
            </h2>
            <p className="text-lg text-muted-foreground">
              Developer • Student • Problem Solver
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Avatar */}
            <motion.div
              className="lg:col-span-3 flex lg:justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces"
                  alt="Profile photo"
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-primary/20"
                />
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              className="lg:col-span-9"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                {[
                  'I build web applications that people actually use — from certification platforms to election systems. Focused on Laravel back-end, React front-end, and MySQL databases.',
                  "Currently leading a 5-person dev team for my polytechnic's certification website. I handle Git architecture, auth modules, and make sure we ship on time.",
                  'Also active in campus organizations — managing websites, running social media, and doing tech support. Still a student, but already solving real problems with code.',
                ].map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>

              {/* Quick Info Badges */}
              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                {infoItems.map((item, index) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
