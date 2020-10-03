import { Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Artist } from "./models/artist.model";

@EntityRepository(Artist)
export class ArtistRepository extends Repository<Artist> {
  async ValidateAndSave(artists: Artist[]): Promise<Artist[]> {
    const artistsToSave: Artist[] = [];

    for (let index = 0; index < artists.length; index++) {
      const artist = artists[index];
      const found = await this.findOne({ ApiId: artist.ApiId });

      if (found !== undefined) {
        artists[index] = found;
        continue;
      }

      artistsToSave.push(artist);
    }

    return artistsToSave.length === 0
      ? artists
      : await this.save(artistsToSave);
  }
}
