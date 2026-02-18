import type { PeriodPreset, IntervalType } from "../types";

/**
 * Parse a date string or return the Date object
 */
export function parseDate(date: string | Date): Date {
  if (date instanceof Date) return date;
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  return parsed;
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
}

/**
 * Get date range for a period preset
 */
export function getPeriodRange(period: PeriodPreset): {
  start: Date;
  end: Date;
} {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case "1d":
      start.setDate(end.getDate() - 1);
      break;
    case "5d":
      start.setDate(end.getDate() - 5);
      break;
    case "1w":
      start.setDate(end.getDate() - 7);
      break;
    case "1mo":
      start.setMonth(end.getMonth() - 1);
      break;
    case "3mo":
      start.setMonth(end.getMonth() - 3);
      break;
    case "6mo":
      start.setMonth(end.getMonth() - 6);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    case "2y":
      start.setFullYear(end.getFullYear() - 2);
      break;
    case "5y":
      start.setFullYear(end.getFullYear() - 5);
      break;
    default:
      throw new Error(`Unknown period: ${period}`);
  }

  return { start, end };
}

/**
 * Map period preset to yahoo-finance2 period string
 */
export function periodToYahooPeriod(period: PeriodPreset): string {
  const mapping: Record<PeriodPreset, string> = {
    "1d": "1d",
    "5d": "5d",
    "1w": "1wk",
    "1mo": "1mo",
    "3mo": "3mo",
    "6mo": "6mo",
    "1y": "1y",
    "2y": "2y",
    "5y": "5y",
  };
  return mapping[period];
}

/**
 * Map interval to yahoo-finance2 interval string
 */
export function intervalToYahooInterval(interval: IntervalType): "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo" {
  const mapping: Record<IntervalType, "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo"> = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "30m": "30m",
    "1h": "1h",
    "1d": "1d",
    "1w": "1wk",
    "1mo": "1mo",
  };
  return mapping[interval];
}

/**
 * Get the default interval for a period
 */
export function getDefaultInterval(period: PeriodPreset): IntervalType {
  switch (period) {
    case "1d":
    case "5d":
      return "15m";
    case "1w":
      return "1h";
    case "1mo":
    case "3mo":
      return "1d";
    case "6mo":
    case "1y":
    case "2y":
      return "1d";
    case "5y":
      return "1w";
    default:
      return "1d";
  }
}

/**
 * Validate a period preset
 */
export function isValidPeriod(period: string): period is PeriodPreset {
  return ["1d", "5d", "1w", "1mo", "3mo", "6mo", "1y", "2y", "5y"].includes(
    period,
  );
}

/**
 * Validate an interval type
 */
export function isValidInterval(interval: string): interval is IntervalType {
  return ["1m", "5m", "15m", "30m", "1h", "1d", "1w", "1mo"].includes(interval);
}
