import YahooFinance from "yahoo-finance2";
import type { PeriodPreset, IntervalType } from "../types";
import { parseDate, getDefaultInterval } from "../utils";
import type { QuoteResponseArray } from "yahoo-finance2/modules/quote";
import type {
  ChartOptions,
  ChartResultArray,
} from "yahoo-finance2/modules/chart";
import type {
  SearchOptions,
  SearchResult,
} from "yahoo-finance2/modules/search";
import type {
  OptionsOptions,
  OptionsResult,
} from "yahoo-finance2/modules/options";
import type {
  QuoteSummaryModules,
  QuoteSummaryResult,
} from "yahoo-finance2/modules/quoteSummary";
import type {
  ScreenerResult,
  PredefinedScreenerModules,
} from "yahoo-finance2/modules/screener";
import type { InsightsResult } from "yahoo-finance2/modules/insights";
import type { RecommendationsBySymbolResponseArray } from "yahoo-finance2/modules/recommendationsBySymbol";

// Create a single instance of YahooFinance
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

/**
 * Yahoo Finance service wrapper
 */
export class YahooService {
  /**
   * Get stock quotes for one or more symbols
   */
  async getQuotes(symbols: string | string[]): Promise<QuoteResponseArray> {
    const symbolArray = Array.isArray(symbols) ? symbols : [symbols];

    return await yahooFinance.quote(symbolArray);
  }

  /**
   * Get chart/historical data for a symbol
   */
  async getChart(
    symbol: string,
    options: {
      period?: PeriodPreset;
      start?: string;
      end?: string;
      interval?: IntervalType;
    } = {},
  ): Promise<ChartResultArray> {
    const { period, start, end, interval } = options;

    const chartOptions: ChartOptions = {
      period1: new Date(),
    };

    // Calculate date range from period or use provided dates
    if (start && end) {
      chartOptions.period1 = parseDate(start);
      chartOptions.period2 = parseDate(end);
    } else {
      // Use period to calculate period1 (period2 defaults to now)
      const now = new Date();
      const period1 = new Date();

      const periodValue = period ?? "1mo";
      switch (periodValue) {
        case "1d":
          period1.setDate(now.getDate() - 1);
          break;
        case "5d":
          period1.setDate(now.getDate() - 5);
          break;
        case "1wk":
          period1.setDate(now.getDate() - 7);
          break;
        case "1mo":
          period1.setMonth(now.getMonth() - 1);
          break;
        case "3mo":
          period1.setMonth(now.getMonth() - 3);
          break;
        case "6mo":
          period1.setMonth(now.getMonth() - 6);
          break;
        case "1y":
          period1.setFullYear(now.getFullYear() - 1);
          break;
        case "2y":
          period1.setFullYear(now.getFullYear() - 2);
          break;
        case "5y":
          period1.setFullYear(now.getFullYear() - 5);
          break;
      }

      chartOptions.period1 = period1;
      chartOptions.period2 = now;
    }

    chartOptions.interval = interval ?? getDefaultInterval(period ?? "1mo");

    return (await yahooFinance.chart(symbol, chartOptions)) as ChartResultArray;
  }

  /**
   * Get news for a symbol
   */
  async getNews(symbol: string, limit: number = 10): Promise<SearchResult> {
    return yahooFinance.search(symbol, {
      newsCount: limit,
    });
  }

  /**
   * Get insights for a symbol
   */
  async getInsights(symbol: string): Promise<InsightsResult> {
    const result = await yahooFinance.insights(symbol);
    return result;
  }

  /**
   * Get options chain for a symbol
   */
  async getOptions(
    symbol: string,
    expirationDate?: string,
  ): Promise<OptionsResult> {
    const options: OptionsOptions = {};
    if (expirationDate) {
      options.date = parseDate(expirationDate);
    }
    return yahooFinance.options(symbol, options);
  }

  /**
   * Get quote summary with specified modules
   */
  async getSummary(
    symbol: string,
    modules?: QuoteSummaryModules[],
  ): Promise<QuoteSummaryResult> {
    const defaultModules: QuoteSummaryModules[] = [
      "summaryProfile",
      "summaryDetail",
      "defaultKeyStatistics",
    ];

    return yahooFinance.quoteSummary(symbol, {
      modules: modules ?? defaultModules,
    });
  }

  /**
   * Get analyst recommendations for a symbol
   */
  async getRecommendations(
    symbol: string,
  ): Promise<RecommendationsBySymbolResponseArray> {
    return yahooFinance.recommendationsBySymbol([symbol]);
  }

  /**
   * Get screener results
   */
  async getScreener(query: PredefinedScreenerModules): Promise<ScreenerResult> {
    return (await yahooFinance.screener(query, undefined, {
      validateResult: false,
    })) as ScreenerResult;
  }

  /**
   * Search for symbols
   */
  async search(
    query: string,
    options: { includeQuotes?: boolean; includeNews?: boolean } = {},
  ): Promise<SearchResult> {
    const searchOptions: SearchOptions = {};

    if (options.includeQuotes) {
      searchOptions.quotesCount = 10;
    }
    if (options.includeNews) {
      searchOptions.newsCount = 5;
    }

    return yahooFinance.search(query, searchOptions);
  }
}

/**
 * Create a YahooService instance
 */
export function createYahooService(): YahooService {
  return new YahooService();
}
