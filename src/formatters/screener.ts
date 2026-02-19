import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";

/**
 * Screener quote from Yahoo Finance
 */
export interface ScreenerQuote {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  [key: string]: unknown;
}

/**
 * Screener data structure from Yahoo Finance
 */
export interface ScreenerData {
  query: string;
  quotes: ScreenerQuote[];
  totalResults?: number;
  start?: number;
}

/**
 * Formatter for screener results
 */
export class ScreenerFormatter extends BaseFormatter<ScreenerData> {
  formatTable(data: ScreenerData): string {
    const table = new Table({
      title: `Screener Results: ${data.query}`,
      columns: [
        { name: "symbol", title: "Symbol", alignment: "left" },
        { name: "name", title: "Name", alignment: "left", maxLen: 20 },
        { name: "price", title: "Price", alignment: "right" },
        { name: "change", title: "Change", alignment: "right" },
        { name: "changePercent", title: "Change %", alignment: "right" },
        { name: "volume", title: "Volume", alignment: "right" },
        { name: "marketCap", title: "Market Cap", alignment: "right" },
      ],
    });

    // Show top 30 results for readability
    const quotes = data.quotes.slice(0, 30);

    for (const quote of quotes) {
      table.addRow({
        symbol: quote.symbol,
        name: this.truncate(quote.shortName ?? "-", 20),
        price: this.formatNumber(quote.regularMarketPrice),
        change: this.formatNumber(quote.regularMarketChange),
        changePercent: this.formatPercent(quote.regularMarketChangePercent),
        volume: this.formatVolume(quote.regularMarketVolume),
        marketCap: this.formatVolume(quote.marketCap),
      });
    }

    let output = table.render();

    if (data.quotes.length > 30) {
      output += `\n\n... and ${data.quotes.length - 30} more results`;
    }

    if (data.totalResults !== undefined) {
      output += `\n\nTotal Results: ${data.totalResults}`;
    }

    return output;
  }
}

/**
 * Create a screener formatter
 */
export function createScreenerFormatter(options: FormatterOptions = {}): {
  format: (data: ScreenerData) => string;
} {
  const formatter = new ScreenerFormatter();
  return {
    format: (data: ScreenerData) => formatter.format(data, options),
  };
}
