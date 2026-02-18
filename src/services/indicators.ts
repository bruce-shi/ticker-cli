import { sma, ema, rsi, macd, bb } from "indicatorts";
import type {
  ChartDataPoint,
  IndicatorResult,
  IndicatorDataPoint,
} from "../types";

/**
 * Indicator configuration options
 */
export interface IndicatorConfig {
  period?: number;
  length?: number;
  fast?: number;
  slow?: number;
  signal?: number;
  short?: number;
  long?: number;
  stddev?: number;
}

/**
 * Indicator service for calculating technical indicators
 */
export class IndicatorService {
  /**
   * Calculate Simple Moving Average (SMA)
   */
  calculateSMA(
    data: ChartDataPoint[],
    config: IndicatorConfig = {},
  ): IndicatorResult {
    const period = config.period ?? config.length ?? 20;
    const closes = data.map((d) => d.close);

    const smaValues = sma(closes, { period });

    return {
      symbol: "",
      indicator: "SMA",
      config: { length: period },
      data: this.alignIndicatorData(data, smaValues),
    };
  }

  /**
   * Calculate Exponential Moving Average (EMA)
   */
  calculateEMA(
    data: ChartDataPoint[],
    config: IndicatorConfig = {},
  ): IndicatorResult {
    const period = config.period ?? config.length ?? 20;
    const closes = data.map((d) => d.close);

    const emaValues = ema(closes, { period });

    return {
      symbol: "",
      indicator: "EMA",
      config: { length: period },
      data: this.alignIndicatorData(data, emaValues),
    };
  }

  /**
   * Calculate Relative Strength Index (RSI)
   */
  calculateRSI(
    data: ChartDataPoint[],
    config: IndicatorConfig = {},
  ): IndicatorResult {
    const period = config.period ?? config.length ?? 14;
    const closes = data.map((d) => d.close);

    const rsiValues = rsi(closes, { period });

    return {
      symbol: "",
      indicator: "RSI",
      config: { length: period },
      data: this.alignIndicatorData(data, rsiValues),
    };
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  calculateMACD(
    data: ChartDataPoint[],
    config: IndicatorConfig = {},
  ): IndicatorResult {
    const fast = config.fast ?? config.short ?? 12;
    const slow = config.slow ?? config.long ?? 26;
    const signal = config.signal ?? 9;
    const closes = data.map((d) => d.close);

    const macdResult = macd(closes, { fast, slow, signal });

    const indicatorData: IndicatorDataPoint[] = data.map((d, i) => ({
      date: d.date,
      macd: macdResult.macdLine[i],
      signal: macdResult.signalLine[i],
      histogram:
        macdResult.macdLine[i] !== undefined &&
        macdResult.signalLine[i] !== undefined
          ? macdResult.macdLine[i]! - macdResult.signalLine[i]!
          : undefined,
    }));

    return {
      symbol: "",
      indicator: "MACD",
      config: { short: fast, long: slow, signal },
      data: indicatorData,
    };
  }

  /**
   * Calculate Bollinger Bands
   */
  calculateBollingerBands(
    data: ChartDataPoint[],
    config: IndicatorConfig = {},
  ): IndicatorResult {
    const period = config.period ?? config.length ?? 20;
    const closes = data.map((d) => d.close);

    const bbResult = bb(closes, { period });

    const indicatorData: IndicatorDataPoint[] = data.map((d, i) => ({
      date: d.date,
      upper: bbResult.upper[i],
      middle: bbResult.middle[i],
      lower: bbResult.lower[i],
    }));

    return {
      symbol: "",
      indicator: "BollingerBands",
      config: { length: period },
      data: indicatorData,
    };
  }

  /**
   * Calculate indicator by name
   */
  calculate(
    indicator: string,
    data: ChartDataPoint[],
    config: IndicatorConfig = {},
  ): IndicatorResult {
    switch (indicator.toLowerCase()) {
      case "sma":
        return this.calculateSMA(data, config);
      case "ema":
        return this.calculateEMA(data, config);
      case "rsi":
        return this.calculateRSI(data, config);
      case "macd":
        return this.calculateMACD(data, config);
      case "bb":
      case "bollinger":
      case "bollingerbands":
        return this.calculateBollingerBands(data, config);
      default:
        throw new Error(`Unknown indicator: ${indicator}`);
    }
  }

  /**
   * Align indicator values with dates
   * Indicators often have undefined values at the start
   */
  private alignIndicatorData(
    data: ChartDataPoint[],
    values: number[],
  ): IndicatorDataPoint[] {
    return data.map((d, i) => ({
      date: d.date,
      value: values[i],
    }));
  }
}

/**
 * Create an IndicatorService instance
 */
export function createIndicatorService(): IndicatorService {
  return new IndicatorService();
}
