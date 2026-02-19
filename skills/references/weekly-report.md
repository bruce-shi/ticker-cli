# Weekly Report Generation Guide

This guide explains how to generate comprehensive weekly stock analysis reports using ticker-cli.

## Overview

Weekly reports provide a broader perspective on market trends, sector performance, and medium-term technical analysis. These reports are typically generated on Friday after market close or over the weekend.

---

## Weekly Report Structure

### Step 1: Market Overview

```bash
# Get weekly performance for major indices (use ETFs as proxies)
npx ticker-cli quote SPY QQQ DIA IWM

# Get weekly chart data
npx ticker-cli chart SPY -p 1wk --interval 1d
npx ticker-cli chart QQQ -p 1wk --interval 1d
```

### Step 2: Sector Analysis

```bash
# Sector ETFs analysis
npx ticker-cli quote XLK XLF XLV XLE XLY XLP XLI XLB XLRE XLC XLU

# Weekly sector performance
npx ticker-cli chart XLK -p 1wk --interval 1d  # Technology
npx ticker-cli chart XLF -p 1wk --interval 1d  # Financial
npx ticker-cli chart XLE -p 1wk --interval 1d  # Energy
npx ticker-cli chart XLV -p 1wk --interval 1d  # Healthcare
```

### Step 3: Weekly Technical Analysis

For each stock in your portfolio/watchlist:

```bash
# Weekly price action
npx ticker-cli chart AAPL -p 1wk --interval 1d

# Moving averages (weekly perspective)
npx ticker-cli indicator AAPL sma -p 6mo --length 20 --interval 1d
npx ticker-cli indicator AAPL sma -p 6mo --length 50 --interval 1d
npx ticker-cli indicator AAPL ema -p 6mo --length 20 --interval 1d

# Momentum indicators
npx ticker-cli indicator AAPL rsi -p 3mo --interval 1d
npx ticker-cli indicator AAPL macd -p 3mo --interval 1d

# Volatility analysis
npx ticker-cli indicator AAPL bb -p 3mo
```

### Step 4: Weekly Screener Review

```bash
# Weekly top performers
npx ticker-cli screener -q day_gainers
npx ticker-cli screener -q day_losers
npx ticker-cli screener -q most_actives

# Value opportunities
npx ticker-cli screener -q undervalued_growth_stocks
npx ticker-cli screener -q undervalued_large_caps

# Growth stocks
npx ticker-cli screener -q growth_technology_stocks
```

### Step 5: News and Sentiment Review

```bash
# Weekly news roundup for key stocks
npx ticker-cli news AAPL --limit 20
npx ticker-cli news SPY --limit 20

# Analyst recommendations
npx ticker-cli recommendations AAPL
npx ticker-cli insights AAPL
```

### Step 6: Options Analysis (for derivatives traders)

```bash
# Weekly options overview
npx ticker-cli options AAPL

# Check upcoming expirations
npx ticker-cli options AAPL -d 2026-02-21  # Near-term expiration
```

---

## Weekly Report Template

```
=== WEEKLY MARKET REPORT ===
Week Ending: [YYYY-MM-DD]

## MARKET SUMMARY

### Major Indices Performance
| Index | Symbol | Weekly Close | Weekly Change | YTD Change |
|-------|--------|--------------|---------------|------------|
| S&P 500 | SPY | $XXX.XX | +/-XX.XX% | +/-XX.XX% |
| NASDAQ | QQQ | $XXX.XX | +/-XX.XX% | +/-XX.XX% |
| Dow Jones | DIA | $XXX.XX | +/-XX.XX% | +/-XX.XX% |
| Russell 2000 | IWM | $XXX.XX | +/-XX.XX% | +/-XX.XX% |

### Sector Performance
| Sector | Symbol | Weekly Close | Weekly Change |
|--------|--------|--------------|---------------|
| Technology | XLK | $XXX.XX | +/-XX.XX% |
| Financial | XLF | $XXX.XX | +/-XX.XX% |
| Healthcare | XLV | $XXX.XX | +/-XX.XX% |
| Energy | XLE | $XXX.XX | +/-XX.XX% |
| Consumer Disc. | XLY | $XXX.XX | +/-XX.XX% |
| Consumer Staples | XLP | $XXX.XX | +/-XX.XX% |
| Industrial | XLI | $XXX.XX | +/-XX.XX% |
| Materials | XLB | $XXX.XX | +/-XX.XX% |
| Real Estate | XLRE | $XXX.XX | +/-XX.XX% |
| Communication | XLC | $XXX.XX | +/-XX.XX% |
| Utilities | XLU | $XXX.XX | +/-XX.XX% |

---

## WATCHLIST ANALYSIS

[For each stock in watchlist:]

### [SYMBOL] - [Company Name]

**Price Action:**
- Weekly Open: $XXX.XX
- Weekly High: $XXX.XX
- Weekly Low: $XXX.XX
- Weekly Close: $XXX.XX
- Weekly Change: +/-XX.XX%

**Technical Indicators:**
- SMA(20): $XXX.XX [Price Above/Below]
- SMA(50): $XXX.XX [Price Above/Below]
- EMA(20): $XXX.XX [Price Above/Below]
- RSI(14): XX.X [Overbought >70 / Neutral 30-70 / Oversold <30]
- MACD: [Bullish/Bearish] crossover, signal line at X.XX
- Bollinger Bands: Upper $XXX.XX, Middle $XXX.XX, Lower $XXX.XX
  - Price Position: [Near Upper / Near Middle / Near Lower]

**Key Levels:**
- Resistance: $XXX.XX (previous high)
- Support: $XXX.XX (previous low/SMA level)

**Analyst Sentiment:**
- Rating: [Strong Buy / Buy / Hold / Sell]
- Price Target: $XXX.XX

**Weekly News Highlights:**
1. [Headline 1]
2. [Headline 2]
3. [Headline 3]

---

## TOP WEEKLY MOVERS

### Gainers
| Symbol | Close | Weekly Change | Volume |
|--------|-------|---------------|--------|
| [From screener] | | | |

### Losers
| Symbol | Close | Weekly Change | Volume |
|--------|-------|---------------|--------|
| [From screener] | | | |

### Most Active
| Symbol | Close | Weekly Change | Volume |
|--------|-------|---------------|--------|
| [From screener] | | | |

---

## MARKET OPPORTUNITIES

### Undervalued Growth Stocks
[From screener - undervalued_growth_stocks]

### Undervalued Large Caps
[From screener - undervalued_large_caps]

### Growth Technology Stocks
[From screener - growth_technology_stocks]

---

## UPCOMING WEEK OUTLOOK

### Key Events
- [Earnings announcements]
- [Economic data releases]
- [Fed speeches/events]
- [Options expiration dates]

### Technical Levels to Watch
| Index/Stock | Support | Resistance |
|-------------|---------|------------|
| SPY | $XXX | $XXX |
| QQQ | $XXX | $XXX |
| [Stock 1] | $XXX | $XXX |

### Risk Factors
- [Geopolitical risks]
- [Economic concerns]
- [Sector-specific risks]

---

## OPTIONS ACTIVITY REVIEW

[For stocks with notable options activity:]

### [SYMBOL] Options
- Call Volume: XXX
- Put Volume: XXX
- Put/Call Ratio: X.XX
- Notable Activity: [Description]

---

## WEEKLY SUMMARY & CONCLUSION

[Brief narrative summary of the week's market action, key takeaways, and strategy for the upcoming week]
```

