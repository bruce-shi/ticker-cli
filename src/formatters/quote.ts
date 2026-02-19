import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";

/**
 * Quote data structure from Yahoo Finance
 */
export interface QuoteData {
  quotes: Array<{
    symbol: string;
    shortName?: string;
    regularMarketPrice?: number;
    regularMarketChange?: number;
    regularMarketChangePercent?: number;
    regularMarketVolume?: number;
    marketCap?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    [key: string]: unknown;
  }>;
}

/**
 * Formatter for stock quote data
 */
export class QuoteFormatter extends BaseFormatter<QuoteData> {
  formatTable(data: QuoteData): string {
    const table = new Table({
      title: "Stock Quotes",
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

    for (const quote of data.quotes) {
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

    return table.render();
  }
}

/**
 * Create a quote formatter
 */
export function createQuoteFormatter(options: FormatterOptions = {}): {
  format: (data: QuoteData) => string;
} {
  const formatter = new QuoteFormatter();
  return {
    format: (data: QuoteData) => formatter.format(data, options),
  };
}
