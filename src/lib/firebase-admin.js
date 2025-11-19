// src/lib/firebase-admin.js 
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64;
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

    if (!serviceAccountBase64 || !bucketName) {
      throw new Error("Las variables de entorno de Firebase Admin no están definidas.");
    }

    const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucketName,
    });
    console.log("✅ Firebase Admin SDK inicializado.");
  } catch (error) {
    console.error("❌ ERROR FATAL al inicializar Firebase Admin SDK:", error.message);
  }
}

const getAdminDb = () => admin.firestore();
const getAdminStorage = () => admin.storage().bucket();

export const adminDb = getAdminDb();
export const adminStorage = getAdminStorage();