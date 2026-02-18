import { Command } from "commander";
import { createYahooService } from "../services";
import { createFormatter, isValidPeriod, isValidInterval } from "../utils";
import type { PeriodPreset, IntervalType } from "../types";

/**
 * Create the chart command
 */
export function createChartCommand(): Command {
  const command = new Command("chart");

  command
    .description("Get chart/historical data for a symbol")
    .argument("<symbol>", "Stock symbol (e.g., AAPL)")
    .option(
      "-p, --period <period>",
      "Preset period: 1d, 5d, 1w, 1mo, 3mo, 6mo, 1y, 2y, 5y",
    )
    .option("-s, --start <date>", "Start date (YYYY-MM-DD)")
    .option("-e, --end <date>", "End date (YYYY-MM-DD)")
    .option(
      "-i, --interval <interval>",
      "Interval: 1m, 5m, 15m, 30m, 1h, 1d, 1w, 1mo",
    )
    .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (
        symbol: string,
        options: {
          period?: string;
          start?: string;
          end?: string;
          interval?: string;
          table?: boolean;
          pretty?: boolean;
        },
      ) => {
        const yahooService = createYahooService();
        const formatter = createFormatter(options);

        // Validate period if provided
        let period: PeriodPreset | undefined;
        if (options.period) {
          if (!isValidPeriod(options.period)) {
            console.error(
              `Invalid period: ${options.period}. Valid options: 1d, 5d, 1w, 1mo, 3mo, 6mo, 1y, 2y, 5y`,
            );
            process.exit(1);
          }
          period = options.period as PeriodPreset;
        }

        // Validate interval if provided
        let interval: IntervalType | undefined;
        if (options.interval) {
          if (!isValidInterval(options.interval)) {
            console.error(
              `Invalid interval: ${options.interval}. Valid options: 1m, 5m, 15m, 30m, 1h, 1d, 1w, 1mo`,
            );
            process.exit(1);
          }
          interval = options.interval as IntervalType;
        }

        // Validate date range
        if (options.start && options.end) {
          const startDate = new Date(options.start);
          const endDate = new Date(options.end);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error("Invalid date format. Use YYYY-MM-DD");
            process.exit(1);
          }
          if (startDate >= endDate) {
            console.error("Start date must be before end date");
            process.exit(1);
          }
        }

        try {
          const chartData = await yahooService.getChart(symbol, {
            period,
            start: options.start,
            end: options.end,
            interval,
          });
          const output = formatter.format(chartData);
          console.log(output);
        } catch (error) {
          console.error(
            "Error fetching chart data:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
