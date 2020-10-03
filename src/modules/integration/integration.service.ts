import axios from "axios";
import qs = require("qs");

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IntegrationResource } from "./integration.resource";
import { ApiToken } from "./models/apiToken.model";
import { SpotifyTokenApiResponse } from "./interfaces/providerTokenApiResponse";
import { ApiProvider, ApiProviders } from "./interfaces/apiProvider";
import { ApiId } from "./interfaces/apiId";

@Injectable()
export class IntegrationService {
  constructor(
    @InjectRepository(ApiToken) private tokenRepository: Repository<ApiToken>,
    private configService: ConfigService,
  ) {}

  GetApiProvider(provider: ApiProviders): SpotifyApiProvider {
    switch (provider) {
      default:
        return new SpotifyApiProvider(this.configService, this.tokenRepository);
    }
  }
}

export class SpotifyApiProvider extends ApiProvider {
  get Auth(): string {
    return `Basic ${this.ApiKey}:${this.ApiSecret}`;
  }

  constructor(
    configService: ConfigService,
    private repository: Repository<ApiToken>,
  ) {
    super(
      configService.get("SPOTIFY_API_KEY"),
      configService.get("SPOTIFY_API_SECRET"),
      repository,
    );

    this.ApiUrl = configService.get("SPOTIFY_API_URL");
    this.ApiTokenUrl = configService.get("SPOTIFY_TOKEN_URL");

    this.Validate(IntegrationResource.CantFindSpotifyCredentials);
  }

  async GetToken(): Promise<string> {
    let token = await this.repository.findOne({
      where: { Provider: ApiProviders.Spotify },
      order: { ExpirationDate: "DESC" },
    });
    if (token && !token.IsExpired()) return token.Token;

    try {
      if (token)
        await this.repository.update({ Id: token.Id }, { Expired: true });

      const newToken = this._SaveNewToken();
      return newToken;
    } catch (error) {
      throw error;
    }
  }

  async GetAlbums(token: string, ids: string[]): Promise<Array<object>> {
    const url = this.ApiUrl + "albums";
    const params = {
      ids: ids.join(","),
    };
    const auth = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, {
      params,
      headers: {
        ...auth,
      },
    });
    return response.data["albums"];
  }

  async GetArtists(token: string, ids: string[]): Promise<object[]> {
    const url = this.ApiUrl + "artists";
    const params = {
      ids: ids.join(","),
    };
    const auth = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, {
      params,
      headers: {
        ...auth,
      },
    });
    return response.data["artists"];
  }

  async GetTracks(token: string, ids: string[]): Promise<object[]> {
    const url = this.ApiUrl + "tracks";
    const params = {
      ids: ids.join(","),
    };
    const auth = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, {
      params,
      headers: {
        ...auth,
      },
    });
    return response.data["tracks"];
  }

  private async _SaveNewToken(): Promise<string> {
    const response = await axios.post<SpotifyTokenApiResponse>(
      this.ApiTokenUrl,
      qs.stringify({ grant_type: "client_credentials" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: this.ApiKey,
          password: this.ApiSecret,
        },
        validateStatus: undefined,
      },
    );

    const { data } = response;
    if ("error" in data)
      throw new Error(data["error_description"] ?? data["error"]);

    const expirationMilliseconds = Date.now() + data.expires_in * 1000;
    const expirationDate = new Date(expirationMilliseconds).toUTCString();

    await this.repository.insert({
      Provider: ApiProviders.Spotify,
      ExpirationDate: new Date(expirationDate),
      Expired: false,
      Token: data.access_token,
    });

    return data.access_token;
  }
}
