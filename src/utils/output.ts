import type { ChartResultArrayQuote } from "yahoo-finance2/modules/chart";
import type { IndicatorDataPoint } from "../types";

/**
 * Output formatter for JSON and table formats
 */
export class OutputFormatter {
  private useTable: boolean;
  private pretty: boolean;

  constructor(options: { table?: boolean; pretty?: boolean } = {}) {
    this.useTable = options.table ?? false;
    this.pretty = options.pretty ?? true;
  }

  /**
   * Format any data based on output settings
   */
  format(data: unknown): string {
    return this.formatJson(data);
  }

  /**
   * Format as JSON string
   */
  private formatJson(data: unknown): string {
    return JSON.stringify(data, null, this.pretty ? 2 : 0);
  }

  // TODO format as table
}

/**
 * Create an output formatter with options
 */
export function createFormatter(
  options: { table?: boolean; pretty?: boolean } = {},
): OutputFormatter {
  return new OutputFormatter(options);
}
