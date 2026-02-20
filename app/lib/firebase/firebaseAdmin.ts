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
//
// async function updateFields() {
//   const usersCollection = adminDb.collection("users");
//   const snapshot = await usersCollection.get();
//
//   console.log(`Found ${snapshot.size} users`);
//
//   let batch = adminDb.batch();
//   let count = 0;
//
//   for (const doc of snapshot.docs) {
//     const userData = doc.data() as IUser;
//
//     // Only update the specific user
//     // if (userData.email !== "matkodxd@gmail.com") {
//     //   continue;
//     // }
//       console.log('Editing user -> ', userData.email);
//       batch.update(doc.ref, {
//         payoutRequested: ""
//       });
//
//     count++;
//
//     if (count % 500 === 0) {
//       console.log(`Committing batch of 500...`);
//       await batch.commit(); // ✅ await here
//       batch = adminDb.batch();
//     }
//   }
//
//   if (count % 500 !== 0) {
//     await batch.commit();
//   }
//
//   console.log(`✅ Updated ${count} documents`);
// }

// updateFields().catch((err) => {
//   console.error("Error updating users:", err);
// });
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
//
// // Deletes all docs in a subcollection in batches of 500
// async function clearSubcollection(ref: admin.firestore.CollectionReference) {
//   const snap = await ref.get();
//   if (snap.empty) return;
//
//   let batch = adminDb.batch();
//   let count = 0;
//
//   for (const doc of snap.docs) {
//     batch.delete(doc.ref);
//     count++;
//
//     if (count >= 500) {
//       await batch.commit();
//       batch = adminDb.batch();
//       count = 0;
//     }
//   }
//
//   if (count > 0) await batch.commit();
//   console.log(`🗑️  Cleared ${snap.size} docs from ${ref.path}`);
// }
//
// async function combineCampaigns(campaignIds: string[], newCombinedId: string) {
//   const db = adminDb;
//   const newCampaignRef = db.collection('campaigns').doc(newCombinedId);
//
//   const existingCampaign = await newCampaignRef.get();
//   if (existingCampaign.exists) {
//     console.log(`⚠️  WARNING: Campaign '${newCombinedId}' already exists!`);
//     console.log(`   Skipping execution to prevent accidental overwrites or duplicate runs.`);
//     return; // Exit the function immediately
//   }
//   // ── 1. CREATE COMBINED CAMPAIGN DOC ─────────
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
//   };
//
//   await newCampaignRef.set(combinedData);
//   console.log(`✅ Created combined campaign doc: ${newCombinedId}`);
//
//   // ── 2. CLEAR OLD SNAPSHOTS ──────────────────
//   await clearSubcollection(newCampaignRef.collection('snapshots'));
//
//   // ── 3. FETCH AND NORMALIZE SNAPSHOTS ────────
//
//   // campaignSnapshots[campaignId] = array of latest snapshots per day for that campaign
//   const campaignSnapshots: Record<string, any[]> = {};
//   // Keep track of every unique day that ANY campaign had a snapshot
//   const allUniqueDays = new Set<string>();
//
//   for (const campaignId of campaignIds) {
//     console.log(`📂 Reading snapshots from campaign: ${campaignId}`);
//
//     const snapsSnap = await db
//       .collection('campaigns')
//       .doc(campaignId)
//       .collection('snapshots')
//       .get();
//
//     // Pick only the LATEST snapshot per calendar day for this campaign
//     const latestPerDay = new Map<string, any>();
//
//     for (const doc of snapsSnap.docs) {
//       const data = doc.data();
//       if (!data.date) continue; // Skip invalid docs
//
//       const dayKey = toDayKey(data.date);
//       const ms = toMillis(data.date);
//       allUniqueDays.add(dayKey);
//
//       const existing = latestPerDay.get(dayKey);
//       if (!existing || ms > toMillis(existing.date)) {
//         latestPerDay.set(dayKey, data);
//       }
//     }
//
//     // Convert map to array and sort chronologically
//     const sortedSnaps = Array.from(latestPerDay.entries())
//       .sort((a, b) => a[0].localeCompare(b[0]))
//       .map(entry => ({ dayKey: entry[0], ...entry[1] }));
//
//     campaignSnapshots[campaignId] = sortedSnaps;
//     console.log(`   Unique days after dedup: ${sortedSnaps.length}`);
//   }
//
//   // Sort all unique days across all campaigns chronologically
//   const sortedDays = Array.from(allUniqueDays).sort((a, b) => a.localeCompare(b));
//   console.log(`\n📅 Total unique days across all campaigns: ${sortedDays.length}`);
//
//   // ── 4. CALCULATE RUNNING TOTALS (FILL FORWARD) ─
//
//   // Track the most recent stats seen for each campaign as we walk forward in time
//   const lastSeenState: Record<string, any> = {};
//   for (const cid of campaignIds) {
//     lastSeenState[cid] = { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, progress: 0 };
//   }
//
//   const finalCombinedSnapshots: any[] = [];
//
//   for (let i = 0; i < sortedDays.length; i++) {
//     const currentDay = sortedDays[i];
//
//     // 1. Update the 'lastSeenState' if a campaign had a new snapshot on this exact day
//     for (const cid of campaignIds) {
//       const snapForDay = campaignSnapshots[cid].find(s => s.dayKey === currentDay);
//       if (snapForDay) {
//         lastSeenState[cid] = snapForDay;
//       }
//     }
//
//     // 2. Sum the current state of ALL campaigns
//     // (If a campaign didn't update today, it uses its total from the previous day)
//     let sumViews = 0;
//     let sumLikes = 0;
//     let sumComments = 0;
//     let sumShares = 0;
//     let maxProgress = 0;
//
//     for (const cid of campaignIds) {
//       const state = lastSeenState[cid];
//       sumViews += state.totalViews || 0;
//       sumLikes += state.totalLikes || 0;
//       sumComments += state.totalComments || 0;
//       sumShares += state.totalShares || 0;
//
//       // Progress uses MAX across active campaigns, or sum if you prefer
//       maxProgress = Math.max(maxProgress, state.progress || 0);
//     }
//
//     finalCombinedSnapshots.push({
//       dayKey: currentDay,
//       date: new Date(`${currentDay}T23:59:59Z`).toISOString(), // Standardize to end of day UTC
//       totalViews: sumViews,
//       totalLikes: sumLikes,
//       totalComments: sumComments,
//       totalShares: sumShares,
//       progress: maxProgress
//     });
//   }
//
//   // ── 5. WRITE COMBINED SNAPSHOTS ────────────────
//   let snapshotBatch = db.batch();
//   let snapCount = 0;
//
//   for (let i = 0; i < finalCombinedSnapshots.length; i++) {
//     const snap = finalCombinedSnapshots[i];
//     const { dayKey, ...payload } = snap;
//
//     // Use "YYYY-MM-DD" as the document ID
//     const ref = newCampaignRef.collection('snapshots').doc(dayKey);
//     snapshotBatch.set(ref, payload);
//     snapCount++;
//
//     if (snapCount >= 500) {
//       await snapshotBatch.commit();
//       snapshotBatch = db.batch();
//       snapCount = 0;
//     }
//   }
//
//   if (snapCount > 0) await snapshotBatch.commit();
//   console.log(`✅ Written ${finalCombinedSnapshots.length} cumulative snapshot docs`);
//
//   // ── 6. COPY VIDEOS ──────────────────────────────
//   for (const campaignId of campaignIds) {
//     const videosSnap = await db
//       .collection('campaigns')
//       .doc(campaignId)
//       .collection('videos')
//       .get();
//
//     console.log(`🎬 Copying ${videosSnap.size} videos from: ${campaignId}`);
//
//     let videoBatch = db.batch();
//     let videoCount = 0;
//     let totalCopied = 0;
//
//     for (const videoDoc of videosSnap.docs) {
//       // Use original video ID
//       const newVideoRef = newCampaignRef.collection('videos').doc(videoDoc.id);
//       videoBatch.set(newVideoRef, { ...videoDoc.data() });
//       videoCount++;
//       totalCopied++;
//
//       if (videoCount >= 500) {
//         await videoBatch.commit();
//         videoBatch = db.batch();
//         videoCount = 0;
//       }
//     }
//
//     if (videoCount > 0) await videoBatch.commit();
//     console.log(`   ✅ Copied ${totalCopied} videos`);
//   }
//
//   console.log('\n🎉 ALL DONE: Campaign combination complete! Your chart will now strictly go UP 📈');
// }
//
// // ─────────────────────────────────────────────
// // RUN
// // ─────────────────────────────────────────────
//
// combineCampaigns([
//   'VdxpUppry2Pf0QrEDLKp',
//   'KLFePFle0WFAOPjMPxwc',
//   'F8jPtmApihCkblZUJhoH',
//   '8z5YKPCSfZe0J1IHz6Se',
// ], 'trajko2').catch(console.error);