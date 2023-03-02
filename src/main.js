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

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push(`
    <ul>
    ${newsFeed
      .map(
        (news) => `
      <li>
        <a href="#${news.id}">
          ${news.title} (${news.comments_count})
        </a>
      </li>
    `
      )
      .join("")}
    </ul>
  `);

  container.innerHTML = newsList.join("");
}

function newsDetail() {
  const id = location.hash.substring(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  container.innerHTML = `
    <a target="_blank" href="${newsContent.url}">
      <h1>${newsContent.title}</h1>
    </a>
  `;
}

function router() {
  if (location.hash === "") {
    newsFeed();
  } else {
    newsDetail();
  }
}

router();

window.addEventListener("hashchange", router);
