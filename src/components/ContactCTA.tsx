import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ContactCTAProps {
  onGetInTouch: () => void;
}

export function ContactCTA({ onGetInTouch }: ContactCTAProps) {
  return (
    <section className="py-32 md:py-40 relative bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Massive Headline */}
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Let's build something epic.
          </h2>

          {/* Massive Button */}
          <motion.button
            onClick={onGetInTouch}
            className="inline-flex items-center gap-3 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a Conversation
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
