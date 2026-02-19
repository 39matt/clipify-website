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
  })
}

export const adminAuth = admin.auth()

export const adminDb = admin.firestore()

async function updateFields() {
  const usersCollection = adminDb.collection("users");
  const snapshot = await usersCollection.get();

  console.log(`Found ${snapshot.size} users`);

  let batch = adminDb.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const userData = doc.data() as IUser;

    // Only update the specific user
    // if (userData.email !== "matkodxd@gmail.com") {
    //   continue;
    // }
      console.log('Editing user -> ', userData.email);
      batch.update(doc.ref, {
        payoutRequested: ""
      });

    count++;

    if (count % 500 === 0) {
      console.log(`Committing batch of 500...`);
      await batch.commit(); // ✅ await here
      batch = adminDb.batch();
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✅ Updated ${count} documents`);
}

// updateFields().catch((err) => {
//   console.error("Error updating users:", err);
// });
//
// async function combineCampaigns(campaignIds, newCombinedId) {
//   const db = admin.firestore()
//
//   const combinedData = {
//     activity: 'Clipping',
//     influencer: 'Trajko',
//     totalLikes: 607566,
//     totalComments: 5424,
//     totalShares: 269232,
//     totalViews: 33944299,
//     budget: 1005,
//     moneySpent: 1616.51,
//     isActive: false,
//     progress: 100,
//   }
//
//   const newCampaignRef = db.collection('campaigns').doc(newCombinedId)
//   await newCampaignRef.set(combinedData)
//
//   const snapshotsByDate = new Map()
//
//   for (const campaignId of campaignIds) {
//     const snapshotsRef = db
//       .collection('campaigns')
//       .doc(campaignId)
//       .collection('snapshots')
//     const snapshotsSnapshot = await snapshotsRef.get()
//
//     snapshotsSnapshot.docs.forEach((doc) => {
//       const data = doc.data()
//       const dateKey = data.date
//
//       if (!snapshotsByDate.has(dateKey)) {
//         snapshotsByDate.set(dateKey, {
//           date: data.date,
//           totalViews: 0,
//           totalLikes: 0,
//           totalComments: 0,
//           totalShares: 0,
//           progress: data.progress || 0,
//         })
//       }
//
//       const combined = snapshotsByDate.get(dateKey)
//       combined.totalViews += data.totalViews || 0
//       combined.totalLikes += data.totalLikes || 0
//       combined.totalComments += data.totalComments || 0
//       combined.totalShares += data.totalShares || 0
//     })
//   }
//
//   let snapshotBatch = db.batch() // Initialize here
//   let batchCount = 0
//
//   const snapshotsArray = Array.from(snapshotsByDate.values())
//   for (const snapshot of snapshotsArray) {
//     const snapshotRef = newCampaignRef.collection('snapshots').doc()
//     snapshotBatch.set(snapshotRef, snapshot)
//     batchCount++
//
//     if (batchCount >= 500) {
//       await snapshotBatch.commit()
//       snapshotBatch = db.batch()
//       batchCount = 0
//     }
//   }
//
//   if (batchCount > 0) {
//     await snapshotBatch.commit()
//   }
//
//   for (const campaignId of campaignIds) {
//     const videosRef = db
//       .collection('campaigns')
//       .doc(campaignId)
//       .collection('videos')
//     const videosSnapshot = await videosRef.get()
//
//     const videoBatch = db.batch()
//     videosSnapshot.docs.forEach((videoDoc) => {
//       const newVideoRef = newCampaignRef.collection('videos').doc(videoDoc.id)
//       videoBatch.set(newVideoRef, {
//         ...videoDoc.data(),
//       })
//     })
//
//     await videoBatch.commit()
//   }
//
//   console.log('✅ Campaign combination complete')
// }
//
// combineCampaigns([
//   'VdxpUppry2Pf0QrEDLKp',
//   'KLFePFle0WFAOPjMPxwc',
//   'F8jPtmApihCkblZUJhoH',
//   '8z5YKPCSfZe0J1IHz6Se',
// ], 'trajko').catch(console.error)