import { Command } from "commander";
import { createYahooService } from "../services";
import { createQuoteFormatter, type QuoteData } from "../formatters";

/**
 * Create the quote command
 */
export function createQuoteCommand(): Command {
  const command = new Command("quote");

  command
    .description("Get stock quotes for one or more symbols")
    .argument("<symbols...>", "Stock symbols (e.g., AAPL MSFT GOOGL)")
    .option("--table [TABLE]", "Output as table instead of JSON")
    .option("--pretty [PRETTY]", "Pretty print JSON output", true)
    .action(
      async (
        symbols: string[],
        options: { table?: boolean; pretty?: boolean },
      ) => {
        const yahooService = createYahooService();
        const formatter = createQuoteFormatter(options);

        try {
          const quotes = await yahooService.getQuotes(symbols);
          const output = formatter.format({ quotes } as QuoteData);
          console.log(output);
        } catch (error) {
          console.error(
            "Error fetching quotes:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
