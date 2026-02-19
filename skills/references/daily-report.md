# Daily Report Generation Guide

This guide explains how to generate comprehensive daily stock analysis reports using ticker-cli.

## Report Types

1. **Pre-Market Report** - Generated before market opens (before 9:30 AM ET)
2. **Mid-Market Report** - Generated during market hours (around 12:00-1:00 PM ET)
3. **Post-Market Report** - Generated after market closes (after 4:00 PM ET)

---

## Pre-Market Report

Purpose: Assess overnight developments, pre-market movers, and prepare for the trading day.

### Step 1: Check Market Movers

```bash
# Get pre-market gainers
npx ticker-cli screener -q day_gainers

# Get pre-market losers
npx ticker-cli screener -q day_losers

# Get most active stocks
npx ticker-cli screener -q most_actives
```

### Step 2: Analyze Watchlist Stocks

For each stock in your watchlist:

```bash
# Get current quote
npx ticker-cli quote AAPL

# Get overnight news
npx ticker-cli news AAPL --limit 10

# Check key technical levels (previous day)
npx ticker-cli chart AAPL -p 1d --interval 1m

# Get analyst recommendations
npx ticker-cli recommendations AAPL
```

### Step 3: Pre-Market Summary

```bash
# Get comprehensive summary for key stocks
npx ticker-cli summary AAPL
npx ticker-cli insights AAPL
```

### Pre-Market Report Template

```
=== PRE-MARKET REPORT ===
Date: [YYYY-MM-DD]
Time: [Pre-market]

TOP MOVERS:
- Gainers: [From screener results]
- Losers: [From screener results]
- Most Active: [From screener results]

WATCHLIST ANALYSIS:
[For each stock:]
- Symbol: AAPL
- Previous Close: $XXX.XX
- Key News: [Top 3 headlines]
- Technical Levels: Support/Resistance from chart
- Analyst Rating: [From recommendations]

MARKET OUTLOOK:
- Key events to watch today
- Technical levels to monitor
```

---

## Mid-Market Report

Purpose: Assess intraday momentum, volume patterns, and potential reversals.

### Step 1: Intraday Price Action

```bash
# Get intraday chart for watchlist stocks
npx ticker-cli chart AAPL -p 1d --interval 5m

# Check current quotes
npx ticker-cli quote AAPL MSFT GOOGL
```

### Step 2: Intraday Technical Analysis

```bash
# Short-term indicators
npx ticker-cli indicator AAPL rsi -p 5d --length 14
npx ticker-cli indicator AAPL sma -p 5d --length 20
npx ticker-cli indicator AAPL bb -p 5d
```

### Step 3: Volume and Momentum Check

```bash
# Check most actives for volume confirmation
npx ticker-cli screener -q most_actives

# Get latest news developments
npx ticker-cli news AAPL --limit 5
```

### Mid-Market Report Template

```
=== MID-MARKET REPORT ===
Date: [YYYY-MM-DD]
Time: [12:00 PM ET]

MARKET STATUS:
- S&P 500: [Current level] ([Change %])
- Dow Jones: [Current level] ([Change %])
- NASDAQ: [Current level] ([Change %])

WATCHLIST UPDATE:
[For each stock:]
- Symbol: AAPL
- Current Price: $XXX.XX
- Daily Change: +/-XX.XX%
- Intraday High/Low: $XXX.XX / $XXX.XX
- RSI (14): XX.X [Overbought >70 / Oversold <30]
- Volume: [Compared to average]

TECHNICAL ALERTS:
- Stocks approaching key levels
- RSI overbought/oversold conditions
- Bollinger Band breakouts

AFTERNOON OUTLOOK:
- Key levels to watch
- Potential catalysts
```

---

## Post-Market Report

Purpose: Summarize the day's activity, identify overnight risks, and prepare for next session.

### Step 1: End-of-Day Quotes

```bash
# Get closing prices
npx ticker-cli quote AAPL MSFT GOOGL

# Get daily chart with full price action
npx ticker-cli chart AAPL -p 1d --interval 5m
```

