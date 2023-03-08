import { Route } from "../types";
import Page from "./page";

export class Router {
  private isStart: boolean;
  defaultRoute: Route | null;
  routeTable: Route[];

  constructor() {
    window.addEventListener("hashchange", this.route.bind(this));

    this.isStart = false;
    this.defaultRoute = null;
    this.routeTable = [];
  }

  setDefaultPage(page: Page, params: RegExp | null = null) {
    this.defaultRoute = { path: "", page, params };
  }

  addRoutePath(path: string, page: Page, params: RegExp | null = null) {
    this.routeTable.push({ path, page, params });

    if (!this.isStart) {
      this.isStart = true;
      setTimeout(this.route.bind(this), 0);
    }
  }

  private route() {
    const path = location.hash;

    if (path === "" && this.defaultRoute) {
      this.defaultRoute.page.render();

      return;
    }

    for (const route of this.routeTable) {
      if (path.indexOf(route.path) >= 0) {
        if (route.params) {
          const params = path.match(route.params);

          if (params) {
            route.page.render.apply(null, [params[1]]);
          }
        } else {
          route.page.render();
        }
      }
    }
  }
}
