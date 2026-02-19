import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";

/**
 * Insights data structure from Yahoo Finance
 * Shows summary of key insight metrics
 */
export interface InsightsData {
  symbol: string;
  instrumentInfo?: {
    technicalEvents?: {
      provider?: string;
      shortTerm?: string;
      midTerm?: string;
      longTerm?: string;
    };
    keyTechnicals?: {
      provider?: string;
      support?: number;
      resistance?: number;
      stopLoss?: number;
    };
  };
  recommendation?: {
    targetPrice?: number;
    provider?: string;
    rating?: string;
  };
  companySnapshot?: {
    sectorInfo?: {
      sector?: string;
      industry?: string;
    };
    innovativeness?: number;
    hiring?: number;
    sustainability?: number;
    insiderSentiments?: number;
    earningsReports?: number;
    dividends?: number;
  };
  [key: string]: unknown;
}

/**
 * Formatter for insights data
 */
export class InsightsFormatter extends BaseFormatter<InsightsData> {
  formatTable(data: InsightsData): string {
    const tables: string[] = [];

    // Technical Analysis Table
    if (
      data.instrumentInfo?.technicalEvents ||
      data.instrumentInfo?.keyTechnicals
    ) {
      const techTable = new Table({
        title: `Technical Analysis: ${data.symbol}`,
        columns: [
          { name: "metric", title: "Metric", alignment: "left" },
          { name: "value", title: "Value", alignment: "left" },
        ],
      });

      const techEvents = data.instrumentInfo.technicalEvents;
      if (techEvents) {
        techTable.addRow({
          metric: "Short Term",
          value: techEvents.shortTerm ?? "-",
        });
        techTable.addRow({
          metric: "Mid Term",
          value: techEvents.midTerm ?? "-",
        });
        techTable.addRow({
          metric: "Long Term",
          value: techEvents.longTerm ?? "-",
        });
      }

      const keyTech = data.instrumentInfo.keyTechnicals;
      if (keyTech) {
        techTable.addRow({
          metric: "Support",
          value: this.formatNumber(keyTech.support),
        });
        techTable.addRow({
          metric: "Resistance",
          value: this.formatNumber(keyTech.resistance),
        });
        techTable.addRow({
          metric: "Stop Loss",
          value: this.formatNumber(keyTech.stopLoss),
        });
      }

      tables.push(techTable.render());
    }

    // Recommendation Table
    if (data.recommendation) {
      const recTable = new Table({
        title: "Recommendation",
        columns: [
          { name: "metric", title: "Metric", alignment: "left" },
          { name: "value", title: "Value", alignment: "left" },
        ],
      });

      recTable.addRow({
        metric: "Rating",
        value: data.recommendation.rating ?? "-",
      });
      recTable.addRow({
        metric: "Target Price",
        value: this.formatNumber(data.recommendation.targetPrice),
      });

      tables.push(recTable.render());
    }

    // Company Snapshot Table
    if (data.companySnapshot) {
      const snapTable = new Table({
        title: "Company Snapshot",
        columns: [
          { name: "metric", title: "Metric", alignment: "left" },
          { name: "value", title: "Value", alignment: "left" },
        ],
      });

      const snap = data.companySnapshot;
      if (snap.sectorInfo) {
        snapTable.addRow({
          metric: "Sector",
          value: snap.sectorInfo.sector ?? "-",
        });
        snapTable.addRow({
          metric: "Industry",
          value: snap.sectorInfo.industry ?? "-",
        });
      }
      if (snap.innovativeness !== undefined) {
        snapTable.addRow({
          metric: "Innovativeness",
          value: snap.innovativeness.toFixed(2),
        });
      }
      if (snap.hiring !== undefined) {
        snapTable.addRow({ metric: "Hiring", value: snap.hiring.toFixed(2) });
      }
      if (snap.sustainability !== undefined) {
        snapTable.addRow({
          metric: "Sustainability",
          value: snap.sustainability.toFixed(2),
        });
      }
      if (snap.insiderSentiments !== undefined) {
        snapTable.addRow({
          metric: "Insider Sentiments",
          value: snap.insiderSentiments.toFixed(2),
        });
      }

      tables.push(snapTable.render());
    }

    // If no specific data, show generic info
    if (tables.length === 0) {
      const genericTable = new Table({
        title: `Insights: ${data.symbol}`,
        columns: [
          { name: "metric", title: "Metric", alignment: "left" },
          { name: "value", title: "Value", alignment: "left" },
        ],
      });
      genericTable.addRow({ metric: "Symbol", value: data.symbol });
      tables.push(genericTable.render());
    }

    return tables.join("\n\n");
  }
}

/**
 * Create an insights formatter
 */
export function createInsightsFormatter(options: FormatterOptions = {}): {
  format: (data: InsightsData) => string;
} {
  const formatter = new InsightsFormatter();
  return {
    format: (data: InsightsData) => formatter.format(data, options),
  };
}
