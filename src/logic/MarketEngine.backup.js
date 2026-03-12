import marketStates from '../../market_states.json' with { type: 'json' };

// Pre-calculated schedule for the 28-day simulation
let mainGameSchedule = null;

const LOCAL_EVENTS = [
    "Music Concert",
    "Movie Screening",
    "Carnival",
    "Food Fest",
    "Local Marathon",
    "Street Fair",
    "Art Exhibition"
];

const getRandomEventName = () => LOCAL_EVENTS[Math.floor(Math.random() * LOCAL_EVENTS.length)];

const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

export const initMainGameSchedule = (forceReset = false) => {
    if (mainGameSchedule && !forceReset) return mainGameSchedule;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const statesByDay = {};
    days.forEach(d => {
        statesByDay[d] = marketStates.filter(s => s['Day of the week'] === d);
    });

    let validSchedule = false;
    let attempts = 0;
    let newSchedule = new Array(28);

    while (!validSchedule && attempts < 100) {
        attempts++;
        const chosenPairs = {};

        // For each day of the week, pick 2 states and repeat each twice
        days.forEach(dayName => {
            const available = statesByDay[dayName];
            const idx1 = Math.floor(Math.random() * available.length);
            let idx2 = Math.floor(Math.random() * available.length);
            while (idx2 === idx1) idx2 = Math.floor(Math.random() * available.length);

            const states = [available[idx1], available[idx1], available[idx2], available[idx2]];
            chosenPairs[dayName] = shuffleArray(states);
        });

        // Fill the 28-day schedule
        for (let i = 0; i < 28; i++) {
            const dayName = days[i % 7];
            const weekIdx = Math.floor(i / 7);
            newSchedule[i] = { ...chosenPairs[dayName][weekIdx], dayNumber: i + 1 };
        }

        // Validate constraints per week
        let allWeeksValid = true;
        for (let w = 0; w < 4; w++) {
            const weekSlice = newSchedule.slice(w * 7, (w + 1) * 7);
            const compCount = weekSlice.filter(s => s.Competitor.toLowerCase() === 'yes').length;
            const eventCount = weekSlice.filter(s => s.Event.toLowerCase() === 'yes').length;

            if (compCount < 3 || eventCount < 1) {
                allWeeksValid = false;
                break;
            }
        }

        if (allWeeksValid) {
            validSchedule = true;
        }
    }

    mainGameSchedule = newSchedule;
    return mainGameSchedule;
};

export const calculateDemand = (price, weather, nearbyEvent, day, competitorPresent, competitorPrice, yesterdayPrice = null) => {
    let demand = 120; // Base baseline

    // 1. Weather impacts
    const w = weather.toLowerCase();
    if (w === 'rainy') {
        demand += 30;
    } else if (w === 'cloudy') {
        demand += 60; // High demand for hot coffee
    } else if (w === 'sunny') {
        demand += 10;
    }

    // 2. Events always boost foot traffic
    if (nearbyEvent) demand += 50;

    // 3. Weekends
    if (day === 'Saturday' || day === 'Sunday') {
        demand += 20;
    }

    // 3.5. Base Price Effect
    if (price > 6) {
        demand -= (price - 6) * 50;
    }

    // 4. Yesterday's price impact
    if (yesterdayPrice !== null && yesterdayPrice !== undefined) {
        if (price > yesterdayPrice) {
            demand -= (Math.floor(Math.random() * 2) + 1); // 1-2 people less
        } else if (price < yesterdayPrice) {
            demand += (Math.floor(Math.random() * 2) + 1); // 1-2 people more
        }
    }

    // Prevent negative intermediate demand before competitor multipliers
    demand = Math.max(0, demand);

    // 6. Competitor interaction
    if (competitorPresent && competitorPrice) {
        const diff = price - competitorPrice;
        if (diff > 0) {
            const lossPerDollar = Math.floor(Math.random() * 6) + 10;
            demand -= (diff * lossPerDollar);
        } else if (diff < 0) {
            const gainPerDollar = Math.floor(Math.random() * 6) + 10;
            demand += (Math.abs(diff) * gainPerDollar);
        }
    }

    return Math.max(0, Math.floor(demand));
};

export const calculateSales = (demand, inventory) => {
    return Math.min(demand, inventory);
};

export const generateDailyConditions = (dayNumber) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = days[(dayNumber - 1) % 7];
    const weatherPattern = ['Sunny', 'Cloudy', 'Rainy', 'Sunny', 'Sunny', 'Rainy', 'Cloudy'];
    const weather = weatherPattern[(dayNumber - 1) % 7];
    const nearbyEvent = dayName === 'Friday' || dayName === 'Saturday';
    const competitorPresent = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(dayName);

    let competitorPrice = null;
    if (competitorPresent) {
        const w = weather.toLowerCase();
        if (w === 'rainy') {
            competitorPrice = [4.50, 5.00, 5.50][Math.floor(Math.random() * 3)];
        } else if (w === 'cloudy') {
            competitorPrice = [5.50, 6.00, 6.50][Math.floor(Math.random() * 3)];
        } else if (w === 'sunny') {
            competitorPrice = [4.00, 4.50, 5.00][Math.floor(Math.random() * 3)];
        } else {
            competitorPrice = 4.00;
        }

        if (dayName === 'Saturday' || dayName === 'Sunday') competitorPrice += [0.50, 1.00][Math.floor(Math.random() * 2)];
        if (nearbyEvent) competitorPrice += [0.50, 1.00][Math.floor(Math.random() * 2)];
    }

    const eventName = nearbyEvent ? getRandomEventName() : null;

    return { day: dayName, weather, nearbyEvent, eventName, competitorPresent, competitorPrice };
};

