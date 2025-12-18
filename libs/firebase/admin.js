import admin from "firebase-admin";

function getAdminApp() {
    if (admin.apps.length) return admin.app();

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Missing Firebase Admin env vars (projectId/clientEmail/privateKey).");
    }

    if (!storageBucket) {
        throw new Error("Missing FIREBASE_STORAGE_BUCKET env var (e.g. <project>.appspot.com).");
    }

    return admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket,
    });
}

export const adminApp = getAdminApp();
export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export const storage = admin.storage();
