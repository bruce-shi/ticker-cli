import { Command } from "commander";
import { createYahooService } from "../services";
import { createFormatter } from "../utils";

/**
 * Create the insights command
 */
export function createInsightsCommand(): Command {
  const command = new Command("insights");

  command
    .description("Get insights for a symbol")
    .argument("<symbol>", "Stock symbol (e.g., AAPL)")
    // .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (
        symbol: string,
        options: {
          table?: boolean;
          pretty?: boolean;
        },
      ) => {
        const yahooService = createYahooService();
        const formatter = createFormatter(options);

        try {
          const insights = await yahooService.getInsights(symbol);
          const output = formatter.format(insights);
          console.log(output);
        } catch (error) {
          console.error(
            "Error fetching insights:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
