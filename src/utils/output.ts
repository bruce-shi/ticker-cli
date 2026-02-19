/**
 * Output utilities
 *
 * Note: Formatters are now decentralized and specific to each command.
 * See src/formatters/ for individual formatter implementations.
 *
 * This file is kept for backwards compatibility and re-exports.
 */

// Re-export formatters for backwards compatibility
export {
  BaseFormatter,
  type DataFormatter,
  type FormatterOptions,
} from "../formatters/types";

export { createQuoteFormatter, type QuoteData } from "../formatters/quote";
export { createChartFormatter, type ChartData } from "../formatters/chart";
export { createSearchFormatter, type SearchData } from "../formatters/search";
export {
  createSummaryFormatter,
  type SummaryData,
} from "../formatters/summary";
export { createNewsFormatter, type NewsData } from "../formatters/news";
export {
  createInsightsFormatter,
  type InsightsData,
} from "../formatters/insights";
export {
  createOptionsFormatter,
  type OptionsData,
} from "../formatters/options";
export {
  createRecommendationsFormatter,
  type RecommendationsData,
} from "../formatters/recommendations";
export {
  createScreenerFormatter,
  type ScreenerData,
} from "../formatters/screener";
export {
  createIndicatorFormatter,
  type IndicatorData,
} from "../formatters/indicator";
