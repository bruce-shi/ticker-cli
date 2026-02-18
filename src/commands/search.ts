import { Command } from "commander";
import { createYahooService } from "../services";
import { createFormatter } from "../utils";

/**
 * Create the search command
 */
export function createSearchCommand(): Command {
  const command = new Command("search");

  command
    .description("Search for stock symbols")
    .argument("<query>", "Search query (e.g., apple)")
    .option("--quotes", "Include quotes in results")
    .option("--news", "Include news in results")
    .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (
        query: string,
        options: {
          quotes?: boolean;
          news?: boolean;
          table?: boolean;
          pretty?: boolean;
        },
      ) => {
        const yahooService = createYahooService();
        const formatter = createFormatter(options);

        try {
          const result = await yahooService.search(query, {
            includeQuotes: options.quotes,
            includeNews: options.news,
          });
          const output = formatter.format(result);
          console.log(output);
        } catch (error) {
          console.error(
            "Error searching symbols:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
