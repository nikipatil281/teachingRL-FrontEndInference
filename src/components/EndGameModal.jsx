import React, { useState, useMemo, useRef } from 'react';
import { Trophy, RotateCcw, BarChart3, TrendingUp, Presentation, Lightbulb, ArrowRight, TableProperties, Sun, Moon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import RevenueChart from './RevenueChart';

const EndGameModal = ({ isOpen, onRestart, history, theme, toggleTheme, shopName = "You", userName = "", onBackToWeeklyReport, onShowPolicyPage }) => {
    if (!isOpen || !history || history.length < 2) return null;

    const finalRecord = history[history.length - 1];
    const {
        playerRevenue, mlRevenue, rlRevenue, competitorRevenue,
        playerTotalSales, mlTotalSales, rlTotalSales, competitorTotalSales
    } = finalRecord;

    // Since penalties are calculated weekly, we sum them up across the entire history
    const totalPlayerPenalty = history.reduce((sum, r) => sum + (r.playerPenalty || 0), 0);
    const totalMlPenalty = history.reduce((sum, r) => sum + (r.mlPenalty || 0), 0);
    const totalRlPenalty = history.reduce((sum, r) => sum + (r.rlPenalty || 0), 0);
    const totalCompPenalty = history.reduce((sum, r) => sum + (r.competitorPenalty || 0), 0);

    // Calculate total starting stock over 4 weeks
    const totalCupsStock = 4000;

    // Calculate raw left-over cups at the very end
    const playerRemaining = totalCupsStock - playerTotalSales;
    const mlRemaining = totalCupsStock - mlTotalSales;
    const rlRemaining = totalCupsStock - rlTotalSales;
    const compRemaining = totalCupsStock - competitorTotalSales;

    const winner = playerRevenue > rlRevenue && playerRevenue > mlRevenue ? shopName : (rlRevenue > mlRevenue ? 'RL Agent' : 'ML Agent');
    const delta = Math.abs(playerRevenue - rlRevenue).toFixed(2);

    const getFeedback = () => {
        if (winner === shopName) {
            return "Outstanding execution! You intuitively grasped the market shock dynamics better than the mathematical models. You perfectly balanced undercutting the competitor without sacrificing margins on high-demand days.";
        }
        if (winner === 'RL Agent') {
            return `The RL Agent outperformed you by $${delta}. The RL agent's pre-trained policy allowed it to aggressively slash prices on Rainy/Cloudy days to steal vital market share, while maximizing margins during local events. Try to be more fluid with your pricing next time!`;
        }
        return `The ML Agent outperformed you! It relied on static linear weights, which means you might have been pricing too emotionally or inconsistently. Keep an eye on the baseline weather multipliers during the simulation.`;
    };
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden ${theme}`}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-coffee-900 text-coffee-100 border border-coffee-700/50 p-1 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl relative flex flex-col"
            >
                <div className="absolute inset-0 pointer-events-none bg-amber-900 bg-doodle-mask opacity-[0.05] mix-blend-luminosity z-0" />

                <div className="relative z-10 p-8 flex flex-col items-center w-full">

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="absolute top-4 right-4 p-3 bg-coffee-800 hover:bg-amber-500 hover:text-coffee-900 rounded-full border border-coffee-700 transition-all text-coffee-200"
                    >
                        {theme === 'theme-latte' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                    </button>

                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-4">
                        {/* Player */}
                        <div className={`p-4 rounded-xl border ${winner === shopName ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-500' : 'bg-coffee-800/50 border-coffee-700'}`}>
                            <div className={`text-sm font-bold mb-1 text-center truncate ${winner === shopName ? 'text-amber-600 dark:text-amber-500' : 'text-amber-500'}`} title={shopName}>{shopName}</div>
                            <div className={`text-3xl font-mono font-bold text-center mb-2 ${winner === shopName ? 'text-amber-600 dark:text-amber-400' : 'text-coffee-100'}`}>${playerRevenue.toFixed(0)}</div>
                            <div className="text-xs text-coffee-500 dark:text-coffee-300 text-center mb-2">{playerTotalSales} cups sold</div>
                            <div className="text-[10px] text-red-600 dark:text-red-400 font-mono bg-red-100/50 dark:bg-red-950/30 rounded py-1 px-2 border border-red-200 dark:border-red-900/50 flex flex-col items-center">
                                <span>Cups wasted = {playerRemaining}</span>
                                <span>Penalty for wastage = -${totalPlayerPenalty.toFixed(2)}</span>
                            </div>
                        </div>
                        {/* ML */}
                        <div className={`p-4 rounded-xl border ${winner === 'ML Agent' ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-500' : 'bg-coffee-800/50 border-coffee-700'}`}>
                            <div className={`text-sm font-bold mb-1 text-center ${winner === 'ML Agent' ? 'text-blue-700 dark:text-blue-400' : 'text-blue-400'}`}>ML Agent</div>
                            <div className={`text-3xl font-mono font-bold text-center mb-2 ${winner === 'ML Agent' ? 'text-blue-700 dark:text-blue-400' : 'text-coffee-100'}`}>${mlRevenue.toFixed(0)}</div>
                            <div className="text-xs text-coffee-500 dark:text-coffee-300 text-center mb-2">{mlTotalSales} cups sold</div>
                            <div className="text-[10px] text-red-600 dark:text-red-400 font-mono bg-red-100/50 dark:bg-red-950/30 rounded py-1 px-2 border border-red-200 dark:border-red-900/50 flex flex-col items-center">
                                <span>Cups wasted = {mlRemaining}</span>
                                <span>Penalty for wastage = -${totalMlPenalty.toFixed(2)}</span>
                            </div>
                        </div>
                        {/* RL */}
                        <div className={`p-4 rounded-xl border relative overflow-hidden ${winner === 'RL Agent' ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-500' : 'bg-coffee-800/50 border-coffee-700'}`}>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                            <div className={`text-sm font-bold mb-1 text-center ${winner === 'RL Agent' ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-400'}`}>RL Agent</div>
                            <div className={`text-3xl font-mono font-bold text-center mb-2 ${winner === 'RL Agent' ? 'text-emerald-700 dark:text-emerald-400' : 'text-coffee-100'}`}>${rlRevenue.toFixed(0)}</div>
                            <div className="text-xs text-coffee-500 dark:text-coffee-300 text-center mb-2">{rlTotalSales} cups sold</div>
                            <div className="text-[10px] text-red-600 dark:text-red-400 font-mono bg-red-100/50 dark:bg-red-950/30 rounded py-1 px-2 border border-red-200 dark:border-red-900/50 flex flex-col items-center">
                                <span>Cups wasted = {rlRemaining}</span>
                                <span>Penalty for wastage = -${totalRlPenalty.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* RL Feedback */}
                    <div className="bg-coffee-800/50 p-4 rounded-xl border border-coffee-700/50 backdrop-blur-sm w-full mb-4 text-left">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-coffee-100">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            Performance Analysis
                        </h3>
                        <p className="text-coffee-300 text-sm leading-relaxed">
                            {getFeedback()}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onShowPolicyPage(true)}
                            className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 text-base"
                        >
                            Look at the Policy Table
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onBackToWeeklyReport}
                            className="bg-coffee-700 hover:bg-coffee-600 text-coffee-100 font-bold py-3 px-8 rounded-xl border border-coffee-600 transition-all flex items-center gap-2 text-base"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                            Back to Week 4 Report
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onRestart}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3 text-base"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Run Simulation Again
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EndGameModal;
