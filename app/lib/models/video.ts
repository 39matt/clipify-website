import { DocumentReference } from '@firebase/firestore'

export interface IVideo {
  id?: string;
  uid?: string;
  accountName: string;
  userAccountRef?: DocumentReference;
  comments: number;
  createdAt: string;
  likes: number;
  link: string;
  name: string;
  shares: number;
  views: number;
  coverUrl: string;
  approved?: boolean;
  isManual?: boolean;
  revenueStatus?: string;
}

// export type IVideoAPI = Omit<
//   IVideo,
//   "id" | "uid" | "userAccountRef" | "approved" | "isManual" | "revenueStatus"
// >;
// function toIVideo(api: IVideoAPI, rest: Omit<IVideo, keyof IVideoAPI>): IVideo {
//   return { ...api, ...rest };
// }