import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF-ku8Rh7SUv-ueDF62Q3StxuqGXx6V9w",
  authDomain: "daily-checkin-b173a.firebaseapp.com",
  projectId: "daily-checkin-b173a",
  storageBucket: "daily-checkin-b173a.firebasestorage.app",
  messagingSenderId: "680727812702",
  appId: "1:680727812702:web:91aa558a02af9764af72cf",
  measurementId: "G-E19WMHFSG6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
