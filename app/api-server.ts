"server only";

import { articleEntryArraySchema } from "./schemas/schemas";
import { ArticleEntry } from "./types/types";
import { saveHackerNewsArticles } from "./api/articles/route";

export async function getArticlesServer() {
  try {
    const data = await saveHackerNewsArticles();
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
