import { IMusic } from "./interfaces/music.interface";
import { Artist } from "./models/artist.model";
import { Music } from "./models/music.model";
import { MusicTypes } from "./models/musicTypes";

export class MusicMapper {
  static FromJson(
    json: object,
    id: number,
    type: MusicTypes,
    artists?: Artist[],
  ): IMusic {
    const data = <IMusic>{
      Id: id,
      ApiId: json["id"],
      ExternalUrl: json["external_urls"]["spotify"],
      ImageUrl: this.GetImageUrl(json, type),
      Name: json["name"],
      Type: type,
    };

    if (artists) return Music.Create(data, artists);

    let _artists: Artist[] = this.GetArtists(json, type);
    return Music.Create(data, _artists);
  }

  static ArtistFromJson(json: object, type?: MusicTypes): Artist {
    let imageUrl: string | undefined;
    if (type) imageUrl = undefined;
    else if (json["images"]) imageUrl = json["images"][1]["url"];

    return Artist.Create({
      ApiId: json["id"],
      ExternalUrl: json["external_urls"]["spotify"],
      ImageUrl: imageUrl,
      Name: json["name"],
    });
  }

  static GetArtists(json: object, type: MusicTypes): Artist[] {
    const isAlbum = type === MusicTypes.Album;
    const artistsData = isAlbum ? json["artists"] : json["album"]["artists"];
    if (artistsData === undefined) return [];

    return artistsData.map((a: object) => this.ArtistFromJson(a, type));
  }

  static GetImageUrl(json: object, type?: MusicTypes): string | undefined {
    return !type || type === MusicTypes.Album
      ? json["images"][0]["url"]
      : json["album"]["images"][0]["url"];
  }
}
