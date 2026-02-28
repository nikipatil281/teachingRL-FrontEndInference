export const calculateDemand = (price, weather, nearbyEvent, day, competitorPresent, competitorPrice) => {
    let demand = 120; // Base baseline

    // 1. Weather impacts
    if (weather === 'Hot') {
        demand -= 10; // Softened penalty so it doesn't instantly zero out
    } else if (weather === 'Sunny') {
        demand += 10;
    } else if (weather === 'Cloudy') {
        demand += 30;
    } else if (weather === 'Rainy') {
        demand += 60; // Huge boost for hot drinks on cold/rainy days
    }

    // 2. Events always boost foot traffic
    if (nearbyEvent) demand += 40;

    // 3. Weekends have slightly more relaxed customers
    if (day === 'Saturday' || day === 'Sunday') demand += 20;

    // 4. Price Elasticity (Strict linear relationship)
    // Higher price strictly means fewer customers
    demand -= (price * 15);

    // Prevent negative intermediate demand before competitor multipliers
    demand = Math.max(0, demand);

    // 5. Competitor interaction
    // This is what the RL agent must learn to navigate implicitly
    if (competitorPresent && competitorPrice) {
        if (price < competitorPrice - 0.50) {
            // Significant undercut: steal customers
            demand *= 1.6;
        } else if (price <= competitorPrice) {
            // Slight undercut or match
            demand *= 1.2;
        } else if (price > competitorPrice + 1.00) {
            // Very expensive: lose almost everyone
            demand *= 0.1;
        } else if (price > competitorPrice) {
            // Slightly expensive: lose core customers
            demand *= 0.6;
        }
    }

    // Ensure demand is non-negative and integer
    return Math.max(0, Math.floor(demand));
};

export const calculateSales = (demand, inventory) => {
    return Math.min(demand, inventory);
};

// Generate repeatable but "random" specific conditions
export const generateDailyConditions = (dayNumber) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = days[(dayNumber - 1) % 7];

    // Predictable semi-random weather sequence to ensure all states are hit
    const weatherPattern = ['Sunny', 'Cloudy', 'Rainy', 'Hot', 'Sunny', 'Rainy', 'Cloudy'];
    const weather = weatherPattern[(dayNumber - 1) % 7];

    // Event pattern: fixed to Friday/Saturday to ensure perfect 7-day looping (seen 4x a month)
    const nearbyEvent = dayName === 'Friday' || dayName === 'Saturday';

    // Competitor: Absent early week, present late week, perfectly repeating.
    const competitorPresent = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(dayName);

    // Competitor Price Logic (Strictly Deterministic Rule-Based)
    // This is what the RL Agent will learn to exploit without seeing the code.
    let competitorPrice = null;
    if (competitorPresent) {
        if (weather === 'Rainy') {
            // Competitor knows demand is high, so they charge more to maximize profit
            competitorPrice = 5.50;
        } else if (weather === 'Hot') {
            // Competitor knows demand is low, desperately lowers price to get any sales
            competitorPrice = 3.00;
        } else if (weather === 'Cloudy') {
            competitorPrice = 4.50;
        } else {
            // Sunny
            competitorPrice = 4.00;
        }

        // Competitor bumps price slightly on weekends
        if (dayName === 'Saturday' || dayName === 'Sunday') {
            competitorPrice += 0.50;
        }
    }

    return {
        day: dayName,
        weather,
        nearbyEvent,
        competitorPresent,
        competitorPrice
    };
};

export const generateMainGameConditions = (dayNumber) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = days[(dayNumber - 1) % 7];

    // Follow the 7-day pattern from Tutorial.jsx
    const weatherPattern = ['Sunny', 'Sunny', 'Cloudy', 'Rainy', 'Rainy', 'Sunny', 'Rainy'];
    const weather = weatherPattern[(dayNumber - 1) % 7];

    // Events follow tutorial pattern (Tue and Sat)
    const eventPattern = [false, true, false, false, false, true, false];
    const nearbyEvent = eventPattern[(dayNumber - 1) % 7];

    // Competitor enters the market on Day 4 and stays.
    let competitorPresent = dayNumber >= 4;
    let competitorPrice = null;
    let specialEvent = null;

    if (competitorPresent) {
        // 15% chance competitor is closed for random reasons
        const isClosed = Math.random() < 0.15;

        if (isClosed) {
            competitorPresent = false;
            const excuses = [
                "Competitor electricity out.",
                "Competitor barista unwell.",
                "Competitor espresso machine broke.",
                "Competitor closed for private event."
            ];
            specialEvent = excuses[Math.floor(Math.random() * excuses.length)];
        } else {
            // Competitor Price Logic (Deterministic Rule-Based so agent can still learn it)
            if (weather === 'Rainy') {
                competitorPrice = 5.50; // High demand, charge more
            } else if (weather === 'Hot') {
                competitorPrice = 3.00; // Low demand, desperation price
            } else if (weather === 'Cloudy') {
                competitorPrice = 4.50;
            } else {
                competitorPrice = 4.00; // Sunny
            }

            // Margin bump on weekends
            if (dayName === 'Saturday' || dayName === 'Sunday') {
                competitorPrice += 0.50;
            }
        }
    }

    return {
        day: dayName,
        weather,
        nearbyEvent,
        competitorPresent,
        competitorPrice,
        specialEvent
    };
};

export const calculateReward = (dailyProfit, remainingInventory, dayName, playerPrice, competitorPresent, competitorPrice) => {
    let rewardPoints = 0;

    // 1. Normalized Profit Base
    // E.g., $250 profit = +5.0 Points
    rewardPoints += (dailyProfit / 50);

    // 2. Inventory Margin Bounds
    // Mon-Wed: > 500
    // Thu-Fri: 300 - 500
    // Sat-Sun: 100 - 300
    if (remainingInventory <= 0) {
        rewardPoints -= 5.0; // Critical stockout penalty
    } else {
        if (['Monday', 'Tuesday', 'Wednesday'].includes(dayName)) {
            if (remainingInventory > 500) rewardPoints += 2.0;
            else rewardPoints -= 1.0;
        } else if (['Thursday', 'Friday'].includes(dayName)) {
            if (remainingInventory >= 300 && remainingInventory <= 500) rewardPoints += 2.0;
            else rewardPoints -= 1.0;
        } else if (['Saturday', 'Sunday'].includes(dayName)) {
            if (remainingInventory >= 100 && remainingInventory <= 300) rewardPoints += 2.0;
            else rewardPoints -= 1.0;
        }
    }

    // 3. Competitor Dominance
    if (competitorPresent && competitorPrice) {
        const diff = competitorPrice - playerPrice;
        if (diff >= 0 && diff <= 0.50) {
            // Optimal Undercut / Match (Sweet Spot)
            rewardPoints += 3.0;
        } else if (playerPrice > competitorPrice + 1.00) {
            // Hubris Penalty (Priced out of relevance)
            rewardPoints -= 3.0;
        }
    }

    // 4. End-of-Week Waste (Sunday Spoilage)
    if (dayName === 'Sunday' && remainingInventory > 100) {
        rewardPoints -= (remainingInventory / 50);
    }

    return rewardPoints;
};
