import { DocumentReference } from '@firebase/firestore'

export interface IVideo {
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
}