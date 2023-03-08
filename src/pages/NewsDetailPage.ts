import { CONTENT_URL } from "../configs";
import { NewsDetailApi } from "../core/api";
import Page from "../core/page";
import { NewsComment } from "../types";

const template: string = /* html */ `
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

export default class NewsDetailPage extends Page {
  constructor(containerId: string) {
    super(containerId, template);
  }

  render() {
    const id = location.hash.substring(7);
    const api = new NewsDetailApi(CONTENT_URL.replace("@id", id));
    const newsDetail = api.getData();

    for (let i = 0; i < window.store.feeds.length; i++) {
      if (window.store.feeds[i].id === Number(id)) {
        window.store.feeds[i].read = true;
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
