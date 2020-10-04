import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MusicResource } from "./music.resource";

@Injectable()
export class MusicValidator {
  static ValidateGetAll(page: any) {
    if (!page) throw new EvalError(MusicResource.PageIsRequired);

    if (page < 0) throw new EvalError(MusicResource.InvalidPage);

    if (isNaN(page)) throw new TypeError(MusicResource.PageMustBeAnInteger);
  }
}
