import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";
import type { IndicatorDataPoint } from "../types";

/**
 * Indicator result data
 */
export interface IndicatorData {
  symbol: string;
  indicator: string;
  config?: Record<string, number>;
  data: IndicatorDataPoint[];
}

/**
 * Formatter for technical indicator data
 */
export class IndicatorFormatter extends BaseFormatter<IndicatorData> {
  formatTable(data: IndicatorData): string {
    const indicator = data.indicator.toLowerCase();
    const configStr = data.config
      ? Object.entries(data.config)
          .map(([k, v]) => `${k}=${v}`)
          .join(", ")
      : "";

    const title = `${data.indicator.toUpperCase()}${configStr ? ` (${configStr})` : ""}: ${data.symbol}`;

    // Determine columns based on indicator type
    if (indicator === "macd") {
      return this.formatMacdTable(data, title);
    } else if (indicator === "bb") {
      return this.formatBollingerTable(data, title);
    } else {
      return this.formatSingleValueTable(data, title);
    }
  }

  /**
   * Format table for single-value indicators (SMA, EMA, RSI)
   */
  private formatSingleValueTable(data: IndicatorData, title: string): string {
    const table = new Table({
      title,
      columns: [
        { name: "date", title: "Date", alignment: "left" },
        {
          name: "value",
          title: data.indicator.toUpperCase(),
          alignment: "right",
        },
      ],
    });

    // Show last 30 data points for readability
    // const points = data.data.slice(-30);

    for (const point of data.data) {
      table.addRow({
        date: this.formatDate(point.date),
        value: this.formatNumber(point.value),
      });
    }

    return table.render();
  }

  /**
   * Format table for MACD indicator
   */
  private formatMacdTable(data: IndicatorData, title: string): string {
    const table = new Table({
      title,
      columns: [
        { name: "date", title: "Date", alignment: "left" },
        { name: "macd", title: "MACD", alignment: "right" },
        { name: "signal", title: "Signal", alignment: "right" },
        { name: "histogram", title: "Histogram", alignment: "right" },
      ],
    });

    // Show last 30 data points for readability
    // const points = data.data.slice(-30);

    for (const point of data.data) {
      table.addRow({
        date: this.formatDate(point.date),
        macd: this.formatNumber(point.macd),
        signal: this.formatNumber(point.signal),
        histogram: this.formatNumber(point.histogram),
      });
    }

    return table.render();
  }

  /**
   * Format table for Bollinger Bands indicator
   */
  private formatBollingerTable(data: IndicatorData, title: string): string {
    const table = new Table({
      title,
      columns: [
        { name: "date", title: "Date", alignment: "left" },
        { name: "upper", title: "Upper", alignment: "right" },
        { name: "middle", title: "Middle", alignment: "right" },
        { name: "lower", title: "Lower", alignment: "right" },
      ],
    });

    // Show last 30 data points for readability
    // const points = data.data.slice(-30);

    for (const point of data.data) {
      table.addRow({
        date: this.formatDate(point.date),
        upper: this.formatNumber(point.upper),
        middle: this.formatNumber(point.middle),
        lower: this.formatNumber(point.lower),
      });
    }

    return table.render();
  }
}

/**
 * Create an indicator formatter
 */
export function createIndicatorFormatter(options: FormatterOptions = {}): {
  format: (data: IndicatorData) => string;
} {
  const formatter = new IndicatorFormatter();
  return {
    format: (data: IndicatorData) => formatter.format(data, options),
  };
}
