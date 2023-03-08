export default abstract class Page {
  private container: Element;
  private template: string;
  private renderTemplate: string;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.querySelector(containerId);

    if (!containerElement) {
      throw new Error("Top-level container element is not found.");
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updatePage() {
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }

  protected pushHtml(html: string) {
    this.htmlList.push(html);
  }

  private clearHtmlList() {
    this.htmlList = [];
  }

  protected getHtml(): string {
    const html = this.htmlList.join("");
    this.clearHtmlList();

    return html;
  }

  protected replace(key: string, value: string) {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  abstract render(...params: string[]): void;
}
