import fs from 'node:fs/promises';
import path from 'node:path';
import {
  initMainGameSchedule,
  generateMainGameConditions,
  calculateDemand,
  calculateSales,
  calculateDailyProfit,
  calculateWeekWastagePenalty,
  getNormalizedPrice,
  WEEKLY_START_INVENTORY
} from '../src/logic/MarketEngine.js';

const DAY_MAP = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6
};

const WEATHER_MAP = {
  Sunny: 0,
  Cloudy: 1,
  Rainy: 2
};

const CSV_PATH = path.resolve(process.cwd(), '..', 'rl_28_day_simulation_results.csv');

const escapeCsv = (value) => {
  const str = value === null || value === undefined ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
};

const getStateSignature = (s) => {
  const comp = s.competitorPresent ? s.competitorPrice : 'NA';
  return `${s.day}-${s.weather}-${s.nearbyEvent ? 1 : 0}-${s.competitorPresent ? 1 : 0}-${comp}`;
};

const verifyScheduleConstraints = (schedule) => {
  const dayCounts = {};
  const perDayStates = {};

  for (const s of schedule) {
    dayCounts[s.day] = (dayCounts[s.day] || 0) + 1;
    if (!perDayStates[s.day]) perDayStates[s.day] = {};
    const sig = getStateSignature(s);
    perDayStates[s.day][sig] = (perDayStates[s.day][sig] || 0) + 1;
  }

  const exactFourEachDay = Object.values(dayCounts).every((count) => count === 4);

  const repeatedStatePerDay = Object.values(perDayStates).every((countsObj) =>
    Object.values(countsObj).some((count) => count >= 2)
  );

  const weeklyChecks = [];
  let weeklyOk = true;
  for (let week = 0; week < 4; week++) {
    const slice = schedule.slice(week * 7, (week + 1) * 7);
    const competitorDays = slice.filter((s) => s.competitorPresent).length;
    const eventDays = slice.filter((s) => s.nearbyEvent).length;
    const ok = competitorDays >= 3 && eventDays >= 1;
    weeklyChecks.push({ week: week + 1, competitorDays, eventDays, ok });
    if (!ok) weeklyOk = false;
  }

  return {
    exactFourEachDay,
    repeatedStatePerDay,
    weeklyOk,
    weeklyChecks,
    overall: exactFourEachDay && repeatedStatePerDay && weeklyOk
  };
};

async function getRlPrice(conditions, dayNumber, inventory, yesterdayPrice) {
  const payload = {
    day_of_week: DAY_MAP[conditions.day] ?? 0,
    day_number: dayNumber,
    weather: WEATHER_MAP[conditions.weather] ?? 0,
    inventory,
    nearby_event: conditions.nearbyEvent ? 1 : 0,
    competitor_present: conditions.competitorPresent ? 1 : 0,
    competitor_price: conditions.competitorPrice || 0,
    yesterday_price: yesterdayPrice
  };

  try {
    const response = await fetch('http://127.0.0.1:5001/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return { price: getNormalizedPrice(Number(data.suggested_price)), source: 'backend' };
  } catch {
    return { price: 5, source: 'fallback' };
  }
}

async function main() {
  const schedule = initMainGameSchedule(true);
  const constraints = verifyScheduleConstraints(schedule);

  if (!constraints.overall) {
    throw new Error(`Schedule constraints failed: ${JSON.stringify(constraints)}`);
  }

  let inventory = WEEKLY_START_INVENTORY;
  let yesterdayRlPrice = 5;
  let totalCumulativeProfit = 0;
  let weeklyCumulativeProfit = 0;

  const rows = [];
  const sourceCount = { backend: 0, fallback: 0 };

  for (let day = 1; day <= 28; day++) {
    const conditions = generateMainGameConditions(day);
    const weekNumber = Math.floor((day - 1) / 7) + 1;

    const rl = await getRlPrice(conditions, day, inventory, yesterdayRlPrice);
    sourceCount[rl.source] += 1;

    const demand = calculateDemand(
      rl.price,
      conditions.weather,
      conditions.nearbyEvent,
      conditions.day,
      conditions.competitorPresent,
      conditions.competitorPrice
    );

    const sales = calculateSales(demand, inventory);
    const profitBreakdown = calculateDailyProfit(sales, rl.price, conditions.day);

    let sundayWastagePenalty = 0;
    const inventoryEndBeforeReset = inventory - sales;

    if (day % 7 === 0) {
      sundayWastagePenalty = calculateWeekWastagePenalty(inventoryEndBeforeReset);
    }

    const dailyNetProfit = profitBreakdown.netProfit - sundayWastagePenalty;

    totalCumulativeProfit += dailyNetProfit;
    weeklyCumulativeProfit += dailyNetProfit;

    rows.push({
      dayNumber: day,
      weekNumber,
      dayOfWeek: conditions.day,
      weather: conditions.weather,
      nearbyEvent: conditions.nearbyEvent ? 1 : 0,
      eventName: conditions.eventName || '',
      competitorPresent: conditions.competitorPresent ? 1 : 0,
      competitorPrice: conditions.competitorPresent ? conditions.competitorPrice : '',
      scheduleStateId: conditions.stateId,
      inventoryStart: inventory,
      rlPrice: rl.price,
      source: rl.source,
      demand,
      sales,
      grossRevenue: profitBreakdown.gross,
      cogs: profitBreakdown.cogs,
      dailyLowSalesPenalty: profitBreakdown.penalty,
      sundayWastagePenalty,
      dailyNetProfit,
      weeklyCumulativeProfit,
      totalCumulativeProfit,
      inventoryEnd: inventoryEndBeforeReset
    });

    yesterdayRlPrice = rl.price;

    if (day % 7 === 0) {
      inventory = WEEKLY_START_INVENTORY;
      weeklyCumulativeProfit = 0;
    } else {
      inventory = inventoryEndBeforeReset;
    }
  }

  const header = Object.keys(rows[0]);
  const csvLines = [
    header.join(','),
    ...rows.map((row) => header.map((k) => escapeCsv(row[k])).join(','))
  ];

  await fs.writeFile(CSV_PATH, csvLines.join('\n') + '\n', 'utf8');

  console.log(`Saved CSV: ${CSV_PATH}`);
  console.log(`Source counts: backend=${sourceCount.backend}, fallback=${sourceCount.fallback}`);
  console.log(`Total cumulative profit: ${totalCumulativeProfit.toFixed(2)}`);
  console.log(`Schedule checks: ${JSON.stringify(constraints)}`);
}

main().catch((err) => {
  console.error('Simulation failed:', err.message || err);
  process.exit(1);
});
