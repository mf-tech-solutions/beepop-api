import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonHelpers {
  static GetNumberEnumValues(anEnum: Object): Array<number> {
    return Object.keys(anEnum)
      .filter((value) => !isNaN(Number(value)))
      .map((key) => anEnum[key]);
  }

  static getElapsedTimeInMilliseconds(start: number): number {
    return Date.now() - start;
  }
}
