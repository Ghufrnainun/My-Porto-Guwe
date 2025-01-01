import { ArrowDown, Github, Linkedin, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/FloatingParticles";
import { motion } from "framer-motion";

const roles = [
  "Fullstack Developer",
  "Laravel Specialist",
  "Tech Lead",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      <FloatingParticles />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            variants={itemVariants}
          >
            Hi, I'm{" "}
            <motion.span 
              className="text-gradient relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Ghufron Ainun Najib
              <span className="absolute -inset-1 bg-primary/20 blur-2xl rounded-lg -z-10" />
            </motion.span>
          </motion.h1>

          <motion.div className="mb-6" variants={itemVariants}>
            <p className="text-base md:text-lg text-primary font-medium">
              {roles.map((role, index) => (
                <span key={role}>
                  <motion.span 
                    className="hover:text-primary/80 transition-colors inline-block"
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {role}
                  </motion.span>
                  {index < roles.length - 1 && (
                    <span className="mx-2 md:mx-3 text-muted-foreground">|</span>
                  )}
                </span>
              ))}
            </p>
          </motion.div>

          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
            variants={itemVariants}
          >
            Shipping production web apps for real organizations using Laravel, React, and MySQL. 
            3rd-semester Computer Engineering student at Polines.
          </motion.p>

          <motion.div 
            className="flex flex-wrap gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <a href="#projects" className="flex items-center gap-2 relative z-10">
                  View My Work
                </a>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" asChild className="group hover:border-primary/50 transition-colors">
                <a href="/resume.pdf" download className="flex items-center gap-2">
                  <FileText className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Download Resume
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex justify-center gap-4"
            variants={itemVariants}
          >
            {[
              { icon: Github, href: "https://github.com/ghufronainun", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/ghufronainun", label: "LinkedIn" },
              { icon: Mail, href: "mailto:ghufrnainunajib@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }, index) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={floatingAnimation}
        >
          <a href="#about" className="group flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
