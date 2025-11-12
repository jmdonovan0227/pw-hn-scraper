"use client";

import { articleEntryArraySchema } from "./schemas/schemas";
import { ArticleEntry } from "./types/types";

export async function getArticlesClient() {
  try {
    const response = await fetch("/api/articles");

    if (!response.ok) {
      const json = await response.json();
      throw new Error(`Error: ${json.error}`);
    }

    const json = await response.json();
    const data = json.data;

    const validation = articleEntryArraySchema.safeParse(data);

    if (!validation.success) {
      throw new Error("Malformed articles data");
    }

    const returnData: ArticleEntry[] = validation.data;
    return returnData;
  } catch (error) {
    console.error(error);
  }
}
