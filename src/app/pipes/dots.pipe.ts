import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "dots" })
export class DotsPipe implements PipeTransform {
  transform(value: number, ...args: any[]) {
    return new Array(value).fill("•").join("");
  }
}
