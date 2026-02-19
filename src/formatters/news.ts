import { Table } from "console-table-printer";
import { BaseFormatter, type FormatterOptions } from "./types";
import type { SearchNews } from "yahoo-finance2/modules/search";

/**
 * News data type - array of SearchNews
 */
export type NewsData = SearchNews[];

/**
 * Formatter for news articles
 * Uses the actual SearchNews type from yahoo-finance2
 */
export class NewsFormatter extends BaseFormatter<NewsData> {
  formatTable(data: NewsData): string {
    const table = new Table({
      title: "News Articles",
      columns: [
        { name: "title", title: "Title", alignment: "left", maxLen: 50 },
        {
          name: "publisher",
          title: "Publisher",
          alignment: "left",
          maxLen: 15,
        },
        { name: "date", title: "Date", alignment: "left" },
        { name: "tickers", title: "Related", alignment: "left" },
      ],
    });

    for (const article of data) {
      const date = article.providerPublishTime;
      table.addRow({
        title: this.truncate(article.title, 50),
        publisher: this.truncate(article.publisher, 15),
        date: date instanceof Date ? this.formatDate(date) : "N/A",
        tickers: article.relatedTickers?.slice(0, 3).join(", ") ?? "-",
      });
    }

    return table.render();
  }
}

/**
 * Create a news formatter
 */
export function createNewsFormatter(options: FormatterOptions = {}): {
  format: (data: NewsData) => string;
} {
  const formatter = new NewsFormatter();
  return {
    format: (data: NewsData) => formatter.format(data, options),
  };
}

// Re-export type for convenience
export type { SearchNews as NewsArticle } from "yahoo-finance2/modules/search";
