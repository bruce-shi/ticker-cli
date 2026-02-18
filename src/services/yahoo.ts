import YahooFinance from "yahoo-finance2";
import type {
  Quote,
  ChartResult,
  ChartDataPoint,
  NewsResult,
  NewsItem,
  InsightsResult,
  OptionsResult,
  OptionContract,
  SummaryResult,
  RecommendationsResult,
  RecommendedSymbol,
  ScreenerResult,
  ScreenerQuote,
  SearchResult,
  PeriodPreset,
  IntervalType,
} from "../types";
import {
  parseDate,
  formatDate,
  intervalToYahooInterval,
  getDefaultInterval,
} from "../utils";
import type { Quote as YahooQuote } from "yahoo-finance2/modules/quote";
import type {
  ChartOptions,
  ChartResultArray,
  ChartResultArrayQuote,
} from "yahoo-finance2/modules/chart";
import type { SearchOptions, SearchNews } from "yahoo-finance2/modules/search";
import type { OptionsOptions, CallOrPut } from "yahoo-finance2/modules/options";
import type { QuoteSummaryModules } from "yahoo-finance2/modules/quoteSummary";
import type {
  ScreenerResult as YahooScreenerResult,
  ScreenerQuote as YahooScreenerQuote,
  PredefinedScreenerModules,
} from "yahoo-finance2/modules/screener";

// Create a single instance of YahooFinance
const yahooFinance = new YahooFinance();

/**
 * Yahoo Finance service wrapper
 */
export class YahooService {
  /**
   * Get stock quotes for one or more symbols
   */
  async getQuotes(symbols: string | string[]): Promise<Quote[]> {
    const symbolArray = Array.isArray(symbols) ? symbols : [symbols];

    const results = await yahooFinance.quote(symbolArray);
    return results.map((q: YahooQuote) => this.mapQuote(q));
  }

  private mapQuote(quote: YahooQuote): Quote {
    const regularMarketPrice = quote.regularMarketPrice ?? 0;
    const regularMarketPreviousClose = quote.regularMarketPreviousClose ?? 0;
    const change = regularMarketPrice - regularMarketPreviousClose;
    const changePercent =
      regularMarketPreviousClose !== 0
        ? (change / regularMarketPreviousClose) * 100
        : 0;

    return {
      symbol: quote.symbol ?? "",
      price: regularMarketPrice,
      change,
      changePercent,
      bid: quote.bid ?? undefined,
      ask: quote.ask ?? undefined,
      volume: quote.regularMarketVolume ?? undefined,
      avgVolume: quote.averageDailyVolume3Month ?? undefined,
      marketCap: quote.marketCap ?? undefined,
      pe: quote.trailingPE ?? undefined,
      open: quote.regularMarketOpen ?? undefined,
      high: quote.regularMarketDayHigh ?? undefined,
      low: quote.regularMarketDayLow ?? undefined,
      previousClose: regularMarketPreviousClose,
      timestamp: quote.regularMarketTime
        ? new Date(quote.regularMarketTime * 1000).toISOString()
        : new Date().toISOString(),
    };
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
  ): Promise<ChartResult> {
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
        case "1w":
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

    chartOptions.interval = intervalToYahooInterval(
      interval ?? getDefaultInterval(period ?? "1mo"),
    );

    const result = (await yahooFinance.chart(
      symbol,
      chartOptions,
    )) as ChartResultArray;

    return {
      symbol,
      period: period ?? undefined,
      interval: interval ?? getDefaultInterval(period ?? "1mo"),
      start: start ?? undefined,
      end: end ?? undefined,
      data: this.mapChartData(result),
    };
  }

  private mapChartData(result: ChartResultArray): ChartDataPoint[] {
    const quotes = result.quotes ?? [];

    return quotes
      .filter(
        (q: ChartResultArrayQuote): boolean =>
          q !== null && q.open !== null && q.close !== null,
      )
      .map((q: ChartResultArrayQuote, index: number) => ({
        date: q.date ? formatDate(new Date(q.date)) : `row-${index}`,
        open: q.open ?? 0,
        high: q.high ?? 0,
        low: q.low ?? 0,
        close: q.close ?? 0,
        volume: q.volume ?? 0,
        adjClose: q.adjclose ?? undefined,
      }));
  }

  /**
   * Get news for a symbol
   */
  async getNews(symbol: string, limit: number = 10): Promise<NewsResult> {
    const result = await yahooFinance.search(symbol, {
      newsCount: limit,
    });

    const news: NewsItem[] = (result.news ?? []).map((item: SearchNews) => ({
      title: item.title ?? "",
      publisher: item.publisher ?? "",
      link: item.link ?? "",
      published: item.providerPublishTime
        ? new Date(item.providerPublishTime).toISOString()
        : "",
      summary: undefined,
      thumbnail: item.thumbnail?.resolutions?.[0]?.url ?? undefined,
    }));

    return { symbol, news };
  }

