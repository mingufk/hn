import { Router } from "./core/router";
import "./main.css";
import { NewsDetail, NewsFeed } from "./pages";
import { Store } from "./types";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

declare global {
  interface Window {
    store: Store;
  }
}

window.store = store;

const router = new Router();
const newsFeedPage = new NewsFeed("#app");
const newsDetailPage = new NewsDetail("#app");

router.setDefaultPage(newsFeedPage);
router.addRoutePath("/page", newsFeedPage);
router.addRoutePath("/news", newsDetailPage);
router.route();
