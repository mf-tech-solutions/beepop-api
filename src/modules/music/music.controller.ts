import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from "@nestjs/common";
import { ApiResponse } from "../common/common.apiResponse";
import { CommonHelpers } from "../common/common.helpers";
import { CommonResource } from "../common/common.resource";
import { MusicService } from "./music.service";
import { MusicValidator } from "./music.validator";

@Controller("music")
export class MusicController {
  constructor(private service: MusicService) {}

  @Get()
  async GetAll(@Query("page") page: any): Promise<ApiResponse> {
    const start = Date.now();

    try {
      MusicValidator.ValidateGetAll(page);

      const result = await this.service.GetAll(page);
      const elapsedTime = CommonHelpers.getElapsedTimeInMilliseconds(start);
      Logger.debug(
        CommonResource.ElapsedTime + elapsedTime + "ms",
        "MusicController.GetAll",
        false,
      );

      return {
        Success: true,
        Data: result,
      };
    } catch (error) {
      const elapsedTime = CommonHelpers.getElapsedTimeInMilliseconds(start);
      Logger.debug(
        CommonResource.ElapsedTime + elapsedTime + "ms",
        "MusicController.GetAll",
        false,
      );

      const response = <ApiResponse>{
        Success: false,
        Message: error.message,
      };
      const status =
        typeof error === "string" || error instanceof Error
          ? HttpStatus.INTERNAL_SERVER_ERROR
          : HttpStatus.BAD_REQUEST;
      throw new HttpException(response, status);
    }
  }
}
