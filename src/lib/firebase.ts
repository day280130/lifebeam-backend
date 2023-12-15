import { cert, initializeApp, type FirebaseError } from "firebase-admin/app";

export const firebaseApp = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

export const isFirebaseError = (error: unknown): error is FirebaseError => {
  if (typeof error !== "object") return false;
  if (error === null || error === undefined) return false;
  if (!("code" in error)) return false;
  if (!("message" in error)) return false;
  if (!("stack" in error)) return false;
  if (!("toJSON" in error)) return false;
  return true;
};
