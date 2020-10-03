import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { IMusic } from "../interfaces/music.interface";
import { Music } from "./music.model";

@Entity()
export class Artist implements IMusic {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ApiId: string;

  @Column({ nullable: true })
  Name: string;

  @Column({ nullable: true })
  ImageUrl: string;

  @Column({ nullable: true })
  ExternalUrl: string;

  @ManyToMany(
    (type) => Music,
    (music) => music.Artists,
  )
  Musics: Music[];

  static Create(json: IMusic): Artist {
    const instance = new Artist();
    instance.Id = json.Id;
    instance.ApiId = json.ApiId;
    instance.ExternalUrl = json.ExternalUrl;
    instance.ImageUrl = json.ImageUrl;
    instance.Name = json.Name;
    return instance;
  }
}
