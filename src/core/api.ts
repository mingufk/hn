import { NewsDetail, NewsFeed } from "../types";

export class Api {
  xhr: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.xhr = new XMLHttpRequest();
    this.url = url;
  }

  async request<AjaxResponse>(): Promise<AjaxResponse> {
    const response = await fetch(this.url);

    return await response.json();
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  async getData() {
    return this.request<NewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  async getData() {
    return this.request<NewsDetail>();
  }
}
