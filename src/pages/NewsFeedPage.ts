import { NEWS_URL } from "../configs";
import { NewsFeedApi } from "../core/api";
import Page from "../core/page";
import { NewsFeed } from "../types";

const template: string = /* html */ `
  <div>
    <div class="mb-8">
      <a href="/">Hacker News</a>
    </div>

    <div>
      {{__newsFeed__}}
    </div>

    <div>
      <a href="#/page/{{__prevPage__}}">Previous</a>
      <a href="#/page/{{__nextPage__}}">Next</a>
    </div>
  </div>
`;

export default class NewsFeedPage extends Page {
  private api: NewsFeedApi;
  private feeds: NewsFeed[];
  private getFeeds() {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }

  constructor(containerId: string) {
    super(containerId, template);

    this.api = new NewsFeedApi(NEWS_URL);
    this.feeds = window.store.feeds;

    if (this.feeds.length === 0) {
      this.feeds = window.store.feeds = this.api.getData();
      this.getFeeds();
    }
  }

  render() {
    window.store.currentPage = Number(location.hash.substring(7) || 1);

    for (
      let i = (window.store.currentPage - 1) * 10;
      i < window.store.currentPage * 10;
      i++
    ) {
      const { id, title, comments_count, read } = this.feeds[i];

      this.pushHtml(/* html */ `
          <div class="mb-4 ${read ? "text-gray-300" : "text-gray-900"}">
            <a href="#/news/${id}">
              ${title} (${comments_count})
            </a>
          </div>
        `);
    }

    this.replace("newsFeed", this.getHtml());
    this.replace(
      "prevPage",
      String(window.store.currentPage > 1 ? window.store.currentPage - 1 : 1)
    );
    this.replace(
      "nextPage",
      String(window.store.currentPage < 3 ? window.store.currentPage + 1 : 3)
    );

    this.updatePage();
  }
}
