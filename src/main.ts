import "./main.css";

interface News {
  readonly id: number;
  readonly user: string;
  readonly time?: number;
  readonly time_ago: string;
  readonly type?: string;
  readonly url: string;
  readonly comments_count: number;
}

interface NewsFeed extends News {
  readonly title: string;
  readonly points?: number;
  readonly domain?: string;
  read?: boolean;
}

interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}

interface NewsComment extends News {
  readonly content: string;
  readonly comments: NewsComment[];
  readonly level: number;
}

interface NewsDetail extends NewsFeed {
  readonly comments: NewsComment[];
}

interface Route {
  readonly path: string;
  readonly page: Page;
}

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  getReq<AjaxResponse>(): AjaxResponse {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getReq<NewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getReq<NewsDetail>();
  }
}

abstract class Page {
  private container: Element;
  private template: string;
  private renderTemplate: string;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.querySelector(containerId);

    if (!containerElement) {
      throw new Error("Top-level container element is not found.");
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updatePage() {
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }

  protected pushHtml(html: string) {
    this.htmlList.push(html);
  }

  private clearHtmlList() {
    this.htmlList = [];
  }

  protected getHtml(): string {
    const html = this.htmlList.join("");
    this.clearHtmlList();

    return html;
  }

  protected replace(key: string, value: string) {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  abstract render(): void;
}

class NewsFeedPage extends Page {
  private api: NewsFeedApi;
  private feeds: NewsFeed[];
  private getFeeds() {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }

  constructor(containerId: string) {
    let template = /* html */ `
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

    super(containerId, template);

    this.api = new NewsFeedApi(NEWS_URL);
    this.feeds = store.feeds;

    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.getFeeds();
    }
  }

  render() {
    store.currentPage = Number(location.hash.substring(7) || 1);

    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
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
      String(store.currentPage > 1 ? store.currentPage - 1 : 1)
    );
    this.replace(
      "nextPage",
      String(store.currentPage < 3 ? store.currentPage + 1 : 3)
    );

    this.updatePage();
  }
}

class NewsDetailPage extends Page {
  constructor(containerId: string) {
    let template = /* html */ `
      <div>
        <div class="mb-8">
          <a target="_blank" href="{{__url__}}">
            {{__title__}}
          </a>
        </div>

        <div>
          {{__comments__}}
        </div>
      </div>
    `;

    super(containerId, template);
  }

  render() {
    const id = location.hash.substring(7);
    const api = new NewsDetailApi(CONTENT_URL.replace("@id", id));
    const newsDetail = api.getData();

    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }

    this.replace("url", newsDetail.url);
    this.replace("title", newsDetail.title);
    this.replace("comments", this.getComment(newsDetail.comments));

    this.updatePage();
  }

  private getComment(comments: NewsComment[]): string {
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];

      this.pushHtml(/* html */ `
        <div style="padding-left: ${comment.level * 2}rem;" class="mb-4">
          <div>
            ${comment.user} | ${comment.time_ago}
          </div>

          <div>
            ${comment.content}
          </div>
        </div>
      `);

      if (comment.comments.length > 0) {
        this.pushHtml(this.getComment(comment.comments));
      }
    }

    return this.getHtml();
  }
}

class Router {
  defaultRoute: Route | null;
  routeTable: Route[];

  constructor() {
    window.addEventListener("hashchange", this.route.bind(this));

    this.defaultRoute = null;
    this.routeTable = [];
  }

  setDefaultPage(page: Page) {
    this.defaultRoute = { path: "", page };
  }

  addRoutePath(path: string, page: Page) {
    this.routeTable.push({ path, page });
  }

  route() {
    const path = location.hash;

    if (path === "" && this.defaultRoute) {
      this.defaultRoute.page.render();
    }

    for (const route of this.routeTable) {
      if (path.indexOf(route.path) >= 0) {
        route.page.render();
        break;
      }
    }
  }
}

const router = new Router();
const newsFeedPage = new NewsFeedPage("#app");
const newsDetailPage = new NewsDetailPage("#app");

router.setDefaultPage(newsFeedPage);
router.addRoutePath("/page", newsFeedPage);
router.addRoutePath("/news", newsDetailPage);
router.route();
