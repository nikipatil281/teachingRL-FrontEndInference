const PRICE_MIN = 1;
const PRICE_MAX = 10;

let rlModelPromise;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const relu = (value) => (value > 0 ? value : 0);

const loadRlModel = async () => {
  if (!rlModelPromise) {
    rlModelPromise = import("../generated/rlModel.generated.json").then((module) => module.default);
  }

  return rlModelPromise;
};

const linearForward = (input, layer) => {
  const output = new Array(layer.bias.length);

  for (let rowIndex = 0; rowIndex < layer.weight.length; rowIndex += 1) {
    const row = layer.weight[rowIndex];
    let sum = layer.bias[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
      sum += row[columnIndex] * input[columnIndex];
    }

    output[rowIndex] = sum;
  }

  return output;
};

const argMax = (values) => {
  let bestIndex = 0;

  for (let index = 1; index < values.length; index += 1) {
    if (values[index] > values[bestIndex]) {
      bestIndex = index;
    }
  }

  return bestIndex;
};

class RLAgent {
  constructor() {
    this.weatherMap = { Sunny: 0, Cloudy: 1, Rainy: 2 };
    this.dayMap = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    };
  }

  async init() {
    try {
      await loadRlModel();
      return true;
    } catch (error) {
      console.warn("RL model bundle failed to load:", error);
      return false;
    }
  }

  normalizePrice(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 5;
    return Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(numeric * 2) / 2));
  }

  buildStateVector(conditions, yesterdayPrice = 4.5) {
    const dayOfWeek =
      typeof conditions.day === "string"
        ? this.dayMap[conditions.day]
        : Number.isFinite(conditions.dayNumber)
          ? ((conditions.dayNumber - 1) % 7 + 7) % 7
          : 0;

    const dayNumber = clamp(Number(conditions.dayNumber) || 1, 1, 28);
    const weatherIndex = this.weatherMap[conditions.weather] ?? 0;
    const inventory = clamp(Number(conditions.inventory) || 0, 0, 5000);
    const competitorPrice = clamp(Number(conditions.competitorPrice) || 0, 0, 10);
    const safeYesterdayPrice = clamp(Number(yesterdayPrice) || 5, 1, 10);
    const nearbyEvent = conditions.nearbyEvent ? 1 : 0;
    const competitorPresent = conditions.competitorPresent ? 1 : 0;

    const dayName = this.dayMap[conditions.day] !== undefined
      ? conditions.day
      : Object.keys(this.dayMap).find((key) => this.dayMap[key] === dayOfWeek) || "Monday";
    const weatherName = Object.keys(this.weatherMap).find((key) => this.weatherMap[key] === weatherIndex) || "Sunny";
    const setId = this.deriveSetId(dayName, weatherName, Boolean(nearbyEvent), Boolean(competitorPresent));

    return [
      (dayNumber - 1) / 27,
      dayOfWeek / 6,
      weatherIndex / 2,
      Math.min(1, inventory / 5000),
      nearbyEvent,
      competitorPresent,
      Math.min(1, competitorPrice / 10),
      Math.min(1, safeYesterdayPrice / 10),
      Math.min(1, setId / 7),
    ];
  }

  deriveSetId(dayName, weather, nearbyEvent, competitorPresent) {
    const sunny = weather === "Sunny";
    const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(dayName);

    if (weekday && !sunny && !competitorPresent && !nearbyEvent) return 1;
    if (weekday && !sunny && !competitorPresent && nearbyEvent) return 2;
    if (weekday && !sunny && competitorPresent && !nearbyEvent) return 3;
    if (weekday && !sunny && competitorPresent && nearbyEvent) return 4;
    if (weekday && sunny && !competitorPresent && !nearbyEvent) return 5;
    if (!weekday && !sunny && competitorPresent && nearbyEvent) return 6;
    if (!weekday && sunny && !competitorPresent && nearbyEvent) return 7;

    return 0;
  }

  async getAction(conditions, yesterdayPrice = 4.5) {
    try {
      const model = await loadRlModel();
      const state = this.buildStateVector(conditions, yesterdayPrice);

      const hidden1 = linearForward(state, model.layers[0]).map(relu);
      const hidden2 = linearForward(hidden1, model.layers[1]).map(relu);
      const qValues = linearForward(hidden2, model.layers[2]);
      const action = argMax(qValues);
      const suggestedPrice = this.normalizePrice(action + 1);

      console.log(`[RL Agent] Bundled DQN predicted price: $${suggestedPrice}`);

      return {
        action: `price_$${suggestedPrice.toFixed(2)}`,
        price: suggestedPrice,
        isExploring: false,
        state: "bundled_model_prediction",
      };
    } catch (error) {
      console.warn("RL model inference failed:", error);
      return {
        action: "price_$5.00",
        price: 5,
        isExploring: false,
        state: "fallback",
      };
    }
  }

  getOptimalRange(conditions) {
    let minPrice = 3;
    let maxPrice = 7;

    if (conditions.weather === "Rainy") {
      minPrice = 2;
      maxPrice = 5;
    } else if (conditions.weather === "Cloudy") {
      minPrice = 3;
      maxPrice = 6;
    } else if (conditions.weather === "Sunny") {
      minPrice = 4;
      maxPrice = 8;
    }

    if (conditions.nearbyEvent) {
      minPrice += 1;
      maxPrice += 1;
    }

    if (conditions.competitorPresent && conditions.competitorPrice) {
      if (conditions.competitorPrice < minPrice + 1) {
        minPrice = Math.max(1, Math.round(conditions.competitorPrice - 1));
      }
    }

    return {
      minPrice: Math.max(1, Math.min(10, Math.round(minPrice))),
      maxPrice: Math.max(1, Math.min(10, Math.round(maxPrice))),
    };
  }

  learn() {
    return;
  }
}

export const rlAgent = new RLAgent();
