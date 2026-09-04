import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  ...(measurementId ? { measurementId } : {}),
};

function coreConfigComplete() {
  const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = firebaseConfig;
  return [apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId].every(Boolean);
}

let app = null;
let analytics = null;
let db = null;
let appCheck = null;

if (coreConfigComplete()) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);

  if (typeof window !== 'undefined' && appCheckSiteKey) {
    try {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[firebase] App Check init failed:', err);
      }
    }
  }
} else if (import.meta.env.DEV) {
  console.warn(
    '[firebase] Web SDK is not initialized. Create `.env.local` from `.env.example` and add your Firebase web app config from the console.',
  );
}

export { app, analytics, db, appCheck };
export const isFirebaseConfigured = Boolean(app);
export const isAppCheckConfigured = Boolean(appCheck);
