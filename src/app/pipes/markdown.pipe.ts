import { Pipe, PipeTransform } from "@angular/core";
import { Renderer } from "marked";
import * as marked from "marked";

@Pipe({ name: "markdown" })
export class MarkdownPipe implements PipeTransform {
  private readonly renderer = new Renderer();

  constructor() {
    this.renderer.paragraph = (text) => `<span>${text}</span>`;
  }

  transform(value: any): any {
    if (value && value.length) {
      return marked(value, { renderer: this.renderer });
    }
  }
}
