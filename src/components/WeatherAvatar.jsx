import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherAvatar = ({ weather }) => {
    const isSunny = weather === 'Sunny';
    const isHotOrSunny = isSunny;
    const isRainy = weather === 'Rainy';
    const isCloudy = weather === 'Cloudy';

    return (
        <div className="relative w-full h-48 bg-coffee-800/50 rounded-xl border border-coffee-700/50 flex items-end justify-center overflow-hidden">
            {/* Dynamic Background based on weather */}
            <AnimatePresence>
                {isHotOrSunny && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-transparent to-amber-500/10 pointer-events-none"
                    />
                )}
                {isRainy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500/10 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* The 3D-styled DOM Avatar */}
            <div className="relative z-10 w-24 h-40 flex flex-col items-center justify-end mb-4">

                {/* Bobbing Container */}
                <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex flex-col items-center z-10"
                >
                    {/* Head */}
                    <motion.div
                        animate={{ rotate: isHotOrSunny ? [-3, 3, -3] : 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-14 h-14 bg-coffee-200 rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.2),_4px_4px_8px_rgba(0,0,0,0.3)] z-20 flex justify-center items-center"
                    >
                        {/* Eyes */}
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 bg-coffee-900 rounded-full shadow-inner" />
                            <div className="w-1.5 h-1.5 bg-coffee-900 rounded-full shadow-inner" />
                        </div>
                        {/* Sweating Animation for Hot/Sunny */}
                        <AnimatePresence>
                            {isHotOrSunny && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: [0, 1, 0], y: [0, 15, 20] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                    className="absolute right-1 top-2 w-2.5 h-4 bg-blue-300 rounded-full blur-[1px] opacity-70"
                                    style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Torso Container (Provides joint anchors) */}
                    <div className="relative w-3.5 h-[64px] bg-coffee-300 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),_2px_2px_4px_rgba(0,0,0,0.3)] z-10 -mt-2">

                        {/* Left Arm (Fanning if hot) */}
                        <motion.div
                            style={{ transformOrigin: "right center" }}
                            animate={{ rotate: isHotOrSunny ? [30, 80, 30] : 15 }}
                            transition={{
                                duration: isHotOrSunny ? 0.3 : 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute top-2 right-[90%] w-10 h-3 bg-coffee-300 rounded-full shadow-md z-0 flex items-center justify-start"
                        >
                            {isHotOrSunny && (
                                <div className="absolute -left-5 -top-3 text-2xl opacity-50 drop-shadow-sm">💨</div>
                            )}
                        </motion.div>

                        {/* Right Arm (Holding Umbrella if Rainy) */}
                        <motion.div
                            style={{ transformOrigin: "left center" }}
                            animate={{ rotate: isRainy ? -120 : -15 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="absolute top-2 left-[90%] w-10 h-3 bg-coffee-300 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),_2px_2px_4px_rgba(0,0,0,0.3)] z-20 flex items-center"
                        >
                            <AnimatePresence>
                                {isRainy && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute left-[80%] bottom-0 flex flex-col items-center origin-bottom"
                                    >
                                        {/* Umbrella Canopy */}
                                        <div className="w-40 h-16 bg-blue-500 rounded-t-[100px] shadow-xl overflow-hidden relative z-10 border-b-4 border-coffee-900/40">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                        {/* Umbrella handle directly connected to the hand */}
                                        <div className="w-1.5 h-12 bg-coffee-700 -mt-1 shadow-md z-0 rounded-full" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Legs */}
                        <div className="absolute top-[90%] left-1/2 -translate-x-1/2 flex justify-between w-10 z-0">
                            <div className="w-3 h-[50px] bg-coffee-400 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2)] origin-top rotate-[20deg] translate-y-1 -translate-x-1" />
                            <div className="w-3 h-[50px] bg-coffee-400 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2)] origin-top -rotate-[20deg] translate-y-1 translate-x-1" />
                        </div>
                    </div>
                </motion.div>

                {/* Floor shadow */}
                <div className="absolute bottom-1 w-20 h-2.5 bg-black/20 rounded-full blur-[2px] z-0" />
            </div>

            {/* Decorative environment elements based on weather */}
            <AnimatePresence>
                {isSunny && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0, transition: { duration: 0.4 } }}
                        className="absolute top-4 right-4 text-4xl drop-shadow-lg"
                    >
                        ☀️
                    </motion.div>
                )}
                {isCloudy && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.8, x: [-10, 10, -10] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.4 } }}
                        className="absolute top-6 left-6 text-4xl drop-shadow-md"
                    >
                        ☁️
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WeatherAvatar;
