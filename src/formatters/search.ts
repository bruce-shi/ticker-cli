import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";
import type { SearchResult } from "yahoo-finance2/modules/search";

/**
 * Formatter for search results
 * Uses the actual SearchResult type from yahoo-finance2
 */
export class SearchFormatter extends BaseFormatter<SearchResult> {
  formatTable(data: SearchResult): string {
    const table = new Table({
      title: "Search Results",
      columns: [
        { name: "symbol", title: "Symbol", alignment: "left" },
        { name: "name", title: "Name", alignment: "left", maxLen: 30 },
        { name: "exchange", title: "Exchange", alignment: "left" },
        { name: "type", title: "Type", alignment: "left" },
        { name: "score", title: "Score", alignment: "right" },
      ],
    });

    const quotes = data.quotes ?? [];

    for (const quote of quotes) {
      const name = quote.shortname ?? quote.longname ?? "-";
      const score =
        typeof quote.score === "number" ? quote.score.toFixed(2) : "-";
      table.addRow({
        symbol: quote.symbol,
        name: typeof name === "string" ? this.truncate(name, 30) : "-",
        exchange: typeof quote.exchange === "string" ? quote.exchange : "-",
        type: typeof quote.quoteType === "string" ? quote.quoteType : "-",
        score,
      });
    }

    return table.render();
  }
}

/**
 * Create a search formatter
 */
export function createSearchFormatter(options: FormatterOptions = {}): {
  format: (data: SearchResult) => string;
} {
  const formatter = new SearchFormatter();
  return {
    format: (data: SearchResult) => formatter.format(data, options),
  };
}

// Re-export the type for convenience
export type { SearchResult as SearchData } from "yahoo-finance2/modules/search";
