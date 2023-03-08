import { CONTENT_URL } from "../configs";
import { NewsDetailApi } from "../core/api";
import Page from "../core/page";
import { NewsComment, NewsStore } from "../types";

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
  private store: NewsStore;

  constructor(containerId: string, store: NewsStore) {
    super(containerId, template);
    this.store = store;
  }

  render = (id: string) => {
    const api = new NewsDetailApi(CONTENT_URL.replace("@id", id));
    const { url, title, comments } = api.getData();

    this.store.getRead(Number(id));

    this.replace("url", url);
    this.replace("title", title);
    this.replace("comments", this.getComment(comments));

    this.updatePage();
  };

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
