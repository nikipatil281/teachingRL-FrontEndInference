let mlModelPromise;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizePrice = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 5;
  return Math.min(10, Math.max(1, Math.round(numeric * 2) / 2));
};

const loadMlModel = async () => {
  if (!mlModelPromise) {
    mlModelPromise = import("../generated/mlModel.generated.json").then((module) => module.default);
  }

  return mlModelPromise;
};

const encodeFeatures = (model, dayOfWeek, weather, nearbyEvent, inventory, competitorPresent, competitorPrice) => {
  const [dayCategories = [], weatherCategories = []] = model.categories || [];
  const dayIndex = dayCategories.indexOf(String(dayOfWeek ?? "Monday"));
  const weatherIndex = weatherCategories.indexOf(String(weather ?? "Sunny"));

  return [
    dayIndex >= 0 ? dayIndex : 0,
    weatherIndex >= 0 ? weatherIndex : 0,
    nearbyEvent ? 1 : 0,
    clamp(Number(inventory) || 0, 0, 5000),
    competitorPresent ? 1 : 0,
    clamp(Number(competitorPrice) || 0, 0, 10),
  ];
};

const predictTree = (tree, features) => {
  let nodeIndex = 0;

  while (tree.childrenLeft[nodeIndex] !== -1 && tree.childrenRight[nodeIndex] !== -1) {
    const featureIndex = tree.feature[nodeIndex];
    const threshold = tree.threshold[nodeIndex];
    nodeIndex = features[featureIndex] <= threshold
      ? tree.childrenLeft[nodeIndex]
      : tree.childrenRight[nodeIndex];
  }

  return tree.value[nodeIndex];
};

const predictForest = (model, features) => {
  if (!Array.isArray(model?.trees) || model.trees.length === 0) return 5;

  const total = model.trees.reduce((sum, tree) => sum + predictTree(tree, features), 0);
  return total / model.trees.length;
};

export const initMLModel = async () => {
  try {
    await loadMlModel();
    return true;
  } catch (error) {
    console.warn("ML model bundle failed to load:", error);
    return false;
  }
};

export const getMLPrice = async (dayOfWeek, weather, nearbyEvent, inventory, competitorPresent, competitorPrice) => {
  try {
    const model = await loadMlModel();
    const features = encodeFeatures(
      model,
      dayOfWeek,
      weather,
      nearbyEvent,
      inventory,
      competitorPresent,
      competitorPrice
    );

    const prediction = predictForest(model, features);
    const suggestedPrice = normalizePrice(Math.round(prediction));
    console.log(`ML Suggestion (Bundled RF): $${suggestedPrice.toFixed(2)}`);
    return suggestedPrice;
  } catch (error) {
    console.warn("ML model inference failed:", error);
    return 5;
  }
};

export const getMLFormula = () => "Random Forest - Bundled Browser Inference";
