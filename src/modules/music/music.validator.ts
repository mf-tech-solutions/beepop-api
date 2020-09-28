import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MusicResourece } from "./music.resource";

@Injectable()
export class MusicValidator {
  static ValidateGetAll(page: any) {
    if (!page) throw new EvalError(MusicResourece.PageIsRequired);

    if (isNaN(page)) throw new TypeError(MusicResourece.PageMustBeAnInteger);
  }
}
