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

export interface NewsStore {
  getAllFeeds: () => NewsFeed[];
  getFeed: (position: number) => NewsFeed;
  setFeeds: (feeds: NewsFeed[]) => void;
  getRead: (id: number) => void;
  hasFeeds: boolean;
  currentPage: number;
  numberOfFeed: number;
  prevPage: number;
  nextPage: number;
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
  path: string;
  page: Page;
  params: RegExp | null;
}