  /**
   * Get insights for a symbol
   */
  async getInsights(symbol: string): Promise<InsightsResult> {
    try {
      const result = await yahooFinance.insights(symbol);
      return {
        symbol,
        insights: {
          instrumentInfo: result?.instrumentInfo
            ? {
                technicalEvents: JSON.stringify(
                  result.instrumentInfo.technicalEvents,
                ),
                valuation: JSON.stringify(result.instrumentInfo.valuation),
              }
            : undefined,
          companySnapshot: result?.companySnapshot
            ? {
                sector: result.companySnapshot.sectorInfo,
                industry: undefined,
              }
            : undefined,
        },
      };
    } catch {
      return {
        symbol,
        insights: {},
      };
    }
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

    const result = await yahooFinance.options(symbol, options);

    const mapContract = (
      contracts: CallOrPut[],
      expDate: string,
    ): OptionContract[] =>
      contracts.map((c) => ({
        strike: c.strike ?? 0,
        lastPrice: c.lastPrice ?? 0,
        bid: c.bid ?? 0,
        ask: c.ask ?? 0,
        volume: c.volume ?? 0,
        openInterest: c.openInterest ?? 0,
        impliedVolatility: (c.impliedVolatility ?? 0) * 100,
        inTheMoney: c.inTheMoney ?? false,
        expirationDate: expDate,
      }));

    const expDate = result.options[0]?.expirationDate
      ? formatDate(new Date(result.options[0].expirationDate))
      : "";

    return {
      symbol,
      expirationDate: expDate,
      calls: mapContract(result.options[0]?.calls ?? [], expDate),
      puts: mapContract(result.options[0]?.puts ?? [], expDate),
    };
  }

  /**
   * Get quote summary with specified modules
   */
  async getSummary(
    symbol: string,
    modules?: QuoteSummaryModules[],
  ): Promise<SummaryResult> {
    const defaultModules: QuoteSummaryModules[] = [
      "summaryProfile",
      "summaryDetail",
      "defaultKeyStatistics",
    ];

    const result = await yahooFinance.quoteSummary(symbol, {
      modules: modules ?? defaultModules,
    });

    return {
      symbol,
      summaryProfile: result.summaryProfile
        ? {
            sector: result.summaryProfile.sector ?? undefined,
            industry: result.summaryProfile.industry ?? undefined,
            description: result.summaryProfile.longBusinessSummary ?? undefined,
            website: result.summaryProfile.website ?? undefined,
            employees: result.summaryProfile.fullTimeEmployees ?? undefined,
            country: result.summaryProfile.country ?? undefined,
            city: result.summaryProfile.city ?? undefined,
          }
        : undefined,
      summaryDetail: result.summaryDetail
        ? {
            marketCap: result.summaryDetail.marketCap ?? undefined,
            peRatio: result.summaryDetail.trailingPE ?? undefined,
            dividendYield: result.summaryDetail.dividendYield ?? undefined,
            beta: result.summaryDetail.beta ?? undefined,
            fiftyTwoWeekHigh:
              result.summaryDetail.fiftyTwoWeekHigh ?? undefined,
            fiftyTwoWeekLow: result.summaryDetail.fiftyTwoWeekLow ?? undefined,
          }
        : undefined,
      defaultKeyStatistics: result.defaultKeyStatistics as
        | Record<string, unknown>
        | undefined,
      earnings: result.earnings as Record<string, unknown> | undefined,
      financials: result.financials as Record<string, unknown> | undefined,
    };
  }

  /**
   * Get analyst recommendations for a symbol
   */
  async getRecommendations(symbol: string): Promise<RecommendationsResult> {
    try {
      const result = await yahooFinance.recommendationsBySymbol([symbol]);

      const recommendedSymbols: RecommendedSymbol[] =
        result?.[0]?.recommendedSymbols?.map((rs) => ({
          symbol: rs.symbol ?? "",
          score: rs.score ?? 0,
        })) ?? [];

      return {
        symbol,
        recommendedSymbols,
      };
    } catch {
      return {
        symbol,
        recommendedSymbols: [],
      };
    }
  }

  /**
   * Get screener results
   */
  async getScreener(query: PredefinedScreenerModules): Promise<ScreenerResult> {
    try {
      const result = (await yahooFinance.screener(query, undefined, {
        validateResult: false,
      })) as YahooScreenerResult;

      const quotes: ScreenerQuote[] = (result.quotes ?? []).map(
        (q: YahooScreenerQuote) => ({
          symbol: q.symbol ?? "",
          name: q.shortName ?? q.symbol ?? "",
          price: q.regularMarketPrice ?? 0,
          change: q.regularMarketChange ?? 0,
          changePercent: q.regularMarketChangePercent ?? 0,
          volume: q.regularMarketVolume ?? 0,
        }),
      );

      return {
        query,
        quotes,
      };
    } catch {
      return {
        query,
        quotes: [],
      };
    }
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

    const result = await yahooFinance.search(query, searchOptions);

    return {
      query,
      quotes: (result.quotes ?? []).map((q) => ({
        symbol: String(q.symbol ?? ""),
        name: String(q.shortname ?? q.longname ?? ""),
        exchange: String(q.exchange ?? ""),
        type: "quoteType" in q ? String(q.quoteType) : "",
      })),
      news: options.includeNews
        ? (result.news ?? []).map((item) => ({
            title: String(item.title ?? ""),
            publisher: String(item.publisher ?? ""),
            link: String(item.link ?? ""),
            published: item.providerPublishTime
              ? new Date(item.providerPublishTime).toISOString()
              : "",
            summary: undefined,
          }))
        : undefined,
    };
  }
}

/**
 * Create a YahooService instance
 */
export function createYahooService(): YahooService {
  return new YahooService();
}
