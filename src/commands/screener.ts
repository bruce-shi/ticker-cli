import { Command } from "commander";
import { createYahooService } from "../services";
import { createFormatter } from "../utils";
import type { PredefinedScreenerModules } from "yahoo-finance2/modules/screener";

const PREDEFINED_QUERIES: PredefinedScreenerModules[] = [
  "most_actives",
  "day_gainers",
  "day_losers",
  "undervalued_growth_stocks",
  "undervalued_large_caps",
  "growth_technology_stocks",
  "top_mutual_funds",
];

/**
 * Create the screener command
 */
export function createScreenerCommand(): Command {
  const command = new Command("screener");

  command
    .description("Screen stocks using predefined queries")
    .option(
      "-q, --query <query>",
      `Predefined query: ${PREDEFINED_QUERIES.join(", ")}`,
      "most_actives",
    )
    // .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (options: {
        query?: string;
        table?: boolean;
        pretty?: boolean;
      }) => {
        const yahooService = createYahooService();
        const formatter = createFormatter(options);

        const query = (options.query ??
          "most_actives") as PredefinedScreenerModules;

        try {
          const screenerData = await yahooService.getScreener(query);
          const output = formatter.format(screenerData);
          console.log(output);
        } catch (error) {
          console.error(
            "Error fetching screener data:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
