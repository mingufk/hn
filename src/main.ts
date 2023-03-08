import { Router } from "./core/router";
import "./main.css";
import { NewsDetail, NewsFeed } from "./pages";
import Store from "./store";

const store = new Store();

const router = new Router();
const newsFeedPage = new NewsFeed("#app", store);
const newsDetailPage = new NewsDetail("#app", store);

router.setDefaultPage(newsFeedPage);
router.addRoutePath("/page", newsFeedPage, /\/page\/(\d+)/);
router.addRoutePath("/news", newsDetailPage, /\/news\/(\d+)/);
