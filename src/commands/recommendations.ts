import { Command } from "commander";
import { createYahooService } from "../services";
import {
  createRecommendationsFormatter,
  type RecommendationsData,
} from "../formatters";

/**
 * Create the recommendations command
 */
export function createRecommendationsCommand(): Command {
  const command = new Command("recommendations");

  command
    .description("Get analyst recommendations for a symbol")
    .argument("<symbol>", "Stock symbol (e.g., AAPL)")
    .option("--table", "Output as table instead of JSON")
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
        const formatter = createRecommendationsFormatter(options);

        try {
          const result = await yahooService.getRecommendations(symbol);

          // Use raw data and cast to our format
          const recommendations = result as unknown as RecommendationsData;

          const output = formatter.format(recommendations);
          console.log(output);
        } catch (error) {
          console.error(
            "Error fetching recommendations:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
