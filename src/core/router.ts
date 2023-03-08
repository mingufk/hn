import { Route } from "../types";
import Page from "./page";

export class Router {
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
