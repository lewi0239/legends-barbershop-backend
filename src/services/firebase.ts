import admin from "firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

let firebaseApp: admin.app.App | null = null;
let initializationError: string | null = null;

function initializeFirebase(): admin.app.App | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (initializationError) {
    return null;
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  try {
    if (serviceAccountPath) {
      // Option A: Use service account JSON file
      const absolutePath = resolve(serviceAccountPath);
      if (!existsSync(absolutePath)) {
        initializationError = `Firebase service account file not found: ${absolutePath}`;
        console.warn(`⚠️  ${initializationError}`);
        console.warn("   Auth endpoints will return errors until credentials are configured.");
        return null;
      }
      const serviceAccount = JSON.parse(readFileSync(absolutePath, "utf-8"));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (projectId && clientEmail && privateKey) {
      // Option B: Use individual credentials (for production)
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      initializationError = "Firebase credentials not configured.";
      console.warn(`⚠️  ${initializationError}`);
      console.warn("   Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
      return null;
    }

    console.log("✅ Firebase Admin SDK initialized");
    return firebaseApp;
  } catch (error) {
    initializationError = `Firebase initialization failed: ${error}`;
    console.error(`❌ ${initializationError}`);
    return null;
  }
}

export function getFirebaseAuth(): admin.auth.Auth {
  const app = initializeFirebase();
  if (!app) {
    throw new Error(
      initializationError || "Firebase not initialized. Check your credentials configuration."
    );
  }
  return admin.auth(app);
}

export async function verifyFirebaseToken(
  idToken: string
): Promise<DecodedIdToken> {
  const auth = getFirebaseAuth();
  return auth.verifyIdToken(idToken);
}

export async function revokeUserTokens(uid: string): Promise<void> {
  const auth = getFirebaseAuth();
  await auth.revokeRefreshTokens(uid);
}

export { initializeFirebase };
