import { DocumentReference } from '@firebase/firestore'

export interface IVideo {
  uid?: string;
  userAccountRef?: DocumentReference;
  comments: number;
  createdAt: string;
  likes: number;
  link: string;
  name: string;
  owner: string;
  shares: number;
  views: number;
}