import { Command } from "commander";
import { createYahooService } from "../services";
import { createOptionsFormatter } from "../formatters";
import type { OptionsResult } from "yahoo-finance2/modules/options";

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
        const formatter = createOptionsFormatter(options);

        try {
          const optionsData = await yahooService.getOptions(
            symbol,
            options.date,
          );

          // Filter calls/puts if requested
          let dataToFormat: OptionsResult;
          if (options.calls && !options.puts) {
            // Create a copy with only calls
            dataToFormat = {
              ...optionsData,
              puts: [],
            } as OptionsResult;
          } else if (options.puts && !options.calls) {
            // Create a copy with only puts
            dataToFormat = {
              ...optionsData,
              calls: [],
            } as OptionsResult;
          } else {
            dataToFormat = optionsData as OptionsResult;
          }

          const output = formatter.format(dataToFormat);
          console.log(output);
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
