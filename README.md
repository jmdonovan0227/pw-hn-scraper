# Playwright Web Scraper

## Setup

### Install Dependencies

```
npm install
```

### Run Locally

```
npm run dev
```

## Features

- Scrapes 100 newest HackerNews articles
- Sorts by date (newest first)
- Search by title
- Responsive design (mobile cards, desktop table)
- TypeScript + Zod validation + Tanstack Query

## Why not deployed?

This project uses Playwright for web scraping, which requires Chromium and only runs locally (not compatible with Vercel's serverless environment). Built as a learning project to practice scraping and data visualization.

## Demo

### Desktop View Page 1

![Desktop View 1](./public/screenshots/desktop-view-page-1.png)

### Desktop View Page Changed

![Desktop View 2](./public/screenshots/desktop-view-page-2.png)

### Desktop View Filtering By Article Title

![Desktop View 1](./public/screenshots/desktop-view-sorting-by-title.png)

### Desktop View Sorting Oldest To Newest Articles

![Desktop View 1](./public/screenshots/desktop-view-filtering-oldest-to-newest.png)

### Mobile View

![Desktop View 1](./public/screenshots/mobile-view.png)
