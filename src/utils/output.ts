import type {
  Quote,
  ChartDataPoint,
  NewsItem,
  OptionContract,
  IndicatorDataPoint,
} from "../types";

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
    if (this.useTable) {
      return this.formatTable(data);
    }
    return this.formatJson(data);
  }

  /**
   * Format as JSON string
   */
  private formatJson(data: unknown): string {
    return JSON.stringify(data, null, this.pretty ? 2 : 0);
  }

  /**
   * Format as ASCII table
   */
  private formatTable(data: unknown): string {
    if (Array.isArray(data)) {
      if (data.length === 0) return "No data";
      const first = data[0];
      if (typeof first === "object" && first !== null) {
        return this.formatObjectArray(data as Record<string, unknown>[]);
      }
    }

    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      // Check for specific result types
      if ("quotes" in obj) {
        return this.formatQuotes(obj.quotes as Quote[]);
      }
      if ("data" in obj && Array.isArray(obj.data)) {
        const firstItem = obj.data[0];
        if (firstItem && "value" in firstItem) {
          return this.formatIndicatorData(
            obj.data as IndicatorDataPoint[],
            String(obj.indicator ?? ""),
          );
        }
        if (firstItem && "open" in firstItem) {
          return this.formatChartData(obj.data as ChartDataPoint[]);
        }
      }
      if ("news" in obj) {
        return this.formatNews(obj.news as NewsItem[]);
      }
      if ("calls" in obj || "puts" in obj) {
        return this.formatOptions(
          obj as { calls?: OptionContract[]; puts?: OptionContract[] },
        );
      }
      if ("symbol" in obj && "price" in obj) {
        return this.formatSingleQuote(obj as unknown as Quote);
      }
      return this.formatKeyValue(obj);
    }

    return String(data);
  }

  /**
   * Format an array of objects as a table
   */
  private formatObjectArray(data: Record<string, unknown>[]): string {
    if (data.length === 0) return "No data";

    const firstRow = data[0];
    if (!firstRow) return "No data";

    const keys = Object.keys(firstRow);
    const widths: Map<string, number> = new Map();

    // Calculate column widths
    for (const key of keys) {
      const maxWidth = Math.max(
        key.length,
        ...data.map((row) => String(row[key] ?? "").length),
      );
      widths.set(key, maxWidth);
    }

    // Build header
    const header = keys.map((k) => k.padEnd(widths.get(k) ?? 0)).join(" | ");
    const separator = keys
      .map((k) => "-".repeat(widths.get(k) ?? 0))
      .join("-+-");

    // Build rows
    const rows = data.map((row) =>
      keys
        .map((k) => String(row[k] ?? "").padEnd(widths.get(k) ?? 0))
        .join(" | "),
    );

    return [header, separator, ...rows].join("\n");
  }

  /**
   * Format quotes array
   */
  private formatQuotes(quotes: Quote[]): string {
    if (quotes.length === 0) return "No quotes found";

    const headers = [
      "Symbol",
      "Price",
      "Change",
      "Change %",
      "Volume",
      "Market Cap",
    ];
    const rows = quotes.map((q) => [
      q.symbol.padEnd(6),
      this.formatNumber(q.price, 2).padStart(12),
      this.formatNumber(q.change, 2).padStart(10),
      this.formatPercent(q.changePercent).padStart(10),
      this.formatNumber(q.volume ?? 0, 0).padStart(12),
      this.formatMarketCap(q.marketCap).padStart(12),
    ]);

    return this.buildTable(headers, rows);
  }

  /**
   * Format a single quote
   */
  private formatSingleQuote(quote: Quote): string {
    const rows = [
      ["Symbol", quote.symbol],
      ["Price", this.formatNumber(quote.price, 2)],
      [
        "Change",
        `${this.formatNumber(quote.change, 2)} (${this.formatPercent(quote.changePercent)})`,
      ],
      ["Bid", this.formatNumber(quote.bid, 2)],
      ["Ask", this.formatNumber(quote.ask, 2)],
      ["Volume", this.formatNumber(quote.volume, 0)],
      ["Avg Volume", this.formatNumber(quote.avgVolume, 0)],
      ["Market Cap", this.formatMarketCap(quote.marketCap)],
      ["P/E", this.formatNumber(quote.pe, 2)],
      ["Open", this.formatNumber(quote.open, 2)],
      ["High", this.formatNumber(quote.high, 2)],
      ["Low", this.formatNumber(quote.low, 2)],
      ["Prev Close", this.formatNumber(quote.previousClose, 2)],
      ["Timestamp", quote.timestamp],
    ];

    return this.buildKeyValueTable(rows);
  }

  /**
   * Format chart data
   */
  private formatChartData(data: ChartDataPoint[]): string {
    if (data.length === 0) return "No chart data";

    const headers = ["Date", "Open", "High", "Low", "Close", "Volume"];
    const rows = data.map((d) => [
      d.date,
      this.formatNumber(d.open, 2).padStart(10),
      this.formatNumber(d.high, 2).padStart(10),
      this.formatNumber(d.low, 2).padStart(10),
      this.formatNumber(d.close, 2).padStart(10),
      this.formatNumber(d.volume, 0).padStart(12),
    ]);

    return this.buildTable(headers, rows);
  }

  /**
   * Format news items
   */
  private formatNews(news: NewsItem[]): string {
    if (news.length === 0) return "No news found";

    return news
      .map((item, i) =>
        [
          `[${i + 1}] ${item.title}`,
          `    Publisher: ${item.publisher}`,
          `    Published: ${item.published}`,
          `    Link: ${item.link}`,
          item.summary
            ? `    Summary: ${item.summary.substring(0, 200)}...`
            : "",
        ]
          .filter(Boolean)
          .join("\n"),
      )
      .join("\n\n");
  }

  /**
   * Format options chain
   */
  private formatOptions(data: {
    calls?: OptionContract[];
    puts?: OptionContract[];
    expirationDate?: string;
  }): string {
    const lines: string[] = [];

    if (data.expirationDate) {
      lines.push(`Expiration: ${data.expirationDate}`);
      lines.push("");
    }

    if (data.calls && data.calls.length > 0) {
      lines.push("=== CALLS ===");
      const headers = ["Strike", "Last", "Bid", "Ask", "Vol", "OI", "IV"];
      const rows = data.calls.map((c) => [
        this.formatNumber(c.strike, 2).padStart(8),
        this.formatNumber(c.lastPrice, 2).padStart(8),
        this.formatNumber(c.bid, 2).padStart(8),
        this.formatNumber(c.ask, 2).padStart(8),
        this.formatNumber(c.volume, 0).padStart(8),
        this.formatNumber(c.openInterest, 0).padStart(8),
        this.formatPercent(c.impliedVolatility).padStart(8),
      ]);
      lines.push(this.buildTable(headers, rows));
    }

    if (data.puts && data.puts.length > 0) {
      if (data.calls) lines.push("");
      lines.push("=== PUTS ===");
      const headers = ["Strike", "Last", "Bid", "Ask", "Vol", "OI", "IV"];
      const rows = data.puts.map((p) => [
        this.formatNumber(p.strike, 2).padStart(8),
        this.formatNumber(p.lastPrice, 2).padStart(8),
        this.formatNumber(p.bid, 2).padStart(8),
        this.formatNumber(p.ask, 2).padStart(8),
        this.formatNumber(p.volume, 0).padStart(8),
        this.formatNumber(p.openInterest, 0).padStart(8),
        this.formatPercent(p.impliedVolatility).padStart(8),
      ]);
      lines.push(this.buildTable(headers, rows));
    }

    return lines.join("\n");
  }

  /**
   * Format indicator data
   */
  private formatIndicatorData(
    data: IndicatorDataPoint[],
    indicator: string,
  ): string {
    if (data.length === 0) return "No indicator data";

    if (indicator === "MACD") {
      const headers = ["Date", "MACD", "Signal", "Histogram"];
      const rows = data.map((d) => [
        d.date,
        this.formatNumber(d.macd, 4).padStart(12),
        this.formatNumber(d.signal, 4).padStart(12),
        this.formatNumber(d.histogram, 4).padStart(12),
      ]);
      return this.buildTable(headers, rows);
    }

    if (indicator === "BB" || indicator === "BollingerBands") {
      const headers = ["Date", "Upper", "Middle", "Lower"];
      const rows = data.map((d) => [
        d.date,
        this.formatNumber(d.upper, 2).padStart(12),
        this.formatNumber(d.middle, 2).padStart(12),
        this.formatNumber(d.lower, 2).padStart(12),
      ]);
      return this.buildTable(headers, rows);
    }

    // Default: single value indicator (SMA, EMA, RSI)
    const headers = ["Date", "Value"];
    const rows = data.map((d) => [
      d.date,
      this.formatNumber(d.value, 4).padStart(12),
    ]);
    return this.buildTable(headers, rows);
  }

  /**
   * Format key-value pairs
   */
  private formatKeyValue(data: Record<string, unknown>): string {
    const rows = Object.entries(data).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return [key, JSON.stringify(value, null, 2)];
      }
      return [key, String(value)];
    });
    return this.buildKeyValueTable(rows);
  }

  /**
   * Build a table from headers and rows
   */
  private buildTable(headers: string[], rows: string[][]): string {
    const widths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => r[i]?.length ?? 0)),
    );

    const headerLine = headers.map((h, i) => h.padEnd(widths[i]!)).join(" | ");
    const separator = widths.map((w) => "-".repeat(w)).join("-+-");
    const dataLines = rows.map((row) =>
      row.map((cell, i) => (cell ?? "").padEnd(widths[i]!)).join(" | "),
    );

    return [headerLine, separator, ...dataLines].join("\n");
  }

  /**
   * Build a key-value table
   */
  private buildKeyValueTable(rows: (string | number)[][]): string {
    const keyWidth = Math.max(...rows.map((r) => String(r[0]).length));
    return rows
      .map(([key, value]) => `${String(key).padEnd(keyWidth)} : ${value}`)
      .join("\n");
  }

  /**
   * Format a number with specified decimal places
   */
  private formatNumber(
    value: number | undefined | null,
    decimals: number,
  ): string {
    if (value === undefined || value === null || isNaN(value)) return "N/A";
    return value.toFixed(decimals);
  }

  /**
   * Format a percentage
   */
  private formatPercent(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) return "N/A";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  }

  /**
   * Format market cap
   */
  private formatMarketCap(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) return "N/A";
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toLocaleString();
  }
}

/**
 * Create an output formatter with options
 */
export function createFormatter(
  options: { table?: boolean; pretty?: boolean } = {},
): OutputFormatter {
  return new OutputFormatter(options);
}
