import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IMusic } from "../interfaces/music.interface";
import { Artist } from "./artist.model";

@Entity()
export class Music implements IMusic {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ unique: true })
  ApiId: string;

  @Column({ nullable: true })
  Name: string;

  @Column({ nullable: true })
  ImageUrl: string;

  @Column({ nullable: true })
  ExternalUrl: string;

  @ManyToMany((type) => Artist, { nullable: true, eager: true })
  @JoinTable()
  Artists: Artist[];

  @Column("tinyint")
  Type: number;

  static Create(json: IMusic, artists: Artist[]): Music {
    const instance = new Music();
    instance.Id = json.Id;
    instance.ApiId = json.ApiId;
    instance.Artists = artists;
    instance.ExternalUrl = json.ExternalUrl;
    instance.ImageUrl = json.ImageUrl;
    instance.Name = json.Name;
    instance.Type = json.Type;
    return instance;
  }
}
