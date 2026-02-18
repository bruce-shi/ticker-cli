#!/usr/bin/env node
import { Command } from "commander";
import {
  createQuoteCommand,
  createChartCommand,
  createSearchCommand,
  createSummaryCommand,
  createNewsCommand,
  createInsightsCommand,
  createOptionsCommand,
  createRecommendationsCommand,
  createScreenerCommand,
  createIndicatorCommand,
} from "./src/commands";

const program = new Command();

program
  .name("ticker-cli")
  .description(
    "Trading analysis CLI - stock quotes, charts, indicators, and more",
  )
  .version("1.0.0")
  .option("--table", "Output as table instead of JSON (global option)")
  .option("--pretty", "Pretty print JSON output", true);

// Add all commands
program.addCommand(createQuoteCommand());
program.addCommand(createChartCommand());
program.addCommand(createSearchCommand());
program.addCommand(createSummaryCommand());
program.addCommand(createNewsCommand());
program.addCommand(createInsightsCommand());
program.addCommand(createOptionsCommand());
program.addCommand(createRecommendationsCommand());
program.addCommand(createScreenerCommand());
program.addCommand(createIndicatorCommand());

// Parse arguments and run
program.parse();
