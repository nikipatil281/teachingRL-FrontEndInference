import allVariablesOn from '../data/pricing_scenarios/all_variables_on.json';
import weatherCompetitorOn from '../data/pricing_scenarios/weather_competitor_on.json';
import eventCompetitorOn from '../data/pricing_scenarios/event_competitor_on.json';
import weatherEventOn from '../data/pricing_scenarios/weather_event_on.json';

class RLAgent {
  constructor() {
    this.epsilon = 0; // Exploring is handled directly in tutorial, main game is 100% exploit of optimal rules
  }

  // Parse strings like "competitor_price - 0.50" or "4.50" into actual floats
  _parsePrice(formulaStr, competitorPrice) {
    if (!formulaStr) return 4.50; // fallback

    let parsedString = formulaStr.toLowerCase().replace('competitor_price', competitorPrice || 0);

    let result = parseFloat(parsedString.trim());

    // Extremely basic math evaluator for "X.XX - Y.YY" or "X.XX + Y.YY"
    if (parsedString.includes('+')) {
      const parts = parsedString.split('+');
      result = parseFloat(parts[0].trim()) + parseFloat(parts[1].trim());
    } else if (parsedString.includes('-')) {
      // Handle negative numbers carefully if needed, though our formulas have positive bases
      const parts = parsedString.split('-');
      result = parseFloat(parts[0].trim()) - parseFloat(parts[1].trim());
    }

    return Math.max(1.00, result);
  }

  getAction(conditions, gameConfig) {
    let activeScenario = null;
    let matchId = "";

    // Determine which JSON file to use and build the ID string to search for
    if (gameConfig.weather && gameConfig.event && gameConfig.competitor) {
      activeScenario = allVariablesOn;
      matchId = `${conditions.weather.toLowerCase()}_${conditions.nearbyEvent ? 'yes' : 'no'}_${conditions.competitorPresent ? 'yes' : 'no'}`;
    } else if (gameConfig.weather && gameConfig.competitor) {
      activeScenario = weatherCompetitorOn;
      matchId = `${conditions.weather.toLowerCase()}_${conditions.competitorPresent ? 'yes' : 'no'}`;
    } else if (gameConfig.event && gameConfig.competitor) {
      activeScenario = eventCompetitorOn;
      matchId = `${conditions.nearbyEvent ? 'yes' : 'no'}_${conditions.competitorPresent ? 'yes' : 'no'}`;
    } else if (gameConfig.weather && gameConfig.event) {
      activeScenario = weatherEventOn;
      matchId = `${conditions.weather.toLowerCase()}_${conditions.nearbyEvent ? 'yes' : 'no'}`;
    }

    let chosenAction = 4.50; // Default safe price
    let foundState = null;

    if (activeScenario) {
      foundState = activeScenario.find(s => s.id === matchId);
    }

    if (foundState) {
      // Calculate the absolute numerical range bounds
      const minPrice = this._parsePrice(foundState.min_price, conditions.competitorPrice);
      const maxPrice = this._parsePrice(foundState.max_price, conditions.competitorPrice);

      // The ML agent is the "Vanilla/Baseline" AI. 
      // The RL Agent represents the "Perfect/Optimal" AI. 
      // To maximize profit, it generally wants to be near the optimal range's upper half if possible, 
      // without violating the demand multiplier cliffs.

      // As per the math derived from MarketEngine:
      // We will target the average of the optimal min and max, rounded to the nearest $0.50 interval.
      // Wait, for undercutting, we must STRICTLY hit the minPrice bound (which was engineered to trigger the multiplier).

      // Using `minPrice` directly acts as a perfect exploit path based on how the JSONs were engineered.
      chosenAction = minPrice;

      // Safety guardrails
      if (chosenAction < 1.00) chosenAction = 1.00;
      if (chosenAction > 10.00) chosenAction = 10.00;
    }

    return {
      action: `price_$${chosenAction.toFixed(2)}`,
      price: chosenAction,
      isExploring: false,
      state: matchId || "fallback"
    };
  }

  // Helper method for the WeeklyReportModal
  getOptimalRange(conditions, gameConfig) {
    let activeScenario = null;
    let matchId = "";

    if (gameConfig.weather && gameConfig.event && gameConfig.competitor) {
      activeScenario = allVariablesOn;
      matchId = `${conditions.weather.toLowerCase()}_${conditions.nearbyEvent ? 'yes' : 'no'}_${conditions.competitorPresent ? 'yes' : 'no'}`;
    } else if (gameConfig.weather && gameConfig.competitor) {
      activeScenario = weatherCompetitorOn;
      matchId = `${conditions.weather.toLowerCase()}_${conditions.competitorPresent ? 'yes' : 'no'}`;
    } else if (gameConfig.event && gameConfig.competitor) {
      activeScenario = eventCompetitorOn;
      matchId = `${conditions.nearbyEvent ? 'yes' : 'no'}_${conditions.competitorPresent ? 'yes' : 'no'}`;
    } else if (gameConfig.weather && gameConfig.event) {
      activeScenario = weatherEventOn;
      matchId = `${conditions.weather.toLowerCase()}_${conditions.nearbyEvent ? 'yes' : 'no'}`;
    }

    let foundState = null;
    if (activeScenario) {
      foundState = activeScenario.find(s => s.id === matchId);
    }

    if (foundState) {
      const minPrice = this._parsePrice(foundState.min_price, conditions.competitorPrice);
      const maxPrice = this._parsePrice(foundState.max_price, conditions.competitorPrice);
      return { minPrice, maxPrice };
    }

    return { minPrice: 4.50, maxPrice: 4.50 };
  }

  // No learning in Phase 2
  learn() {
    return;
  }
}

export const rlAgent = new RLAgent();
