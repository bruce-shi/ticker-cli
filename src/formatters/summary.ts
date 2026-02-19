import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";

/**
 * Summary data structure - key-value pairs for display
 * The actual quoteSummary from Yahoo Finance is complex, so we extract key fields
 */
export interface SummaryData {
  symbol: string;
  fields: Array<{
    field: string;
    value: string;
  }>;
  raw?: Record<string, unknown>;
}

/**
 * Formatter for quote summary data
 */
export class SummaryFormatter extends BaseFormatter<SummaryData> {
  formatTable(data: SummaryData): string {
    const table = new Table({
      title: `Quote Summary: ${data.symbol}`,
      columns: [
        { name: "field", title: "Field", alignment: "left" },
        { name: "value", title: "Value", alignment: "left" },
      ],
    });

    for (const item of data.fields) {
      table.addRow({
        field: item.field,
        value: item.value,
      });
    }

    return table.render();
  }
}

/**
 * Helper to format a number with optional unit
 */
function formatSummaryNumber(value: unknown, decimals = 2): string {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "number") {
    if (Math.abs(value) >= 1e12) {
      return `${(value / 1e12).toFixed(decimals)}T`;
    }
    if (Math.abs(value) >= 1e9) {
      return `${(value / 1e9).toFixed(decimals)}B`;
    }
    if (Math.abs(value) >= 1e6) {
      return `${(value / 1e6).toFixed(decimals)}M`;
    }
    return value.toFixed(decimals);
  }
  return String(value);
}

/**
 * Helper to extract key fields from quoteSummary for table display
 */
export function extractSummaryFields(
  summary: Record<string, unknown>,
): Array<{ field: string; value: string }> {
  const fields: Array<{ field: string; value: string }> = [];

  // Helper to add field if it exists
  const addField = (field: string, value: unknown, label?: string) => {
    if (value !== undefined && value !== null) {
      fields.push({
        field: label ?? field,
        value: formatSummaryNumber(value),
      });
    }
  };

  // Extract from summaryDetail
  const detail = summary.summaryDetail as Record<string, unknown> | undefined;
  if (detail) {
    addField("Previous Close", detail.previousClose);
    addField("Open", detail.open);
    addField("Day Low", detail.dayLow);
    addField("Day High", detail.dayHigh);
    addField("52 Week Low", detail.fiftyTwoWeekLow);
    addField("52 Week High", detail.fiftyTwoWeekHigh);
    addField("Volume", detail.volume);
    addField("Avg Volume", detail.averageVolume);
    addField("Market Cap", detail.marketCap);
    addField("PE Ratio (TTM)", detail.trailingPe);
    addField("Forward PE", detail.forwardPE);
    addField("Dividend Yield", detail.dividendYield);
    addField("Ex-Dividend Date", detail.exDividendDate);
  }

  // Extract from summaryProfile
  const profile = summary.summaryProfile as Record<string, unknown> | undefined;
  if (profile) {
    addField("Sector", profile.sector);
    addField("Industry", profile.industry);
    addField("Website", profile.website);
    addField("Employees", profile.fullTimeEmployees);
  }

  // Extract from financialData
  const financial = summary.financialData as
    | Record<string, unknown>
    | undefined;
  if (financial) {
    addField("Revenue", financial.totalRevenue);
    addField("Gross Profit", financial.grossProfits);
    addField("EBITDA", financial.ebitda);
    addField("Operating Cash Flow", financial.operatingCashflow);
    addField("Free Cash Flow", financial.freeCashflow);
    addField("Debt to Equity", financial.debtToEquity);
    addField("Return on Equity", financial.returnOnEquity);
    addField("Return on Assets", financial.returnOnAssets);
  }

  return fields;
}

/**
 * Create a summary formatter
 */
export function createSummaryFormatter(options: FormatterOptions = {}): {
  format: (data: SummaryData) => string;
} {
  const formatter = new SummaryFormatter();
  return {
    format: (data: SummaryData) => formatter.format(data, options),
  };
}
