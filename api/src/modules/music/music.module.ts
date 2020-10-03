import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IntegrationModule } from "../integration/integration.module";
import { Artist } from "./models/artist.model";
import { Music } from "./models/music.model";
import { ArtistRepository } from "./music.artist.repository";
import { MusicController } from "./music.controller";
import { MusicService } from "./music.service";

@Module({
  imports: [
    IntegrationModule,
    TypeOrmModule.forFeature([Music, Artist, ArtistRepository]),
  ],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
