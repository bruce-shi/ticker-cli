import { Command } from "commander";
import { createYahooService } from "../services";
import { createFormatter } from "../utils";
import type { QuoteSummaryModules } from "yahoo-finance2/modules/quoteSummary";

/**
 * Create the summary command
 */
export function createSummaryCommand(): Command {
  const command = new Command("summary");

  command
    .description("Get quote summary for a symbol")
    .argument("<symbol>", "Stock symbol (e.g., AAPL)")
    .option(
      "-m, --modules <modules>",
      "Comma-separated modules to include (e.g., summaryProfile,summaryDetail)",
    )
    // .option("--table", "Output as table instead of JSON")
    .option("--pretty", "Pretty print JSON output", true)
    .action(
      async (
        symbol: string,
        options: {
          modules?: string;
          table?: boolean;
          pretty?: boolean;
        },
      ) => {
        const yahooService = createYahooService();
        const formatter = createFormatter(options);

        const modules = options.modules
          ?.split(",")
          .map((m) => m.trim() as QuoteSummaryModules);

        try {
          const summary = await yahooService.getSummary(symbol, modules);
          const output = formatter.format(summary);
          console.log(output);
        } catch (error) {
          console.error(
            "Error fetching summary:",
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );

  return command;
}