### Step 2: Daily Technical Review

```bash
# Full technical analysis
npx ticker-cli indicator AAPL sma -p 3mo --length 20
npx ticker-cli indicator AAPL sma -p 3mo --length 50
npx ticker-cli indicator AAPL ema -p 3mo --length 20
npx ticker-cli indicator AAPL rsi -p 3mo
npx ticker-cli indicator AAPL macd -p 3mo
npx ticker-cli indicator AAPL bb -p 3mo
```

### Step 3: After-Hours News

```bash
# Get earnings and after-hours news
npx ticker-cli news AAPL --limit 20

# Check for analyst updates
npx ticker-cli recommendations AAPL
```

### Step 4: Options Activity (if applicable)

```bash
# Check options chain for unusual activity
npx ticker-cli options AAPL
npx ticker-cli options AAPL --calls
npx ticker-cli options AAPL --puts
```

### Post-Market Report Template

```
=== POST-MARKET REPORT ===
Date: [YYYY-MM-DD]
Time: [After 4:00 PM ET]

DAILY SUMMARY:
- S&P 500: [Close] ([Daily Change %])
- Dow Jones: [Close] ([Daily Change %])
- NASDAQ: [Close] ([Daily Change %])

TOP MOVERS:
- Day Gainers: [From screener]
- Day Losers: [From screener]
- Most Active: [From screener]

WATCHLIST PERFORMANCE:
[For each stock:]
- Symbol: AAPL
- Open: $XXX.XX
- High: $XXX.XX
- Low: $XXX.XX
- Close: $XXX.XX
- Daily Change: +/-XX.XX%
- Volume: [vs Average]

TECHNICAL ANALYSIS:
- SMA(20): $XXX.XX [Above/Below]
- SMA(50): $XXX.XX [Above/Below]
- RSI(14): XX.X [Condition]
- MACD: [Bullish/Bearish signal]
- Bollinger Bands: [Position]

KEY NEWS:
1. [Headline 1]
2. [Headline 2]
3. [Headline 3]

OPTIONS ACTIVITY:
- Notable call/put volume
- Unusual activity

TOMORROW'S OUTLOOK:
- Key levels to watch
- Upcoming catalysts
- Risk factors
```

---

## Quick Command Reference

### Essential Commands for Daily Reports

```bash
# Quotes
npx ticker-cli quote SYMBOL [SYMBOL2...]

# Charts
npx ticker-cli chart SYMBOL -p 1d --interval 5m
npx ticker-cli chart SYMBOL -p 5d

# Indicators
npx ticker-cli indicator SYMBOL sma -p 3mo --length 20
npx ticker-cli indicator SYMBOL ema -p 3mo --length 20
npx ticker-cli indicator SYMBOL rsi -p 3mo
npx ticker-cli indicator SYMBOL macd -p 3mo
npx ticker-cli indicator SYMBOL bb -p 3mo
npx ticker-cli indicator SYMBOL sma -p 1mo -i 1h  # With custom interval

# Screeners
npx ticker-cli screener -q most_actives
npx ticker-cli screener -q day_gainers
npx ticker-cli screener -q day_losers

# News & Analysis
npx ticker-cli news SYMBOL --limit 10
npx ticker-cli insights SYMBOL
npx ticker-cli recommendations SYMBOL
npx ticker-cli summary SYMBOL

# Options
npx ticker-cli options SYMBOL
```

---

## Automation Tips

### Create a Watchlist

Store your watchlist symbols in a variable or file:

```bash
# Bash/Zsh
WATCHLIST="AAPL MSFT GOOGL AMZN META NVDA TSLA"

# Get quotes for all
npx ticker-cli quote $WATCHLIST
```

### Batch Processing

```bash
# Process multiple stocks
for symbol in AAPL MSFT GOOGL; do
  echo "=== $symbol ==="
  npx ticker-cli quote $symbol
  npx ticker-cli indicator $symbol rsi -p 3mo
done
```
