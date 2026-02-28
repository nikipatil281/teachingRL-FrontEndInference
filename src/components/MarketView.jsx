import React from 'react';
import { Sun, Cloud, CloudRain, Thermometer, Box, AlertTriangle, Users, Info, Lock } from 'lucide-react';

const WeatherIcon = ({ weather }) => {
  if (weather === 'Sunny') return <Sun className="w-8 h-8 text-yellow-500" />;
  if (weather === 'Cloudy') return <Cloud className="w-8 h-8 text-gray-400" />;
  if (weather === 'Rainy') return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (weather === 'Hot') return <Thermometer className="w-8 h-8 text-red-500" />;
  return <Sun className="w-8 h-8 text-yellow-500" />;
};

const MarketView = ({ day, weather, inventory, isDayEnd, nearbyEvent, competitorPresent, competitorPrice, specialEvent, gameConfig = { weather: true, event: true, competitor: true } }) => {
  return (
    <div className="bg-coffee-800 p-4 rounded-xl border border-coffee-700 shadow-xl relative overflow-hidden w-full">
      {/* Decor */}
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-coffee-300 flex items-center gap-2 relative z-10">
        <span className="text-lg">📅</span> Today's state
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Day & Weather */}
        <div className="flex items-center justify-between bg-coffee-700/50 p-2 px-3 rounded-lg border border-transparent">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-coffee-400 font-bold mb-1">Day and weather</div>
            <div className="text-md font-semibold text-coffee-200">{day}</div>
            <div className={`text-[10px] ${!gameConfig.weather ? 'text-coffee-600' : 'text-coffee-400'}`}>
              {!gameConfig.weather ? 'Sunny (Locked)' : weather}
            </div>
          </div>
          <div className="flex flex-col items-end relative">
            <div className={`${!gameConfig.weather ? 'opacity-30 mix-blend-luminosity' : ''}`}>
              {React.cloneElement(WeatherIcon({ weather: !gameConfig.weather ? 'Sunny' : weather }), { className: "w-8 h-8" })}
            </div>
            {!gameConfig.weather && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-5 h-5 text-coffee-500 opacity-80" />
              </div>
            )}
          </div>
        </div>

        {/* Inventory */}
        <div className={`flex items-center justify-between p-2 px-3 rounded-lg border ${inventory <= 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-coffee-700/50 border-transparent'}`}>
          <div className="flex flex-col">
            <div className="text-[10px] uppercase tracking-wider text-coffee-400 font-bold mb-1">Inventory</div>
            <div className={`text-lg font-mono font-bold ${inventory <= 0 ? 'text-red-500' : 'text-indigo-300'}`}>
              {inventory} <span className="text-xs text-coffee-500 font-normal">units</span>
            </div>
            <div className="text-[10px] text-coffee-400">{inventory <= 0 ? 'RESTOCK REQ' : (isDayEnd ? 'Remaining' : 'Opening')}</div>
          </div>
          <Box className={`w-8 h-8 ${inventory <= 0 ? 'text-red-400' : 'text-indigo-400'}`} />
        </div>

        {/* Competitor */}
        <div className={`p-2 px-3 rounded-lg border flex items-start justify-between transition-colors ${!gameConfig.competitor
          ? 'bg-coffee-800/80 border-coffee-700'
          : (competitorPresent || specialEvent)
            ? 'bg-red-900/10 border-red-500/50'
            : 'bg-emerald-900/10 border-emerald-500/20'
          }`}>
          <div className="flex flex-col">
            <div className="text-[10px] uppercase tracking-wider text-coffee-400 font-bold mb-1">Competition</div>
            <div className={`text-sm font-bold ${!gameConfig.competitor ? 'text-coffee-600' : (competitorPresent || specialEvent) ? 'text-red-600' : 'text-emerald-500'}`}>
              {!gameConfig.competitor ? 'Market Clear (Locked)' : competitorPresent ? `Competitor @ $${competitorPrice?.toFixed(2)}` : specialEvent ? 'Competitor Alert' : 'Market Clear'}
            </div>
            <div className={`text-[10px] mt-1 ${!gameConfig.competitor ? 'text-coffee-600' : 'text-coffee-400'}`}>
              {!gameConfig.competitor
                ? <span>No competition</span>
                : competitorPresent
                  ? <span>"BeanMean" is open</span>
                  : specialEvent
                    ? <span className="text-red-400/80 italic line-clamp-1">{specialEvent}</span>
                    : <span>No competition</span>
              }
            </div>
          </div>
          <div className="relative">
            <Users className={`w-8 h-8 ${!gameConfig.competitor ? 'text-emerald-500/10' : (competitorPresent || specialEvent) ? 'text-red-500' : 'text-emerald-500/40'}`} />
            {!gameConfig.competitor && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-5 h-5 text-coffee-500 opacity-80" />
              </div>
            )}
          </div>
        </div>

        {/* Event */}
        <div className={`p-2 px-3 rounded-lg border flex items-start justify-between ${!gameConfig.event ? 'bg-coffee-800/80 border-coffee-700' : nearbyEvent ? 'bg-amber-900/30 border-amber-700/50' : 'bg-coffee-700/50 border-transparent'}`}>
          <div className="flex flex-col">
            <div className="text-[10px] uppercase tracking-wider text-coffee-400 font-bold mb-1">Local Events</div>
            <div className={`text-sm font-bold ${!gameConfig.event ? 'text-coffee-600' : nearbyEvent ? 'text-amber-400' : 'text-coffee-400'}`}>
              {!gameConfig.event ? 'Quiet Street (Locked)' : nearbyEvent ? 'Event Detected!' : 'Quiet Street'}
            </div>
            <div className={`text-[10px] mt-1 ${!gameConfig.event ? 'text-coffee-600' : 'text-coffee-400'}`}>
              {!gameConfig.event ? 'Normal traffic levels' : nearbyEvent ? 'Higher traffic expected' : 'Normal traffic levels'}
            </div>
          </div>
          <div className="relative">
            <AlertTriangle className={`w-8 h-8 ${!gameConfig.event ? 'text-coffee-700' : nearbyEvent ? 'text-amber-500' : 'text-coffee-600'}`} />
            {!gameConfig.event && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-5 h-5 text-coffee-500 opacity-80" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketView;
