// Quote types
export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  bid?: number;
  ask?: number;
  volume?: number;
  avgVolume?: number;
  marketCap?: number;
  pe?: number;
  open?: number;
  high?: number;
  low?: number;
  previousClose?: number;
  timestamp: string;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose?: number;
}

export interface ChartResult {
  symbol: string;
  period?: string;
  interval: string;
  start?: string;
  end?: string;
  data: ChartDataPoint[];
}

// News types
export interface NewsItem {
  title: string;
  publisher: string;
  link: string;
  published: string;
  summary?: string;
  thumbnail?: string;
}

export interface NewsResult {
  symbol: string;
  news: NewsItem[];
}

// Insights types
export interface InsightsResult {
  symbol: string;
  insights: {
    instrumentInfo?: {
      technicalEvents?: string;
      valuation?: string;
    };
    companySnapshot?: {
      sector?: string;
      industry?: string;
    };
  };
}

// Options types
export interface OptionContract {
  strike: number;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  inTheMoney: boolean;
  expirationDate: string;
}

export interface OptionsResult {
  symbol: string;
  expirationDate: string;
  calls: OptionContract[];
  puts: OptionContract[];
}

// Summary types
export interface SummaryProfile {
  sector?: string;
  industry?: string;
  description?: string;
  website?: string;
  employees?: number;
  country?: string;
  city?: string;
}

export interface SummaryDetail {
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  beta?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

export interface SummaryResult {
  symbol: string;
  summaryProfile?: SummaryProfile;
  summaryDetail?: SummaryDetail;
  defaultKeyStatistics?: Record<string, unknown>;
  earnings?: Record<string, unknown>;
  financials?: Record<string, unknown>;
}

// Recommendations types
export interface RecommendedSymbol {
  symbol: string;
  score: number;
}

export interface RecommendationsResult {
  symbol: string;
  recommendedSymbols: RecommendedSymbol[];
}

// Screener types
export interface ScreenerQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface ScreenerResult {
  query: string;
  quotes: ScreenerQuote[];
}

// Search types
export interface SearchResult {
  query: string;
  quotes: Array<{
    symbol: string;
    name: string;
    exchange: string;
    type: string;
  }>;
  news?: NewsItem[];
}

// Indicator types
export interface IndicatorDataPoint {
  date: string;
  value?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  upper?: number;
  middle?: number;
  lower?: number;
}

export interface IndicatorResult {
  symbol: string;
  indicator: string;
  config?: Record<string, number>;
  data: IndicatorDataPoint[];
}

// Period presets
export type PeriodPreset =
  | "1d"
  | "5d"
  | "1w"
  | "1mo"
  | "3mo"
  | "6mo"
  | "1y"
  | "2y"
  | "5y";
export type IntervalType =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "1d"
  | "1w"
  | "1mo";
