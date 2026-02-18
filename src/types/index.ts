export interface IndicatorDataPoint {
  date: Date;
  value?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  upper?: number;
  middle?: number;
  lower?: number;
}

export interface IndicatorDataPoint {
  date: Date;
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
  | "1wk"
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
  | "1wk"
  | "1mo";
