import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "plasm" })
export class PlasmPipe implements PipeTransform {
  transform(cost: number | string | { min: number, max: number }, ...args: any[]) {
    if (cost === 0) {
      return "Free";
    }
    
    if (typeof cost === "number" || typeof cost === "string") {
      return `${cost} Plasm`;
    }

    return `${cost.min}-${cost.max} Plasm`;
  }
}
