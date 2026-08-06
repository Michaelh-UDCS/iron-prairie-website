import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

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

if (coreConfigComplete()) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  if (typeof window !== 'undefined' && measurementId) {
    isSupported()
      .then((ok) => {
        if (ok && app) analytics = getAnalytics(app);
      })
      .catch(() => {});
  }
} else if (import.meta.env.DEV) {
  console.warn(
    '[firebase] Web SDK is not initialized. Create `.env.local` from `.env.example` and add your Firebase web app config from the console.',
  );
}

export { app, analytics };
export const isFirebaseConfigured = Boolean(app);
