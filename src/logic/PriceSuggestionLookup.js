const CSV_PATH = `${import.meta.env.BASE_URL}valid_state_price_suggestions.csv`;

let suggestionTablePromise;

const normalizeText = (value) => String(value ?? '').trim();
const normalizeBooleanLabel = (value) => (value ? 'yes' : 'no');
const normalizeCompetitorLabel = (value) => (value ? 'present' : 'absent');
const normalizePriceKey = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? String(Math.round(numeric)) : '';
};

const parseCsvLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
};

const parseSuggestionCsv = (text) => {
  const [headerLine, ...dataLines] = text.trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return dataLines
    .filter(Boolean)
    .map((line) => {
      const values = parseCsvLine(line);
      return headers.reduce((row, header, index) => ({
        ...row,
        [header]: values[index] ?? ''
      }), {});
    });
};

const buildLookupKey = ({ day, weather, competitorPresent, competitorPrice, nearbyEvent }) => [
  normalizeText(day),
  normalizeText(weather),
  normalizeCompetitorLabel(competitorPresent),
  competitorPresent ? normalizePriceKey(competitorPrice) : '',
  normalizeBooleanLabel(nearbyEvent)
].join('|');

const loadSuggestionTable = async () => {
  const response = await fetch(CSV_PATH);
  if (!response.ok) {
    throw new Error(`Unable to load price suggestion CSV: ${response.status}`);
  }

  const rows = parseSuggestionCsv(await response.text());
  const byState = new Map();

  for (const row of rows) {
    byState.set(
      buildLookupKey({
        day: row.day,
        weather: row.weather,
        competitorPresent: row.competitor === 'present',
        competitorPrice: row.competitor_price,
        nearbyEvent: row.local_event === 'yes'
      }),
      row
    );
  }

  return byState;
};

export const initPriceSuggestionLookup = async () => {
  try {
    if (!suggestionTablePromise) {
      suggestionTablePromise = loadSuggestionTable();
    }

    await suggestionTablePromise;
    return true;
  } catch (error) {
    console.warn('Price suggestion CSV failed to load:', error);
    return false;
  }
};

export const getCsvPriceSuggestion = async (conditions) => {
  if (!suggestionTablePromise) {
    suggestionTablePromise = loadSuggestionTable();
  }

  const table = await suggestionTablePromise;
  const row = table.get(buildLookupKey(conditions));

  if (!row) {
    return null;
  }

  return {
    mlPrice: Number(row.ml_suggested_price),
    rlPrice: Number(row.rl_suggested_price),
    row
  };
};
