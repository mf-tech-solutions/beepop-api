import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MusicResource } from "./music.resource";

@Injectable()
export class MusicValidator {
  static ValidateGetAll(page: any) {
    if (!page) throw new EvalError(MusicResource.PageIsRequired);

    if (isNaN(page)) throw new TypeError(MusicResource.PageMustBeAnInteger);
  }
}
