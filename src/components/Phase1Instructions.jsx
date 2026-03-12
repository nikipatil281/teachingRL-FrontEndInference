import React from 'react';
import { motion } from 'framer-motion';
import { Target, Info, ChevronRight, Sun, Moon } from 'lucide-react';

const Phase1Instructions = ({ onComplete, theme, toggleTheme }) => {
  return (
    <div className={`min-h-screen bg-coffee-900 text-coffee-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden transition-colors duration-500 ${theme}`}>

      {/* Header / Theme Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 bg-coffee-800/50 hover:bg-amber-500 hover:text-coffee-900 rounded-full border border-coffee-700/50 transition-all text-coffee-200 shadow-xl backdrop-blur-md"
        >
          {theme === 'theme-latte' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </button>
      </div>

      {/* Background Decor */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${theme === 'theme-black-coffee' ? 'opacity-40 mix-blend-screen' : 'opacity-40 mix-blend-color-burn'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-900/40 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[120px] animate-blob [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-[100px] animate-slow-spin opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-4xl bg-coffee-950/50 backdrop-blur-xl border border-coffee-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center relative"
      >
        {/* Placeholder for Screenshot */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full aspect-video bg-coffee-900/50 rounded-2xl flex items-center justify-center mb-12 border border-coffee-800 border-dashed relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50" />
          <p className="text-coffee-400 font-mono text-sm italic z-10 px-6">
            (the annotated screenshot of the tutorial dashboard will be added here)
          </p>
        </motion.div>

        {/* Custom Styled Button Wrapper */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <style>
            {`
                        .Btn {
                          --amber-400: #fbbf24;
                          --amber-500: #f59e0b;
                          --amber-600: #d97706;
                          --coffee-950: #0c0a09;
                          
                          display: flex;
                          align-items: center;
                          justify-content: flex-start;
                          width: 45px;
                          height: 45px;
                          border: none;
                          border-radius: 12px;
                          cursor: pointer;
                          position: relative;
                          overflow: hidden;
                          transition-duration: .4s;
                          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                          background-color: var(--amber-500);
                        }

                        /* arrow sign */
                        .sign {
                          width: 100%;
                          transition-duration: .4s;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        }

                        .sign svg {
                          width: 18px;
                          fill: var(--coffee-950) !important;
                        }

                        /* text */
                        .text {
                          position: absolute;
                          right: 0%;
                          width: 0%;
                          opacity: 0;
                          color: var(--coffee-950) !important;
                          font-size: 1.05rem;
                          font-weight: 900;
                          transition-duration: .4s;
                          white-space: nowrap;
                          text-transform: uppercase;
                          letter-spacing: 0.025em;
                        }
                        /* hover effect on button width */
                        .Btn:hover {
                          width: 500px;
                          border-radius: 12px;
                          transition-duration: .4s;
                          background-color: var(--amber-400);
                          box-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
                        }

                        .Btn:hover .sign {
                          width: 12%;
                          transition-duration: .4s;
                          padding-left: 15px;
                        }
                        /* hover effect button's text */
                        .Btn:hover .text {
                          opacity: 1;
                          width: 88%;
                          transition-duration: .4s;
                          padding-right: 15px;
                          display: flex;
                          justify-content: center;
                        }
                        /* button click effect*/
                        .Btn:active {
                          transform: scale(0.95);
                          transition-duration: .1s;
                        }
                        `}
          </style>
          <button className="Btn" onClick={onComplete}>
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M334.5 414c8.8 3.8 19 2 25.8-4.8l144-144c6.2-6.2 6.2-16.4 0-22.6l-144-144c-6.9-6.9-17.2-8.7-25.8-4.8s-14.3 12.5-14.3 22.1v72H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h288.2v72c0 9.6 5.7 18.2 14.3 22.1z" />
              </svg>
            </div>
            <div className="text">Understood! Take me to the Orientation!</div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Phase1Instructions;
