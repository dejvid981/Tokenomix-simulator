export interface BudgetItem {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one-time';
  startDate: string;
  endDate?: string;
  isRecurring: boolean;
}

export interface FundingRound {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'ido' | 'token-sale';
  dilution: number;
  tokenPrice?: number;
  tokensIssued?: number;
}

export interface TreasuryBalance {
  fiat: number;
  tokens: number;
  tokenValue: number;
  lastUpdated: string;
}

export interface RunwayData {
  currentBalance: number;
  monthlyBurn: number;
  projectedRunway: number;
  scenarios: {
    conservative: number;
    realistic: number;
    optimistic: number;
  };
}

export interface ScenarioConfig {
  revenue: {
    current: number;
    growth: number;
  };
  expenses: {
    salaries: number;
    marketing: number;
    operations: number;
    development: number;
  };
  funding: {
    amount: number;
    timeline: number;
  };
}

export interface FinancialMetrics {
  burnRate: number;
  runway: number;
  cashFlow: number;
  growthRate: number;
  efficiency: number;
}