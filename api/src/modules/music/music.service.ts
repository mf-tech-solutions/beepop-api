import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Paginate } from "../common/common.paginate";
import {
  IntegrationService,
  SpotifyApiProvider,
} from "../integration/integration.service";
import { ApiProviders } from "../integration/interfaces/apiProvider";
import { Music } from "./models/music.model";
import { MusicTypes } from "./models/musicTypes";
import { MusicMapper } from "./music.mapper";
import { IMusic } from "./interfaces/music.interface";
import { Artist } from "./models/artist.model";
import { ArtistRepository } from "./music.artist.repository";

@Injectable()
export class MusicService {
  private _pageSize = 4;
  private _apiProvider: SpotifyApiProvider;

  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
    @InjectRepository(Artist)
    private artistRepository: ArtistRepository,
    private integrationService: IntegrationService,
  ) {
    this._apiProvider = this.integrationService.GetApiProvider(
      ApiProviders.Spotify,
    );
  }

  async GetAll(page: number): Promise<Paginate<IMusic>> {
    const [data, total] = await this.musicRepository.findAndCount({
      take: this._pageSize,
      skip: (page - 1) * this._pageSize,
    });

    const itemsToFetch = data.filter((x) => !x.Name);

    if (total > 0 && itemsToFetch.length === 0) {
      return {
        Items: data,
        Total: total,
      };
    }

    //#region Fetch items from api
    const token = await this._apiProvider.GetToken();

    await Promise.all([
      this._SaveItemsFromApi(
        token,
        itemsToFetch.filter((x) => x.Type === MusicTypes.Album),
      ),
      this._SaveItemsFromApi(
        token,
        itemsToFetch.filter((x) => x.Type === MusicTypes.Track),
      ),
    ]);
    //#endregion

    return this.GetAll(page);
  }

  private async _SaveItemsFromApi(
    token: string,
    items: Music[],
  ): Promise<void> {
    if (items.length === 0) return;

    let result: object[];
    const ids = items.map((x) => x.ApiId);

    switch (items[0].Type) {
      case MusicTypes.Album:
        result = await this._apiProvider.GetAlbums(token, ids);
        break;

      case MusicTypes.Track:
      default:
        result = await this._apiProvider.GetTracks(token, ids);
        break;
    }

    const _items: IMusic[] = [];
    for (let index = 0; index < items.length; index++) {
      let item = items[index];

      let artists: Artist[] = MusicMapper.GetArtists(result[index], item.Type);

      //#region Get artists images
      if (artists.length > 0)
        artists = await this._UpdateArtists(artists, token);
      //#endregion

      _items.push(
        MusicMapper.FromJson(result[index], item.Id, item.Type, artists),
      );
    }
    this.musicRepository.save(_items);
  }

  private async _UpdateArtists(
    artists: Artist[],
    token: string,
  ): Promise<Artist[]> {
    let _artists: Artist[];
    let artistsData = await this._apiProvider.GetArtists(
      token,
      artists.map((x) => x.ApiId),
    );
    _artists = artistsData.map((a) => MusicMapper.ArtistFromJson(a));
    Logger.log(_artists);

    return await this.artistRepository.ValidateAndSave(_artists);
  }
}
