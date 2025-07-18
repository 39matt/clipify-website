import { IVideo } from './video'

export interface IAccount {
  id?: string
  link: string;
  platform: string;
  username: string;
  videos: IVideo[];
}