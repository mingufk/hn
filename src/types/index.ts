import Page from "../core/page";

export interface News {
  readonly id: number;
  readonly user: string;
  readonly time?: number;
  readonly time_ago: string;
  readonly type?: string;
  readonly url: string;
  readonly comments_count: number;
}

export interface NewsFeed extends News {
  readonly title: string;
  readonly points?: number;
  readonly domain?: string;
  read?: boolean;
}

export interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}

export interface NewsComment extends News {
  readonly content: string;
  readonly comments: NewsComment[];
  readonly level: number;
}

export interface NewsDetail extends NewsFeed {
  readonly comments: NewsComment[];
}

export interface Route {
  readonly path: string;
  readonly page: Page;
}
