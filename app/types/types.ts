import { z } from "zod";

import {
  articleSchema,
  articleEntrySchema,
  scrapedArticleEntry,
  scrapedDateEntry,
} from "../schemas/schemas";

export type Article = z.infer<typeof articleSchema>;

export type ArticleEntry = z.infer<typeof articleEntrySchema>;

export type ScrapedArticleEntry = z.infer<typeof scrapedArticleEntry>;

export type ScrapedDateEntry = z.infer<typeof scrapedDateEntry>;
