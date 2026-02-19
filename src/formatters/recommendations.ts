import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";

/**
 * Recommendation trend from Yahoo Finance
 */
export interface RecommendationTrend {
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

/**
 * Recommendations data structure from Yahoo Finance
 */
export interface RecommendationsData {
  symbol: string;
  recommendations: RecommendationTrend[];
}

/**
 * Formatter for analyst recommendations
 */
export class RecommendationsFormatter extends BaseFormatter<RecommendationsData> {
  formatTable(data: RecommendationsData): string {
    const table = new Table({
      title: `Analyst Recommendations: ${data.symbol}`,
      columns: [
        { name: "period", title: "Period", alignment: "left" },
        { name: "strongBuy", title: "Strong Buy", alignment: "center" },
        { name: "buy", title: "Buy", alignment: "center" },
        { name: "hold", title: "Hold", alignment: "center" },
        { name: "sell", title: "Sell", alignment: "center" },
        { name: "strongSell", title: "Strong Sell", alignment: "center" },
        { name: "total", title: "Total", alignment: "center" },
      ],
    });

    for (const rec of data.recommendations) {
      const total =
        rec.strongBuy + rec.buy + rec.hold + rec.sell + rec.strongSell;
      table.addRow({
        period: rec.period,
        strongBuy: rec.strongBuy,
        buy: rec.buy,
        hold: rec.hold,
        sell: rec.sell,
        strongSell: rec.strongSell,
        total,
      });
    }

    return table.render();
  }
}

/**
 * Create a recommendations formatter
 */
export function createRecommendationsFormatter(
  options: FormatterOptions = {},
): {
  format: (data: RecommendationsData) => string;
} {
  const formatter = new RecommendationsFormatter();
  return {
    format: (data: RecommendationsData) => formatter.format(data, options),
  };
}
