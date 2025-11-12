import { z } from "zod";

export const articleSchema = z.object({
  title: z.string(),
  href: z.string(),
  dateCreated: z.string(),
  commentOnPostHref: z.string(),
});

export const articleEntrySchema = z.tuple([z.string(), articleSchema]);

export const articleEntryArraySchema = z.array(articleEntrySchema);

export const scrapedArticleEntry = z.object({
  title: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
  id: z.string(),
});

export const scrapedDateEntry = z.object({
  title: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
});
