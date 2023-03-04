import "./main.css";

interface News {
  readonly id: number;
  readonly user: string;
  readonly time?: number;
  readonly time_ago: string;
  readonly type?: string;
  readonly url?: string;
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

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

const container = document.querySelector("#app");

function updatePage(html: string) {
  if (container != null) {
    container.innerHTML = html;
  } else {
    console.error("Top-level container is not found.");
  }
}

const ajax = new XMLHttpRequest();

function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function getFeeds(feeds: NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

function newsFeed() {
  let template = /* html */ `
    <div>
      <div class="mb-8">
        <a href="/">Hacker News</a>
      </div>

      <div>
        {{__news_feed__}}
      </div>

      <div>
        <a href="#/page/{{__prev_page__}}">Previous</a>
        <a href="#/page/{{__next_page__}}">Next</a>
      </div>
    </div>
  `;

  let newsFeed = store.feeds;

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = getFeeds(getData(NEWS_URL));
  }

  const newsList = [];

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(/* html */ `
      <div class="mb-4 ${newsFeed[i].read ? "text-gray-300" : "text-gray-900"}">
        <a href="#/news/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </div>
    `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    String(store.currentPage > 1 ? store.currentPage - 1 : 1)
  );
  template = template.replace(
    "{{__next_page__}}",
    String(store.currentPage < 3 ? store.currentPage + 1 : 3)
  );

  updatePage(template);
}

function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData<NewsDetail>(CONTENT_URL.replace("@id", id));

  let template = /* html */ `
    <div>
      <div class="mb-8">
        <a target="_blank" href="${newsContent.url}">
          ${newsContent.title}
        </a>
      </div>

      <div>
        {{__comments__}}
      </div>
    </div>
  `;

  function getComment(comments: NewsComment[]): string {
    const commentList = [];

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];

      commentList.push(/* html */ `
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
        commentList.push(getComment(comment.comments));
      }
    }

    return commentList.join("");
  }

  updatePage(
    template.replace("{{__comments__}}", getComment(newsContent.comments))
  );

  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }
}

function router() {
  if (location.hash === "") {
    newsFeed();
  } else if (location.hash.indexOf("#/page/") >= 0) {
    store.currentPage = Number(location.hash.substring(7));
    newsFeed();
  } else {
    newsDetail();
  }
}

router();

window.addEventListener("hashchange", router);
