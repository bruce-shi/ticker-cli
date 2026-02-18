import { Command } from "commander";
import { createYahooService } from "../services";
import { createFormatter } from "../utils";

/**
 * Create the options command
 */
export function createOptionsCommand(): Command {
  const command = new Command("options");

  command
    .description("Get options chain for a symbol")
    .argument("<symbol>", "Stock symbol (e.g., AAPL)")
    .option("-d, --date <date>", "Expiration date (YYYY-MM-DD)")
    .option("--calls", "Show only calls")
    .option("--puts", "Show only puts")
    .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (
        symbol: string,
        options: {
          date?: string;
          calls?: boolean;
          puts?: boolean;
          table?: boolean;
          pretty?: boolean;
        },
      ) => {
        const yahooService = createYahooService();
        const formatter = createFormatter(options);

        try {
          const optionsData = await yahooService.getOptions(
            symbol,
            options.date,
          );

          // Filter calls/puts if requested
          if (options.calls && !options.puts) {
            const output = formatter.format({
              symbol: optionsData.symbol,
              expirationDate: optionsData.expirationDate,
              calls: optionsData.calls,
            });
            console.log(output);
          } else if (options.puts && !options.calls) {
            const output = formatter.format({
              symbol: optionsData.symbol,
              expirationDate: optionsData.expirationDate,
              puts: optionsData.puts,
            });
            console.log(output);
          } else {
            const output = formatter.format(optionsData);
            console.log(output);
          }
        } catch (error) {
          console.error(
            "Error fetching options:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
