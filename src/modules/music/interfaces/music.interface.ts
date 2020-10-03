import { MusicTypes } from "../models/musicTypes";

export interface IMusic {
  Id?: number;
  Artits?: IMusic[];
  ApiId: string;
  ExternalUrl?: string;
  ImageUrl?: string;
  Name?: string;
  Type?: number;
}
