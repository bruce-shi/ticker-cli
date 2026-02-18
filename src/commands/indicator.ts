import { Command } from "commander";
import { createYahooService, createIndicatorService } from "../services";
import { createFormatter, isValidPeriod } from "../utils";
import type { PeriodPreset } from "../types";

const AVAILABLE_INDICATORS = ["sma", "ema", "rsi", "macd", "bb"] as const;

/**
 * Create the indicator command
 */
export function createIndicatorCommand(): Command {
  const command = new Command("indicator");

  command
    .description(
      `Calculate technical indicators. Available: ${AVAILABLE_INDICATORS.join(", ")}`,
    )
    .argument("<symbol>", "Stock symbol (e.g., AAPL)")
    .argument(
      "<indicator>",
      `Indicator type: ${AVAILABLE_INDICATORS.join(", ")}`,
    )
    .option(
      "-p, --period <period>",
      "Preset period for historical data: 1d, 5d, 1wk, 1mo, 3mo, 6mo, 1y, 2y, 5y",
      "3mo",
    )
    .option("-s, --start <date>", "Start date (YYYY-MM-DD)")
    .option("-e, --end <date>", "End date (YYYY-MM-DD)")
    .option(
      "--length <number>",
      "Period length for SMA/EMA/RSI/BB (default: 20 for SMA/EMA/BB, 14 for RSI)",
    )
    .option("--short <number>", "Short period for MACD (default: 12)")
    .option("--long <number>", "Long period for MACD (default: 26)")
    .option("--signal <number>", "Signal period for MACD (default: 9)")
    // .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (
        symbol: string,
        indicator: string,
        options: {
          period?: string;
          start?: string;
          end?: string;
          length?: string;
          short?: string;
          long?: string;
          signal?: string;
          table?: boolean;
          pretty?: boolean;
        },
      ) => {
        const yahooService = createYahooService();
        const indicatorService = createIndicatorService();
        const formatter = createFormatter(options);

        // Validate indicator
        const normalizedIndicator = indicator.toLowerCase();
        if (
          !AVAILABLE_INDICATORS.includes(
            normalizedIndicator as (typeof AVAILABLE_INDICATORS)[number],
          )
        ) {
          console.error(
            `Invalid indicator: ${indicator}. Available: ${AVAILABLE_INDICATORS.join(", ")}`,
          );
          process.exit(1);
        }

        // Validate period
        let period: PeriodPreset | undefined;
        if (options.period) {
          if (!isValidPeriod(options.period)) {
            console.error(
              `Invalid period: ${options.period}. Valid options: 1d, 5d, 1wk, 1mo, 3mo, 6mo, 1y, 2y, 5y`,
            );
            process.exit(1);
          }
          period = options.period as PeriodPreset;
        }

        // Parse numeric options
        const config: {
          length?: number;
          short?: number;
          long?: number;
          signal?: number;
        } = {};

        if (options.length) {
          config.length = parseInt(options.length, 10);
          if (isNaN(config.length)) {
            console.error("Invalid length value");
            process.exit(1);
          }
        }
        if (options.short) {
          config.short = parseInt(options.short, 10);
          if (isNaN(config.short)) {
            console.error("Invalid short value");
            process.exit(1);
          }
        }
        if (options.long) {
          config.long = parseInt(options.long, 10);
          if (isNaN(config.long)) {
            console.error("Invalid long value");
            process.exit(1);
          }
        }
        if (options.signal) {
          config.signal = parseInt(options.signal, 10);
          if (isNaN(config.signal)) {
            console.error("Invalid signal value");
            process.exit(1);
          }
        }

        try {
          // Fetch chart data
          const chartData = await yahooService.getChart(symbol, {
            period,
            start: options.start,
            end: options.end,
          });

          // Calculate indicator
          const indicatorResult = indicatorService.calculate(
            normalizedIndicator,
            chartData.quotes,
            config,
          );

          // Add symbol to result
          indicatorResult.symbol = symbol;

          const output = formatter.format(indicatorResult);
          console.log(output);
        } catch (error) {
          console.error(
            "Error calculating indicator:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
