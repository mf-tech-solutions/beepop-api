import { Repository } from "typeorm";
import { ApiToken } from "../models/apiToken.model";

export abstract class ApiProvider {
  public ApiUrl: string;
  public ApiTokenUrl: string;

  abstract get Auth(): any;

  constructor(
    public ApiKey: string,
    public ApiSecret: string,
    public tokenRepository: Repository<ApiToken>,
  ) {}

  Validate(onFalseMessage: string) {
    if (!(this.ApiUrl && this.ApiTokenUrl && this.ApiKey && this.ApiSecret))
      throw new Error(onFalseMessage);
  }

  abstract async GetToken(): Promise<string>;
}

export enum ApiProviders {
  Spotify = 1,
}
