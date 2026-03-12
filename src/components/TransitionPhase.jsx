import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

const TransitionPhase = ({ onComplete, theme }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds transition

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`min-h-screen bg-coffee-900 text-coffee-100 flex flex-col items-center justify-center relative overflow-y-auto transition-colors duration-500 ${theme}`}>
      {/* Doodle Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-amber-900 bg-doodle-mask opacity-[0.15] mix-blend-luminosity z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 bg-amber-500/20 rounded-full mb-6"
        >
          <Coffee className="w-16 h-16 text-amber-500" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Time for the main Simulation!
        </h1>
        <p className="text-coffee-300 text-lg md:text-xl font-medium">
          Get ready to work alongside the Reinforcement Learning algorithm...
        </p>
      </motion.div>

      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-color-burn">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/30 rounded-full blur-[150px] animate-blob" />
      </div>
    </div>
  );
};

export default TransitionPhase;
