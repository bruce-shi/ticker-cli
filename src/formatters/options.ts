import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";
import type { OptionsResult } from "yahoo-finance2/modules/options";

/**
 * Option contract type (extracted from OptionsResult)
 */
export interface OptionContract {
  contractSymbol: string;
  strike: number;
  currency?: string;
  lastPrice?: number | null;
  change?: number | null;
  percentChange?: number | null;
  volume?: number | null;
  openInterest?: number | null;
  bid?: number | null;
  ask?: number | null;
  contractSize?: string;
  expiration?: number | null;
  lastTradeDate?: number | null;
  impliedVolatility?: number | null;
  inTheMoney?: boolean;
}

/**
 * Formatter for options chain data
 * Uses the actual OptionsResult type from yahoo-finance2
 */
export class OptionsFormatter extends BaseFormatter<OptionsResult> {
  formatTable(data: OptionsResult): string {
    const tables: string[] = [];
    const expirationDate = data.expirationDate;
    const expirationStr = expirationDate
      ? new Date(expirationDate as number).toLocaleDateString()
      : "N/A";

    // Header info
    const headerTable = new Table({
      title: `Options Chain: ${data.underlyingSymbol ?? "Unknown"}`,
      columns: [
        { name: "field", title: "Field", alignment: "left" },
        { name: "value", title: "Value", alignment: "left" },
      ],
    });

    headerTable.addRow({ field: "Expiration", value: expirationStr });
    if (data.quote?.regularMarketPrice) {
      headerTable.addRow({
        field: "Current Price",
        value: this.formatNumber(data.quote.regularMarketPrice as number),
      });
    }

    tables.push(headerTable.render());

    // Calls table
    const calls = data.calls as OptionContract[] | undefined;
    if (calls && Array.isArray(calls) && calls.length > 0) {
      const callsTable = new Table({
        title: "Calls",
        columns: [
          { name: "strike", title: "Strike", alignment: "right" },
          { name: "bid", title: "Bid", alignment: "right" },
          { name: "ask", title: "Ask", alignment: "right" },
          { name: "last", title: "Last", alignment: "right" },
          { name: "change", title: "Change", alignment: "right" },
          { name: "volume", title: "Vol", alignment: "right" },
          { name: "oi", title: "OI", alignment: "right" },
          { name: "iv", title: "IV", alignment: "right" },
          { name: "itm", title: "ITM", alignment: "center" },
        ],
      });

      // Show first 20 calls for readability
      for (const call of calls.slice(0, 20)) {
        callsTable.addRow({
          strike: this.formatNumber(call.strike),
          bid: this.formatNumber(call.bid),
          ask: this.formatNumber(call.ask),
          last: this.formatNumber(call.lastPrice),
          change: this.formatNumber(call.change),
          volume: this.formatVolume(call.volume),
          oi: this.formatVolume(call.openInterest),
          iv: call.impliedVolatility
            ? `${(call.impliedVolatility * 100).toFixed(1)}%`
            : "N/A",
          itm: call.inTheMoney ? "✓" : "",
        });
      }

      if (calls.length > 20) {
        tables.push(
          callsTable.render() + `\n... and ${calls.length - 20} more contracts`,
        );
      } else {
        tables.push(callsTable.render());
      }
    }

    // Puts table
    const puts = data.puts as OptionContract[] | undefined;
    if (puts && Array.isArray(puts) && puts.length > 0) {
      const putsTable = new Table({
        title: "Puts",
        columns: [
          { name: "strike", title: "Strike", alignment: "right" },
          { name: "bid", title: "Bid", alignment: "right" },
          { name: "ask", title: "Ask", alignment: "right" },
          { name: "last", title: "Last", alignment: "right" },
          { name: "change", title: "Change", alignment: "right" },
          { name: "volume", title: "Vol", alignment: "right" },
          { name: "oi", title: "OI", alignment: "right" },
          { name: "iv", title: "IV", alignment: "right" },
          { name: "itm", title: "ITM", alignment: "center" },
        ],
      });

      // Show first 20 puts for readability
      for (const put of puts.slice(0, 20)) {
        putsTable.addRow({
          strike: this.formatNumber(put.strike),
          bid: this.formatNumber(put.bid),
          ask: this.formatNumber(put.ask),
          last: this.formatNumber(put.lastPrice),
          change: this.formatNumber(put.change),
          volume: this.formatVolume(put.volume),
          oi: this.formatVolume(put.openInterest),
          iv: put.impliedVolatility
            ? `${(put.impliedVolatility * 100).toFixed(1)}%`
            : "N/A",
          itm: put.inTheMoney ? "✓" : "",
        });
      }

      if (puts.length > 20) {
        tables.push(
          putsTable.render() + `\n... and ${puts.length - 20} more contracts`,
        );
      } else {
        tables.push(putsTable.render());
      }
    }

    return tables.join("\n\n");
  }
}

/**
 * Create an options formatter
 */
export function createOptionsFormatter(options: FormatterOptions = {}): {
  format: (data: OptionsResult) => string;
} {
  const formatter = new OptionsFormatter();
  return {
    format: (data: OptionsResult) => formatter.format(data, options),
  };
}

// Re-export type for convenience
export type { OptionsResult as OptionsData } from "yahoo-finance2/modules/options";
