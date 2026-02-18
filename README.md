# ticker-cli

A powerful command-line interface for trading analysis that provides stock quotes, charts, technical indicators, news, and more.

## Installation

```bash
bun install
```

## Usage

```bash
bun run index.ts <command> [options]
```

Or create an alias:

```bash
npx ticker-cli quote AAPL
```

## Commands

### quote - Get stock quotes

```bash
npx ticker-cli quote <symbols...>

# Examples:
npx ticker-cli quote AAPL                    # Single quote
npx ticker-cli quote AAPL MSFT GOOGL         # Multiple quotes
```

### chart - Get chart/historical data

```bash
npx ticker-cli chart <symbol> [options]

Options:
  -p, --period <period>     Preset period: 1d, 5d, 1wk, 1mo, 3mo, 6mo, 1y, 2y, 5y
  -s, --start <date>        Start date (YYYY-MM-DD)
  -e, --end <date>          End date (YYYY-MM-DD)
  -i, --interval <interval> Interval: 1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo

# Examples:
npx ticker-cli chart AAPL -p 1mo
npx ticker-cli chart AAPL --start 2025-01-01 --end 2025-12-31
npx ticker-cli chart AAPL -p 1y --interval 1wk
```

### indicator - Calculate technical indicators

```bash
npx ticker-cli indicator <symbol> <indicator> [options]

Indicators:
  sma    Simple Moving Average
  ema    Exponential Moving Average
  rsi    Relative Strength Index
  macd   Moving Average Convergence Divergence
  bb     Bollinger Bands

Options:
  -p, --period <period>     Period for historical data
  -s, --start <date>        Start date
  -e, --end <date>          End date
  --length <number>         Period length (default: 20 for SMA/EMA/BB, 14 for RSI)
  --short <number>          Short period for MACD (default: 12)
  --long <number>           Long period for MACD (default: 26)
  --signal <number>         Signal period for MACD (default: 9)

# Examples:
npx ticker-cli indicator AAPL sma -p 3mo
npx ticker-cli indicator AAPL ema --length 50 -p 6mo
npx ticker-cli indicator AAPL rsi -p 3mo
npx ticker-cli indicator AAPL macd -p 6mo
npx ticker-cli indicator AAPL bb -p 3mo
```

### search - Search for symbols

```bash
npx ticker-cli search <query>

# Examples:
npx ticker-cli search apple
npx ticker-cli search "micro soft"
```

### summary - Get quote summary

```bash
npx ticker-cli summary <symbol> [options]

Options:
  -m, --modules <modules>   Comma-separated modules

# Examples:
npx ticker-cli summary AAPL
npx ticker-cli summary AAPL -m summaryProfile,summaryDetail
```

### news - Get stock news

```bash
npx ticker-cli news <symbol> [options]

Options:
  -l, --limit <number>      Number of articles (default: 10)

# Examples:
npx ticker-cli news AAPL
npx ticker-cli news AAPL --limit 20
```

### insights - Get stock insights

```bash
npx ticker-cli insights <symbol>

# Examples:
npx ticker-cli insights AAPL
```

### options - Get options chain

```bash
npx ticker-cli options <symbol> [options]

Options:
  -d, --date <date>         Expiration date (YYYY-MM-DD)
  --calls                   Show only calls
  --puts                    Show only puts

# Examples:
npx ticker-cli options AAPL
npx ticker-cli options AAPL -d 2026-03-21
npx ticker-cli options AAPL --calls
```

### recommendations - Get analyst recommendations

```bash
npx ticker-cli recommendations <symbol>

# Examples:
npx ticker-cli recommendations AAPL
```

### screener - Screen stocks

```bash
npx ticker-cli screener [options]

Options:
  -q, --query <query>       Predefined query (default: most_actives)

Available Queries:
  most_actives, day_gainers, day_losers,
  undervalued_growth_stocks, undervalued_large_caps,
  growth_technology_stocks, top_mutual_funds

# Examples:
npx ticker-cli screener
npx ticker-cli screener -q day_gainers
npx ticker-cli screener -q undervalued_large_caps
```

## Global Options

```
--pretty   Pretty print JSON output (default: true)
```

## Output Format

```bash
npx ticker-cli quote AAPL
```

## Dependencies

- [commander.js](https://github.com/tj/commander.js) - CLI framework
- [yahoo-finance2](https://github.com/gadicc/yahoo-finance2) - Yahoo Finance API
- [indicatorts](https://github.com/cinar/indicatorts) - Technical indicators
- [Bun](https://bun.sh) - JavaScript runtime

## License

MIT