---

## Quick Command Reference for Weekly Reports

### Market Overview Commands

```bash
# Major indices
npx ticker-cli quote SPY QQQ DIA IWM

# Sector ETFs
npx ticker-cli quote XLK XLF XLV XLE XLY XLP XLI XLB XLRE XLC XLU
```

### Chart Commands

```bash
# Weekly charts
npx ticker-cli chart SYMBOL -p 1wk --interval 1d

# Longer-term perspective
npx ticker-cli chart SYMBOL -p 1mo --interval 1d
npx ticker-cli chart SYMBOL -p 3mo --interval 1wk
```

### Technical Analysis Commands

```bash
# Moving averages
npx ticker-cli indicator SYMBOL sma -p 6mo --length 20
npx ticker-cli indicator SYMBOL sma -p 6mo --length 50
npx ticker-cli indicator SYMBOL ema -p 6mo --length 20

# Momentum
npx ticker-cli indicator SYMBOL rsi -p 3mo
npx ticker-cli indicator SYMBOL macd -p 3mo

# Volatility
npx ticker-cli indicator SYMBOL bb -p 3mo

# With custom interval (1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)
npx ticker-cli indicator SYMBOL sma -p 1mo -i 1h
npx ticker-cli indicator SYMBOL rsi -p 1wk -i 1d
```

### Screener Commands

```bash
npx ticker-cli screener -q most_actives
npx ticker-cli screener -q day_gainers
npx ticker-cli screener -q day_losers
npx ticker-cli screener -q undervalued_growth_stocks
npx ticker-cli screener -q undervalued_large_caps
npx ticker-cli screener -q growth_technology_stocks
```

### News & Analysis Commands

```bash
npx ticker-cli news SYMBOL --limit 20
npx ticker-cli insights SYMBOL
npx ticker-cli recommendations SYMBOL
npx ticker-cli summary SYMBOL
```

### Options Commands

```bash
npx ticker-cli options SYMBOL
npx ticker-cli options SYMBOL --calls
npx ticker-cli options SYMBOL --puts
```

---

## Automation Tips for Weekly Reports

### Create a Weekly Watchlist

```bash
# Define your weekly watchlist
WEEKLY_WATCH="SPY QQQ AAPL MSFT GOOGL AMZN META NVDA TSLA"

# Get all quotes at once
npx ticker-cli quote $WEEKLY_WATCH
```

### Batch Technical Analysis

```bash
# Generate technical analysis for multiple stocks
for symbol in AAPL MSFT GOOGL; do
  echo "=== $symbol Weekly Technicals ==="
  npx ticker-cli chart $symbol -p 1wk --interval 1d
  npx ticker-cli indicator $symbol sma -p 6mo --length 20
  npx ticker-cli indicator $symbol sma -p 6mo --length 50
  npx ticker-cli indicator $symbol rsi -p 3mo
  npx ticker-cli indicator $symbol macd -p 3mo
done
```

### Export to File

```bash
# Save report data to files
npx ticker-cli quote $WEEKLY_WATCH > weekly_quotes.json
npx ticker-cli screener -q most_actives > weekly_actives.json
npx ticker-cli news AAPL --limit 20 > aapl_weekly_news.json
```

---

## Best Practices

1. **Consistency**: Generate reports at the same time each week (e.g., Friday after close)
2. **Documentation**: Keep historical reports for trend analysis
3. **Review**: Compare weekly predictions with actual outcomes
4. **Adjustment**: Update watchlists based on changing market conditions
5. **Risk Management**: Always include risk assessment in weekly reports
