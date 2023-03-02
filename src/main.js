import "./main.css";

const container = document.querySelector("#app");

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const ajax = new XMLHttpRequest();

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

const store = {
  currentPage: 1,
};

function newsFeed() {
  let template = /* html */ `
    <div>
      <div>
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

  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div>
        <a href="#/news/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </div>
    `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  template = template.replace(
    "{{__next_page__}}",
    store.currentPage < 3 ? store.currentPage + 1 : 3
  );

  container.innerHTML = template;
}

function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  let template = /* html */ `
    <div>
      <div>
        <a target="_blank" href="${newsContent.url}">
          ${newsContent.title}
        </a>
      </div> 
    </div>
  `;

  container.innerHTML = template;
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
