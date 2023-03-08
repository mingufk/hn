import { NewsFeed, NewsStore } from "../types";

export default class Store implements NewsStore {
  private feeds: NewsFeed[];
  private _currentPage: number;

  constructor() {
    this.feeds = [];
    this._currentPage = 1;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page) {
    this._currentPage = page;
  }

  get prevPage() {
    return this._currentPage > 1 ? this._currentPage - 1 : 1;
  }

  get nextPage() {
    return this._currentPage < 3 ? this._currentPage + 1 : 3;
  }

  get numberOfFeed() {
    return this.feeds.length;
  }

  get hasFeeds() {
    return this.feeds.length > 0;
  }

  getAllFeeds(): NewsFeed[] {
    return this.feeds;
  }

  getFeed(position: number): NewsFeed {
    return this.feeds[position];
  }

  setFeeds = (feeds: NewsFeed[]) => {
    this.feeds = feeds.map((feed) => ({ ...feed, read: false }));
  };

  getRead = (id: number) => {
    const feed = this.feeds.find((feed) => feed.id === id);

    if (feed) {
      feed.read = true;
    }
  };
}
