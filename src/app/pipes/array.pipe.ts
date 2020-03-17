import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "array" })
export class ArrayPipe implements PipeTransform {
  transform(value: string | string[]): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    else {
      return [value];
    }
  }
}
