import { MapPin, GraduationCap, Heart } from "lucide-react";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const infoItems = [
  { icon: MapPin, text: "Semarang, Indonesia" },
  { icon: GraduationCap, text: "Computer Engineering" },
  { icon: Heart, text: "Open to Opportunities" },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <ParallaxBackground variant="dots" />
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto relative z-10">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="relative">
              <motion.div 
                className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=faces"
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              {/* Decorative elements with animation */}
              <motion.div 
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-2xl -z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
              <motion.div 
                className="absolute -top-4 -left-4 w-24 h-24 border-2 border-primary/30 rounded-2xl -z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              About Me
            </motion.h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {[
                "I build web applications that people actually use — from certification platforms to election systems. Focused on Laravel back-end, React front-end, and MySQL databases.",
                "Currently leading a 5-person dev team for my polytechnic's certification website. I handle Git architecture, auth modules, and make sure we ship on time.",
                "Also active in campus organizations — managing websites, running social media, and doing tech support. Still a student, but already solving real problems with code."
              ].map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Quick Info */}
            <motion.div 
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
