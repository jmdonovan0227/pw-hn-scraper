import { NextResponse } from "next/server";
import { chromium } from "playwright-chromium";
import type {
  Article,
  ArticleEntry,
  ScrapedArticleEntry,
  ScrapedDateEntry,
} from "@/app/types/types";

import { articleEntryArraySchema } from "@/app/schemas/schemas";

// sort each article by the date they were created!
export function compareDates(a: ArticleEntry, b: ArticleEntry): number {
  // we add the Z to create a valid UTC format, verified that this works correctly at UTC is 5 hours ahead of EST.
  const dateCreatedA: Date = new Date(a[1].dateCreated.split(" ").at(0)! + "Z");
  const dateCreatedB: Date = new Date(b[1].dateCreated.split(" ").at(0)! + "Z");
  return dateCreatedB.getTime() - dateCreatedA.getTime();
}

export async function saveHackerNewsArticles(): Promise<ArticleEntry[]> {
  // launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  // max number of articles we will return.
  const MAX_ARTICLES = 100;
  // returns information about the first 100 articles sorted from newest to oldest.
  let mapDatesArray: ArticleEntry[] = [];

  try {
    // create a map to hold all articles and their associated dates
    const articlesMap = new Map<string, Article>();
    // all articles without date information since dates are in a separate row
    const allArticles: ScrapedArticleEntry[][] = [];
    // all articles dates
    const allArticlesDates: ScrapedDateEntry[][] = [];

    // keep track of how many articles we have gotten
    let articlesLength = 0;

    // only get the first one hundred!
    while (articlesLength < MAX_ARTICLES) {
      const currentArticles = await page.locator(".athing");
      const currentArticlesData: ScrapedArticleEntry[] =
        await currentArticles.evaluateAll((items) => {
          return items.map((item) => ({
            title: (item.querySelector(".titleline") as HTMLElement)?.innerText,
            href: item.querySelector(".titleline > a")?.getAttribute("href"),
            id: item.id,
          }));
        });

      const currentArticlesDates = await page.locator(".age");
      const currentArticlesDatesData: ScrapedDateEntry[] =
        await currentArticlesDates.evaluateAll((item) => {
          return item.map((item) => ({
            title: item.getAttribute("title"),
            href: item.querySelector("a")?.getAttribute("href"),
          }));
        });

      // if we have less than 100 articles and adding the articles on the current page won't exceed 100 then just add to allArticles array and allArticlesDates array.
      if (
        articlesLength < MAX_ARTICLES &&
        articlesLength + currentArticlesData.length < MAX_ARTICLES
      ) {
        articlesLength += currentArticlesData.length;
        allArticles.push(currentArticlesData);
        allArticlesDates.push(currentArticlesDatesData);

        // click a tag with 'more' text to get the next 30 articles.
        await page.locator(".morelink").first().click();
      }

      // otherwise if we have less than 100 articles but adding the current page articles exceeds 100, then figure out how many articles we can add (max 100) from the current page and add to allArticles array and allArticlesDates array
      else if (
        articlesLength < MAX_ARTICLES &&
        articlesLength + currentArticlesData.length > MAX_ARTICLES
      ) {
        const articlesUntilMax = MAX_ARTICLES - articlesLength;
        const articlesToAdd = currentArticlesData.slice(0, articlesUntilMax);
        const articlesDatesToAdd = currentArticlesDatesData.slice(
          0,
          articlesUntilMax
        );
        allArticles.push(articlesToAdd);
        allArticlesDates.push(articlesDatesToAdd);
        articlesLength += articlesUntilMax;
      }
    }

    // if we do not have a date for every article we find, throw an error and log it to the console.
    if (allArticlesDates.flat().length !== allArticles.flat().length) {
      throw new Error("We do not have a date for every article");
    }

    const allArticleDates = allArticlesDates.flat();

    allArticles.flat().forEach((article, index) => {
      // For each article the date that the article was posted lives in a separate row than the article title and article link.
      // to ensure we are matching dates with the correct articles, I noticed that the a tag wrapped around the posted date of the article
      // contains a query param which is equal to the article id. If we store the article ids from the first array in a may we can more efficiently
      // add articles dates to each article instead of search through the entire article dates array. The href for the a tag (for date - clicking allows you to comment on article)
      // is in a format like this => item?=id, so we can extract the id from the href below and match against the article.id that is specified on the article in the other table row (row above in table)
      // and match the article date to the correct article by using the article id!
      const hrefId = allArticleDates.at(index)?.href?.split("=").at(-1);
      const articleId = article.id;
      const articleTitle = article.title;
      const articleHref = article.href;
      const dateCreated = allArticleDates.flat().at(index)?.title;
      const commentOnPostHref = allArticleDates.flat().at(index)?.href;

      if (
        articleId === hrefId &&
        articleTitle &&
        articleHref &&
        dateCreated &&
        commentOnPostHref
      ) {
        articlesMap.set(article.id, {
          title: articleTitle, // article title
          href: articleHref, // article link
          dateCreated, // the date the article was posted is in the title of a span wrapping the a tag
          commentOnPostHref, // the href when clicked allows the user to add a comment to the article
        });
      } else {
        throw new Error(
          "Article is missing either an article id, title, href, or we cant find the creation date or href for commenting on post"
        );
      }
    });

    // extract the map entries into an array that we can sort
    mapDatesArray = Array.from(articlesMap.entries());
    // use the custom sorting function to compare each array element by the date the article was posted
    mapDatesArray.sort(compareDates);
    return mapDatesArray;
  } catch (error) {
    // if any errors happen, catch them here and log!
    console.error("Error gettings articles: ", error);
    throw error;
  } finally {
    // close browser
    await browser.close();
    // return first 100 articles sorted from newest to oldest
    return mapDatesArray;
  }
}

export async function GET() {
  try {
    const data = await saveHackerNewsArticles();

    const validation = articleEntryArraySchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Article data is malformed" },
        { status: 400 }
      );
    }

    const returnData: ArticleEntry[] = validation.data;

    return NextResponse.json(
      { success: true, data: returnData },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
