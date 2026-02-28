import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherEffects = ({ weather }) => {
  const isRainy = weather === 'Rainy';
  const isCloudy = weather === 'Cloudy';

  // Generate deterministic rain drops based on weather state
  const rainDrops = useMemo(() => {
    if (!isRainy) return [];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.5,
      size: Math.random() > 0.5 ? 'small' : 'large'
    }));
  }, [isRainy]);

  // Generate deterministic clouds
  const clouds = useMemo(() => {
    if (!isCloudy && !isRainy) return [];
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 30}%`,
      left: `${(i / 5) * 100}%`,
      scale: 0.5 + Math.random() * 1.5,
      duration: 20 + Math.random() * 40,
      delay: Math.random() * -20 // start midway
    }));
  }, [isCloudy, isRainy]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {/* Cloudy / Rainy Background Layers */}
        {(isCloudy || isRainy) && (
          <motion.div
            key="weather-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className={`absolute inset-0 transition-colors duration-1000 ${isRainy ? 'bg-blue-900/5 dark:bg-blue-900/10' : 'bg-slate-400/10 dark:bg-slate-500/5'}`}
          />
        )}

        {/* Global Clouds */}
        {(isCloudy || isRainy) && clouds.map((cloud) => (
          <motion.div
            key={`cloud-${cloud.id}`}
            initial={{ opacity: 0, x: '-10%' }}
            animate={{ opacity: 1, x: ['-20%', '120%'] }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
            transition={{ 
                duration: cloud.duration, 
                repeat: Infinity, 
                ease: 'linear',
                delay: cloud.delay 
            }}
            style={{ 
                top: cloud.top, 
                left: cloud.left, 
                scale: cloud.scale 
            }}
            className="absolute z-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-48 h-48 drop-shadow-2xl blur-[2px] ${isRainy ? 'text-coffee-200/50 dark:text-slate-300/40' : 'text-coffee-300/40 dark:text-white/40'}`}>
              <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" clipRule="evenodd" />
            </svg>
          </motion.div>
        ))}

        {/* Rain Particles */}
        {isRainy && rainDrops.map((drop) => (
          <motion.div
            key={`drop-${drop.id}`}
            initial={{ y: '-10vh', opacity: 0 }}
            animate={{ y: '110vh', opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: drop.delay
            }}
            style={{ left: drop.left }}
            className={`absolute w-0.5 bg-blue-600/80 dark:bg-blue-400/80 rounded-full blur-[0.5px] ${drop.size === 'large' ? 'h-10' : 'h-6'}`}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WeatherEffects;
