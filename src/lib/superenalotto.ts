// SuperEnalotto game logic and probability calculations

export interface ColumnSelection {
  numbers: number[]; // 6 numbers from 1-90
  superstar?: number | null; // optional SuperStar number 1-90
}

export interface ExtractionResult {
  numbers: number[]; // 6 main numbers
  jolly: number;
  superstar: number; // 1-90
}

export interface MatchResult {
  columnIndex: number;
  matched: number[];
  jollyMatch: boolean;
  superstarMatch: boolean;
  category: WinCategory | null;
  prize: number;
}

export type WinCategory = '6' | '5+1' | '5' | '4' | '3' | '2';

export const WIN_CATEGORIES: { category: WinCategory; description: string; matches: number; needsJolly: boolean }[] = [
  { category: '6', description: '6 numeri', matches: 6, needsJolly: false },
  { category: '5+1', description: '5 numeri + Jolly', matches: 5, needsJolly: true },
  { category: '5', description: '5 numeri', matches: 5, needsJolly: false },
  { category: '4', description: '4 numeri', matches: 4, needsJolly: false },
  { category: '3', description: '3 numeri', matches: 3, needsJolly: false },
  { category: '2', description: '2 numeri', matches: 2, needsJolly: false },
];

// Average prizes (approximate, based on typical jackpot distributions)
export const AVERAGE_PRIZES: Record<WinCategory, number> = {
  '6': 100_000_000,
  '5+1': 500_000,
  '5': 50_000,
  '4': 300,
  '3': 25,
  '2': 5,
};

export const TICKET_COST = 1; // €1 per column

// Factorial function with memoization
const factorialCache: Record<number, number> = {};
export function factorial(n: number): number {
  if (n <= 1) return 1;
  if (factorialCache[n]) return factorialCache[n];
  factorialCache[n] = n * factorial(n - 1);
  return factorialCache[n];
}

// Binomial coefficient C(n, k)
export function binomial(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  // Use a more numerically stable approach
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

// Calculate probability for each win category
export function calculateProbability(category: WinCategory): { probability: number; oneIn: number } {
  const totalCombinations = binomial(90, 6); // C(90,6)

  switch (category) {
    case '6': {
      // All 6 numbers match: C(6,6) * C(84,0) / C(90,6)
      const favorable = binomial(6, 6) * binomial(84, 0);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '5+1': {
      // 5 of 6 match + jolly (from remaining 84): C(6,5) * 1 / (C(90,6) * 84)
      // More accurately: probability of getting 5 right AND jolly
      const prob5 = (binomial(6, 5) * binomial(84, 1)) / totalCombinations;
      // Jolly is 1 of the 84 remaining numbers, we matched one of them
      const prob = prob5 / 84;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '5': {
      const favorable = binomial(6, 5) * binomial(84, 1);
      const prob = favorable / totalCombinations;
      // Subtract 5+1 probability
      const prob51 = calculateProbability('5+1').probability;
      const adjProb = prob - prob51;
      return { probability: adjProb, oneIn: Math.round(1 / adjProb) };
    }
    case '4': {
      const favorable = binomial(6, 4) * binomial(84, 2);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '3': {
      const favorable = binomial(6, 3) * binomial(84, 3);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
    case '2': {
      const favorable = binomial(6, 2) * binomial(84, 4);
      const prob = favorable / totalCombinations;
      return { probability: prob, oneIn: Math.round(1 / prob) };
    }
  }
}

// Generate a random extraction
export function generateExtraction(): ExtractionResult {
  const pool = Array.from({ length: 90 }, (_, i) => i + 1);
  const numbers: number[] = [];

  // Extract 6 numbers
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    numbers.push(pool[idx]);
    pool.splice(idx, 1);
  }

  // Jolly from remaining
  const jollyIdx = Math.floor(Math.random() * pool.length);
  const jolly = pool[jollyIdx];
  pool.splice(jollyIdx, 1);

  // SuperStar: any number 1-90
  const superstar = Math.floor(Math.random() * 90) + 1;

  return { numbers: numbers.sort((a, b) => a - b), jolly, superstar };
}

// Check matches for a column
export function checkMatches(column: ColumnSelection, extraction: ExtractionResult): MatchResult & { columnIndex: number } {
  const matched = column.numbers.filter(n => extraction.numbers.includes(n));
  const jollyMatch = column.numbers.includes(extraction.jolly);
  const superstarMatch = column.numbers.includes(extraction.superstar);

  let category: WinCategory | null = null;
  if (matched.length === 6) category = '6';
  else if (matched.length === 5 && jollyMatch) category = '5+1';
  else if (matched.length === 5) category = '5';
  else if (matched.length === 4) category = '4';
  else if (matched.length === 3) category = '3';
  else if (matched.length === 2) category = '2';

  const prize = category ? AVERAGE_PRIZES[category] : 0;

  return { columnIndex: 0, matched, jollyMatch, superstarMatch, category, prize };
}

// Run fast simulation
export interface SimulationResult {
  totalExtractions: number;
  totalSpent: number;
  totalWon: number;
  winsByCategory: Record<WinCategory, number>;
}

export function runSimulation(columns: ColumnSelection[], numExtractions: number): SimulationResult {
  const winsByCategory: Record<WinCategory, number> = {
    '6': 0, '5+1': 0, '5': 0, '4': 0, '3': 0, '2': 0
  };
  let totalWon = 0;
  const totalSpent = numExtractions * columns.length * TICKET_COST;

  for (let i = 0; i < numExtractions; i++) {
    const extraction = generateExtraction();
    for (const col of columns) {
      const result = checkMatches(col, extraction);
      if (result.category) {
        winsByCategory[result.category]++;
        totalWon += result.prize;
      }
    }
  }

  return { totalExtractions: numExtractions, totalSpent, totalWon, winsByCategory };
}

// Format number with Italian locale
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('it-IT').format(n);
}
