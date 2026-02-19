/**
 * Base formatter options shared across all formatters
 */
export interface FormatterOptions {
  /** Output as ASCII table instead of JSON */
  table?: boolean;
  /** Pretty print JSON output (default: true) */
  pretty?: boolean;
}

/**
 * Base interface for all data formatters
 * Each command should implement its own formatter with specific data type
 */
export interface DataFormatter<T> {
  /**
   * Format data based on options (table or JSON)
   */
  format(data: T, options: FormatterOptions): string;

  /**
   * Format data as JSON string
   */
  formatJson(data: T, pretty: boolean): string;

  /**
   * Format data as ASCII table
   */
  formatTable(data: T): string;
}

/**
 * Abstract base class providing common formatting utilities
 */
export abstract class BaseFormatter<T> implements DataFormatter<T> {
  format(data: T, options: FormatterOptions): string {
    if (options.table) {
      return this.formatTable(data);
    }
    return this.formatJson(data, options.pretty ?? true);
  }

  formatJson(data: T, pretty: boolean): string {
    return JSON.stringify(data, null, pretty ? 2 : 0);
  }

  abstract formatTable(data: T): string;

  /**
   * Format a number with specified decimal places
   */
  protected formatNumber(
    value: number | null | undefined,
    decimals = 2,
  ): string {
    if (value === undefined || value === null) return "N/A";
    return value.toFixed(decimals);
  }

  /**
   * Format a percentage value
   */
  protected formatPercent(
    value: number | null | undefined,
    decimals = 2,
  ): string {
    if (value === undefined || value === null) return "N/A";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(decimals)}%`;
  }

  /**
   * Format a date to a simple string
   */
  protected formatDate(date: Date | string | number | undefined): string {
    if (!date) return "N/A";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toISOString();
  }

  /**
   * Format a datetime to a readable string
   */
  protected formatDateTime(date: Date | string | number | undefined): string {
    if (!date) return "N/A";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toISOString().replace("T", " ").slice(0, 19) ?? "N/A";
  }

  /**
   * Format volume with K/M/B suffixes
   */
  protected formatVolume(value: number | null | undefined): string {
    if (value === undefined || value === null) return "N/A";
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  }

  /**
   * Truncate a string to a maximum length
   */
  protected truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + "...";
  }
}
