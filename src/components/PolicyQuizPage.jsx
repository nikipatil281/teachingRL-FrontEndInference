import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardCheck, Sun, Moon } from 'lucide-react';

const PolicyQuizPage = ({ theme, toggleTheme, onBackToPolicyReview }) => {
  const [policyLearned, setPolicyLearned] = useState('');
  const [quizDay, setQuizDay] = useState('Monday');
  const [quizWeather, setQuizWeather] = useState('Sunny');
  const [quizTraffic, setQuizTraffic] = useState('normal with no events');
  const [quizCompetitor, setQuizCompetitor] = useState('absent');
  const [quizCompetitorPrice, setQuizCompetitorPrice] = useState('');
  const [quizOptimalPrice, setQuizOptimalPrice] = useState('');

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weatherOptions = ['Sunny', 'Cloudy', 'Rainy'];
  const trafficOptions = ['normal with no events', 'high due to a nearby event'];

  return (
    <div className={`min-h-screen bg-coffee-950 text-coffee-100 p-4 md:p-8 flex flex-col items-center animate-in fade-in duration-500 overflow-y-auto ${theme}`}>
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToPolicyReview}
          className="flex items-center gap-2 text-coffee-300 hover:text-white transition-colors bg-coffee-800/50 hover:bg-coffee-700/50 px-4 py-2 rounded-lg border border-coffee-700/50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Policy Review
        </motion.button>

        <button
          onClick={toggleTheme}
          className="p-2 bg-coffee-800/50 hover:bg-amber-500 hover:text-coffee-900 rounded-full border border-coffee-700/50 transition-all text-coffee-200"
        >
          {theme === 'theme-latte' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-5xl bg-coffee-900 p-6 md:p-8 rounded-2xl border border-coffee-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardCheck className="w-8 h-8 text-amber-400" />
          <h2 className="text-3xl font-bold text-coffee-100">Optional Policy Quiz</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-coffee-400 mb-2">
              What is one policy that you learned?
            </label>
            <input
              type="text"
              value={policyLearned}
              onChange={(e) => setPolicyLearned(e.target.value)}
              placeholder="Example: Lower prices on rainy days when competitor is present."
              className="w-full bg-coffee-950 border border-coffee-700 rounded-lg px-3 py-2 text-sm text-coffee-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <select value={quizDay} onChange={(e) => setQuizDay(e.target.value)} className="bg-coffee-950 border border-coffee-700 rounded-lg px-3 py-2 text-sm text-coffee-100 focus:outline-none focus:border-amber-500">
              {weekDays.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={quizWeather} onChange={(e) => setQuizWeather(e.target.value)} className="bg-coffee-950 border border-coffee-700 rounded-lg px-3 py-2 text-sm text-coffee-100 focus:outline-none focus:border-amber-500">
              {weatherOptions.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
            <select value={quizTraffic} onChange={(e) => setQuizTraffic(e.target.value)} className="bg-coffee-950 border border-coffee-700 rounded-lg px-3 py-2 text-sm text-coffee-100 focus:outline-none focus:border-amber-500">
              {trafficOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={quizCompetitor} onChange={(e) => setQuizCompetitor(e.target.value)} className="bg-coffee-950 border border-coffee-700 rounded-lg px-3 py-2 text-sm text-coffee-100 focus:outline-none focus:border-amber-500">
              <option value="absent">competitor absent</option>
              <option value="present">competitor present</option>
            </select>
          </div>

          <div className="bg-coffee-950/60 border border-coffee-700 rounded-lg p-4 text-sm text-coffee-100 leading-relaxed">
            For a <span className="text-amber-400 font-bold">{quizDay}</span>, when the weather is <span className="text-amber-400 font-bold">{quizWeather}</span>, the market traffic is <span className="text-amber-400 font-bold">{quizTraffic}</span> and the competitor is{' '}
            {quizCompetitor === 'present' ? (
              <>
                <span className="text-red-400 font-bold">present</span> with a price of $
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="10"
                  value={quizCompetitorPrice}
                  onChange={(e) => setQuizCompetitorPrice(e.target.value)}
                  placeholder="__"
                  className="mx-1 w-20 bg-coffee-900 border border-coffee-700 rounded px-2 py-1 text-coffee-100 focus:outline-none focus:border-amber-500"
                />
                : the optimal price of coffee for that day is $
              </>
            ) : (
              <>
                <span className="text-emerald-400 font-bold">absent</span>: the optimal price of coffee for that day is $
              </>
            )}
            <input
              type="number"
              step="0.5"
              min="1"
              max="10"
              value={quizOptimalPrice}
              onChange={(e) => setQuizOptimalPrice(e.target.value)}
              placeholder="__"
              className="mx-1 w-20 bg-coffee-900 border border-coffee-700 rounded px-2 py-1 text-coffee-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyQuizPage;
