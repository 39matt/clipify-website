import * as admin from 'firebase-admin'

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

export const setAdminClaim = async (uid) => {
  await adminAuth.setCustomUserClaims(uid, { isAdmin: true });
};

export const verifyAdmin = async (idToken) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.isAdmin) {
      console.log('User is an admin');
      return true;
    } else {
      console.log('User is not an admin');
      return false;
    }
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return false;
  }
};