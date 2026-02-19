import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";
import type { ChartResultArrayQuote } from "yahoo-finance2/modules/chart";

/**
 * Chart data structure from Yahoo Finance
 * Uses the actual ChartResultArray type from yahoo-finance2
 */
export type ChartData = {
  symbol?: string;
  quotes: ChartResultArrayQuote[];
  meta?: Record<string, unknown>;
};

/**
 * Formatter for chart/historical data
 */
export class ChartFormatter extends BaseFormatter<ChartData> {
  formatTable(data: ChartData): string {
    const table = new Table({
      title: data.symbol
        ? `Historical Data: ${data.symbol}`
        : "Historical Data",
      columns: [
        { name: "date", title: "Date", alignment: "left" },
        { name: "open", title: "Open", alignment: "right" },
        { name: "high", title: "High", alignment: "right" },
        { name: "low", title: "Low", alignment: "right" },
        { name: "close", title: "Close", alignment: "right" },
        { name: "volume", title: "Volume", alignment: "right" },
      ],
    });

    // Limit to last 50 rows for readability
    // const quotes = data.quotes.slice(-50);

    for (const quote of data.quotes) {
      table.addRow({
        date: this.formatDate(quote.date),
        open: this.formatNumber(quote.open),
        high: this.formatNumber(quote.high),
        low: this.formatNumber(quote.low),
        close: this.formatNumber(quote.close),
        volume: this.formatVolume(quote.volume),
      });
    }

    return table.render();
  }
}

/**
 * Create a chart formatter
 */
export function createChartFormatter(options: FormatterOptions = {}): {
  format: (data: ChartData) => string;
} {
  const formatter = new ChartFormatter();
  return {
    format: (data: ChartData) => formatter.format(data, options),
  };
}

// Re-export the quote type for convenience
export type { ChartResultArrayQuote as ChartQuote };
