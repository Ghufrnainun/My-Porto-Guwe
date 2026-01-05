import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/ui/Logo';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Sequence duration
    const timer1 = setTimeout(() => setCurrentStep(1), 1600); // Wait for draw
    const timer2 = setTimeout(() => setCurrentStep(2), 2200); // Wait for fill/finish

    const completeTimer = setTimeout(() => {
      if (onLoadingComplete) onLoadingComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background">
      <div className="relative flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: currentStep === 2 ? 0 : 1,
            scale: currentStep === 2 ? 1.2 : 1,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="relative"
        >
          <Logo className="w-24 h-24 text-primary" animated={true} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: currentStep >= 1 && currentStep < 2 ? 1 : 0,
            y: currentStep >= 1 && currentStep < 2 ? 0 : 10,
          }}
          transition={{ duration: 0.5 }}
          className="absolute -bottom-12 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase"
        >
          Loading
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
