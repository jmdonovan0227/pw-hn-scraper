"use server";

import styles from "./styles/styles.module.css";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getArticlesServer } from "./api-server";
import QueryClientProviderWrapper from "./_components/articles-query-provider";
import { DataTable } from "./_components/articles-table";
import { columns } from "./_components/article-columns";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["articles"],
    queryFn: getArticlesServer,
  });

  return (
    <QueryClientProviderWrapper>
      <header className={styles.header}>
        <h1>PW Hacker News Scraper</h1>
      </header>

      <main className={styles.main}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DataTable columns={columns} />
        </HydrationBoundary>
      </main>
    </QueryClientProviderWrapper>
  );
}
