import { Command } from "commander";
import { createYahooService } from "../services";
import { createFormatter } from "../utils";

/**
 * Create the news command
 */
export function createNewsCommand(): Command {
  const command = new Command("news");

  command
    .description("Get news for a symbol")
    .argument("<symbol>", "Stock symbol (e.g., AAPL)")
    .option("-l, --limit <number>", "Number of news articles", "10")
    .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (
        symbol: string,
        options: {
          limit?: string;
          table?: boolean;
          pretty?: boolean;
        },
      ) => {
        const yahooService = createYahooService();
        const formatter = createFormatter(options);

        const limit = options.limit ? parseInt(options.limit, 10) : 10;

        try {
          const news = await yahooService.getNews(symbol, limit);
          const output = formatter.format(news);
          console.log(output);
        } catch (error) {
          console.error(
            "Error fetching news:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
