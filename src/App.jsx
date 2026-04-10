import React, { useEffect, useMemo, useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Tutorial from './components/Tutorial';
import Dashboard from './components/Dashboard';
import TransitionPhase from './components/TransitionPhase';
import PrePhaselTransition from './components/PrePhase1Transition';
import Phase1Instructions from './components/Phase1Instructions';
import PrePhase2Transition from './components/PrePhase2Transition';
import { initPriceSuggestionLookup } from './logic/PriceSuggestionLookup';

const ACTIVE_MODEL_PHASES = new Set([
  'pre-tutorial',
  'orientation-instructions',
  'tutorial',
  'pre-simulation',
  'transition',
  'simulation',
]);

const initialBackendState = {
  ml: { ready: false, state: 'idle' },
  rl: { ready: false, state: 'idle' },
};

function App() {
  const [phase, setPhase] = useState('login');
  const [theme, setTheme] = useState('theme-black-coffee');
  const [shopName, setShopName] = useState('You');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('Leo');
  const [backendStatus, setBackendStatus] = useState(initialBackendState);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const shouldManageModels = useMemo(
    () => ACTIVE_MODEL_PHASES.has(phase) && !simulationComplete,
    [phase, simulationComplete]
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'theme-black-coffee' ? 'theme-latte' : 'theme-black-coffee'));
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
    setSimulationComplete(false);
    setPhase('pre-simulation');
  };

  const handleExitToLogin = () => {
    setShopName('You');
    setUserName('');
    setUserAvatar('Leo');
    setSimulationComplete(false);
    setPhase('login');
  };

  useEffect(() => {
    if (!shouldManageModels) return undefined;

    let cancelled = false;
    const warmupModels = async () => {
      setBackendStatus((current) => ({
        ml: current.ml.ready ? current.ml : { ready: false, state: 'warming' },
        rl: current.rl.ready ? current.rl : { ready: false, state: 'warming' },
      }));

      const suggestionsReady = await initPriceSuggestionLookup();

      if (cancelled) return;

      setBackendStatus({
        ml: {
          ready: suggestionsReady,
          state: suggestionsReady ? 'ready' : 'offline',
        },
        rl: {
          ready: suggestionsReady,
          state: suggestionsReady ? 'ready' : 'offline',
        },
      });
    };

    warmupModels();

    return () => {
      cancelled = true;
    };
  }, [phase, shouldManageModels]);

  return (
    <div className={`App ${theme}`}>
      {phase === 'login' && <Login onJoin={handleJoin} theme={theme} toggleTheme={toggleTheme} shopName={shopName} userName={userName} />}
      {phase === 'landing' && <LandingPage onComplete={(avatar) => { setUserAvatar(avatar || 'Leo'); setPhase('pre-tutorial'); }} theme={theme} toggleTheme={toggleTheme} />}
      {phase === 'pre-tutorial' && <PrePhaselTransition onComplete={() => setPhase('orientation-instructions')} onBackToStory={() => setPhase('landing')} theme={theme} />}
      {phase === 'orientation-instructions' && <Phase1Instructions onComplete={() => setPhase('tutorial')} theme={theme} toggleTheme={toggleTheme} />}
      {phase === 'tutorial' && (
        <Tutorial
          onComplete={() => setPhase('pre-simulation')}
          theme={theme}
          toggleTheme={toggleTheme}
          shopName={shopName}
          userName={userName}
          userAvatar={userAvatar}
          backendStatus={backendStatus}
        />
      )}
      {phase === 'pre-simulation' && (
        <PrePhase2Transition
          onComplete={() => {
            setPhase('transition');
          }}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      {phase === 'transition' && (
        <TransitionPhase
          onComplete={() => setPhase('simulation')}
          theme={theme}
        />
      )}
      {phase === 'simulation' && (
        <Dashboard
          theme={theme}
          toggleTheme={toggleTheme}
          shopName={shopName}
          userName={userName}
          userAvatar={userAvatar}
          onRestart={handleRestart}
          onExitToLogin={handleExitToLogin}
          backendStatus={backendStatus}
          onSimulationComplete={() => setSimulationComplete(true)}
        />
      )}
    </div>
  );
}

export default App;
