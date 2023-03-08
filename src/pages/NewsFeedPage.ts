import { NEWS_URL } from "../configs";
import { NewsFeedApi } from "../core/api";
import Page from "../core/page";
import { NewsStore } from "../types";

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
  private store: NewsStore;

  constructor(containerId: string, store: NewsStore) {
    super(containerId, template);

    this.api = new NewsFeedApi(NEWS_URL);
    this.store = store;
  }

  render = async (page = "1") => {
    this.store.currentPage = Number(page);

    if (!this.store.hasFeeds) {
      const feeds = await this.api.getData();
      this.store.setFeeds(feeds);
    }

    for (
      let i = (this.store.currentPage - 1) * 10;
      i < this.store.currentPage * 10;
      i++
    ) {
      const { id, title, comments_count, read } = this.store.getFeed(i);

      this.pushHtml(/* html */ `
          <div class="mb-4 ${read ? "text-gray-300" : "text-gray-900"}">
            <a href="#/news/${id}">
              ${title} (${comments_count})
            </a>
          </div>
        `);
    }

    this.replace("newsFeed", this.getHtml());
    this.replace("prevPage", String(this.store.prevPage));
    this.replace("nextPage", String(this.store.nextPage));

    this.updatePage();
  };
}
