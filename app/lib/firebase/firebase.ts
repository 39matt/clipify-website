import { getApp, getApps, initializeApp } from '@firebase/app'
import { getFirestore } from '@firebase/firestore'
import { getAuth, signOut } from '@firebase/auth'


const firebaseConfig = {

  apiKey: "AIzaSyC9Zmq_mXXWEtL6WD4TF8zWOh6yiW9LMZ4",

  authDomain: "botina-44e95.firebaseapp.com",

  projectId: "botina-44e95",

  storageBucket: "botina-44e95.firebasestorage.app",

  messagingSenderId: "86747851038",

  appId: "1:86747851038:web:bdf9dd6741c3469243410f"

};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);