export const generateMainGameConditions = (dayNumber) => {
    const schedule = initMainGameSchedule();
    const state = schedule[dayNumber - 1];

    // Map Competitor Price if needed (it wasn't in the JSON, we should generate it if Competitor is "yes")
    let competitorPrice = null;
    if (state.Competitor.toLowerCase() === 'yes') {
        const w = state.Weather.toLowerCase();
        if (w === 'rainy') {
            competitorPrice = [4.50, 5.00, 5.50][Math.floor(Math.random() * 3)];
        } else if (w === 'cloudy') {
            competitorPrice = [5.50, 6.00, 6.50][Math.floor(Math.random() * 3)];
        } else {
            competitorPrice = [4.00, 4.50, 5.00][Math.floor(Math.random() * 3)];
        }

        if (state['Day of the week'] === 'Saturday' || state['Day of the week'] === 'Sunday') {
            competitorPrice += [0.50, 1.00][Math.floor(Math.random() * 2)];
        }
        if (state.Event.toLowerCase() === 'yes') {
            competitorPrice += [0.50, 1.00][Math.floor(Math.random() * 2)];
        }
    }

    return {
        day: state['Day of the week'],
        weather: state.Weather.charAt(0).toUpperCase() + state.Weather.slice(1),
        nearbyEvent: state.Event.toLowerCase() === 'yes',
        competitorPresent: state.Competitor.toLowerCase() === 'yes',
        competitorPrice,
        eventName: state.Event.toLowerCase() === 'yes' ? getRandomEventName() : null,
        specialEvent: null, // We can add back random excuses if desired, but user didn't ask
        stateId: state.Weather + state.Event + state.Competitor + state['Day of the week'] // Include day for specific matching
    };
};

export const calculateReward = (dailyProfit, remainingInventory, dayName, playerPrice, competitorPresent, competitorPrice, yesterdayPrice, weather, nearbyEvent) => {
    let totalScore = 0;
    let rewardPoints = 0;
    let penaltyPoints = 0;
    
    const state = marketStates.find(s =>
        s.Weather.toLowerCase() === weather.toLowerCase() &&
        s.Event.toLowerCase() === (nearbyEvent ? 'yes' : 'no') &&
        s.Competitor.toLowerCase() === (competitorPresent ? 'yes' : 'no') &&
        s['Day of the week'] === dayName
    );

    if (state && state.Rewards) {
        const profit = dailyProfit / 20.0;
        const inventory = remainingInventory;
        const price = playerPrice;
        const competitor_price = competitorPrice || 0;
        const yesterday_price = yesterdayPrice || 4.50;

        // Extract components from the Rewards formula string if possible
        // The formulas follow patterns like: profit + (inv_penalty) + (comp_penalty) + (yesterday_penalty)
        // For simplicity and accuracy, we will evaluate the discrete parts if we can identify them, 
        // OR we can calculate the total and then identify which parts were negative.
        // However, a more robust way is to just define the logic here to match the JSON patterns.
        
        // 1. Profit component (always positive or zero for this part)
        rewardPoints += Math.max(0, profit);
        
        // 2. Inventory component
        // (inventory > 800 ? 10 : inventory <= 0 ? -25 : 0)
        let invComp = 0;
        if (inventory > 800) invComp = 10;
        else if (inventory <= 0) invComp = -25;
        
        if (invComp > 0) rewardPoints += invComp;
        else penaltyPoints += Math.abs(invComp);

        // 3. Competitor component
        // (price - competitor_price >= -0.50 && price - competitor_price <= 0 ? 15 : price - competitor_price < -0.50 ? 5 : price - competitor_price > 0.50 ? -15 : 0)
        let compComp = 0;
        if (competitorPresent) {
            const diff = price - competitor_price;
            if (diff >= -0.50 && diff <= 0) compComp = 15;
            else if (diff < -0.50) compComp = 5;
            else if (diff > 0.50) compComp = -15;
        }
        
        if (compComp > 0) rewardPoints += compComp;
        else penaltyPoints += Math.abs(compComp);

        // 4. Yesterday price component
        // (price <= yesterday_price ? 5 : 0)
        let yestateComp = (price <= yesterday_price ? 5 : 0);
        rewardPoints += yestateComp;

        totalScore = rewardPoints - penaltyPoints;
    } else {
        totalScore = dailyProfit;
        rewardPoints = dailyProfit;
        penaltyPoints = 0;
    }

    return {
        total: parseFloat(totalScore.toFixed(2)),
        rewardPoints: parseFloat(rewardPoints.toFixed(2)),
        penaltyPoints: parseFloat(penaltyPoints.toFixed(2))
    };
};

