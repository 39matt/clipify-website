import * as admin from 'firebase-admin'
import { IUser } from '../models/user'

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