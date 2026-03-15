import * as admin from 'firebase-admin';



import { ICampaign } from '../models/campaign';
import { IUser } from '../models/user';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  })
}

export const adminAuth = admin.auth()

export const adminDb = admin.firestore()

//
// function toMillis(dateLike: any): number {
//   if (dateLike?.toDate) return dateLike.toDate().getTime(); // Firestore Timestamp
//   return new Date(dateLike).getTime();                      // ISO string
// }
//
// function toDayKey(dateLike: any): string {
//   // Returns "YYYY-MM-DD" safely
//   return new Date(toMillis(dateLike)).toISOString().slice(0, 10);
// }