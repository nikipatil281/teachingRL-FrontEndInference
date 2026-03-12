import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-coffee-800 p-3 border border-coffee-700 rounded-lg shadow-xl text-sm z-50 min-w-[220px]">
        <p className="text-coffee-200 font-bold mb-2">{label}</p>
        {payload.map((entry, index) => {
          // Standard tooltip logic for You, ML Agent, RL Agent, and Competitor
          const isPlayer = entry.dataKey === 'playerRevenue';
          const prefix = entry.dataKey.replace('Revenue', '');
          const dailyRev = entry.payload[`${prefix}DailyRevenue`] || 0;
          const dailySales = entry.payload[`${prefix}Sales`] || 0;
          const totalSales = entry.payload[`${prefix}TotalSales`] || 0;

          // Calculate missed opportunity (Cumulative What-If vs RL)
          let missedOpportunity = 0;
          if (isPlayer && entry.payload.rlRevenue > entry.value) {
            missedOpportunity = entry.payload.rlRevenue - entry.value;
          }

          // Fetch potential overnight penalties applied that day
          const penalty = entry.payload[`${prefix}Penalty`] || 0;

          return (
            <div key={index} className="mb-3 last:mb-0 border-b last:border-0 border-coffee-700 pb-2 last:pb-0">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span style={{ color: entry.color }} className="font-bold">
                  {entry.name}
                </span>
                <span className="text-coffee-100 font-mono">
                  ${entry.value.toFixed(0)} <span className="text-xs text-coffee-500">(Total)</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-coffee-400">
                <div className="flex justify-between">
                  <span>Daily Rev:</span>
                  <span className="text-coffee-200">${dailyRev.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>sold on this day:</span>
                  <span className="text-coffee-200">{dailySales}</span>
                </div>

                <div className="flex justify-between col-span-2 border-t border-coffee-700 mt-1 pt-1">
                  <span>Total Sold:</span>
                  <span className="text-coffee-200">{totalSales} units</span>
                </div>

                {/* Interactive What-If Analysis */}
                {missedOpportunity > 0 && (
                  <div className="flex justify-between col-span-2 mt-1 bg-red-900/30 p-1 px-2 rounded border border-red-500/30 items-center">
                    <span className="text-red-400 font-bold italic">Missed Opportunity (vs RL):</span>
                    <span className="text-red-400 font-mono font-bold">-${missedOpportunity.toFixed(2)}</span>
                  </div>
                )}

                {/* Explicit Restock or Storage Penalties */}
                {penalty > 0 && (
                  <div className="flex justify-between col-span-2 mt-1 bg-orange-900/30 p-1 px-2 rounded border border-orange-500/30 items-center">
                    <span className="text-orange-400 font-bold italic">Penalty/Cost Applied:</span>
                    <span className="text-orange-400 font-mono font-bold">-${penalty.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data, showRLAgents = true, shopName = "You" }) => {
  return (
    <div className="bg-coffee-800 p-6 rounded-xl border border-coffee-700 shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-coffee-100 flex items-center gap-2">
        <span>📈</span> Revenue Ledger
      </h2>

      <div className="flex-grow min-h-0 flex flex-col">
        <div className="flex-1 w-full min-h-[150px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} label={{ value: 'Day', position: 'insideBottom', offset: -15, fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', offset: 0, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={50} wrapperStyle={{ paddingBottom: '30px' }} />
              <Line
                type="monotone"
                dataKey="playerRevenue"
                name={shopName}
                stroke="#f59e0b"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
              {showRLAgents && (
                <>
                  <Line
                    type="monotone"
                    dataKey="mlRevenue"
                    name="ML Agent"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="rlRevenue"
                    name="RL Agent"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </>
              )}
              <Line
                type="monotone"
                dataKey="competitorRevenue"
                name="Competitor (vs You)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-coffee-700/50">
        <div className="text-center space-y-2">
          <p className="text-sm font-mono text-coffee-100 bg-emerald-500/10 inline-block px-3 py-1 rounded border border-emerald-500/30">
            Revenue = Price × min(Demand, Inventory)
          </p>
          <p className="text-xs text-coffee-500">
            * Comparison of cumulative daily revenue
          </p>
          {showRLAgents && (
            <p className="text-xs text-emerald-500/80 max-w-lg mx-auto leading-relaxed pt-2">
              * <strong>RL Agent</strong> revenue also represents the potential earnings you could have generated if you had perfectly followed its pricing suggestions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
