import { Command } from "commander";
import { createYahooService } from "../services";
import { createSummaryFormatter, extractSummaryFields, type SummaryData } from "../formatters";
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
    .option("--table", "Output as table instead of JSON")
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
        const formatter = createSummaryFormatter(options);

        const modules = options.modules
          ?.split(",")
          .map((m) => m.trim() as QuoteSummaryModules);

        try {
          const summary = await yahooService.getSummary(symbol, modules);
          
          // For table output, extract key fields
          const summaryData: SummaryData = options.table
            ? {
                symbol,
                fields: extractSummaryFields(summary as Record<string, unknown>),
                raw: summary as Record<string, unknown>,
              }
            : {
                symbol,
                fields: [],
                raw: summary as Record<string, unknown>,
              };
          
          const output = formatter.format(summaryData);
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
