import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Tutorial from './components/Tutorial';
import Dashboard from './components/Dashboard';
import TransitionPhase from './components/TransitionPhase'; // Added Import
import PrePhase1Transition from './components/PrePhase1Transition';
import PrePhase2Transition from './components/PrePhase2Transition';

function App() {
  const [phase, setPhase] = useState('login'); // 'login', 'landing', 'pre-tutorial', 'tutorial', 'transition', 'simulation'
  const [theme, setTheme] = useState('theme-black-coffee'); // 'theme-black-coffee' or 'theme-latte'
  const [shopName, setShopName] = useState('You'); // Default shop name
  const [userName, setUserName] = useState('');
  const [gameConfig, setGameConfig] = useState({
    weather: true,
    event: true,
    competitor: true
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'theme-black-coffee' ? 'theme-latte' : 'theme-black-coffee');
  };

  const handleJoin = (sName, uName) => {
    if (sName && sName.trim()) {
      setShopName(sName.trim());
    }
    if (uName && uName.trim()) {
      setUserName(uName.trim());
    }
    setPhase('landing');
  };

  const handleRestart = () => {
    setPhase('login');
  };

  return (
    <div className={`App ${theme}`}>
      {phase === 'login' && <Login onJoin={handleJoin} theme={theme} toggleTheme={toggleTheme} shopName={shopName} userName={userName} />}
      {phase === 'landing' && <LandingPage onComplete={() => setPhase('pre-tutorial')} theme={theme} toggleTheme={toggleTheme} />}
      {phase === 'pre-tutorial' && <PrePhase1Transition onComplete={() => setPhase('tutorial')} theme={theme} />}
      {phase === 'tutorial' && <Tutorial onComplete={() => setPhase('pre-simulation')} theme={theme} toggleTheme={toggleTheme} shopName={shopName} userName={userName} />}
      {phase === 'pre-simulation' && <PrePhase2Transition onComplete={(config) => {
        if (config) setGameConfig(config);
        setPhase('transition');
      }} theme={theme} />}
      {phase === 'transition' && <TransitionPhase onComplete={() => setPhase('simulation')} theme={theme} />}
      {phase === 'simulation' && <Dashboard theme={theme} toggleTheme={toggleTheme} shopName={shopName} userName={userName} gameConfig={gameConfig} onRestart={handleRestart} />}
    </div>
  );
}

export default App;
