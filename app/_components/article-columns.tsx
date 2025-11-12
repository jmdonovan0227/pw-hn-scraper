"use client";
import { ColumnDef } from "@tanstack/react-table";
import type { ArticleEntry } from "../types/types";
import { Button } from "@/components/ui/button";
import styles from "../styles/styles.module.css";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<ArticleEntry>[] = [
  {
    accessorFn: (originalRow) => originalRow[1].title,
    id: "title",
    header: "TITLE",
  },

  {
    accessorFn: (originalRow) => originalRow[1].href,
    id: "ARTICLE HREF LINK",
    header: "ARTICLE LINK",
    cell: ({ row }) => {
      const articleLink: string = row.original[1].href;

      return (
        <a className={styles.links} href={articleLink}>
          View Article
        </a>
      );
    },
  },

  {
    accessorFn: (originalRow) => originalRow[1].dateCreated,
    id: "ARTICLE CREATION DATE",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={styles.buttons}
        >
          CREATION DATE
          <ArrowUpDown />
        </Button>
      );
    },

    cell: ({ row }) => {
      const creationDateString =
        row.original[1].dateCreated.split(" ").at(0) ?? "No Date Found";

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "UTC",
      };

      return (
        <span>
          {new Date(creationDateString + "Z").toLocaleString("en-US", options)}{" "}
          (UTC)
        </span>
      );
    },
  },

  {
    accessorFn: (originalRow) => originalRow[1].commentOnPostHref,
    id: "ARTICLE COMMENT LINK",
    header: "COMMENT ON POST LINK",
    cell: ({ row }) => {
      const commentOnPostHref: string = row.original[1].commentOnPostHref;

      return (
        <a className={styles.links} href={commentOnPostHref}>
          Comment On Article
        </a>
      );
    },
  },
];
