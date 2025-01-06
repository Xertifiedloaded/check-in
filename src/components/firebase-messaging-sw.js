
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAF-ku8Rh7SUv-ueDF62Q3StxuqGXx6V9w",
    authDomain: "daily-checkin-b173a.firebaseapp.com",
    projectId: "daily-checkin-b173a",
    storageBucket: "daily-checkin-b173a.firebasestorage.app",
    messagingSenderId: "680727812702",
    appId: "1:680727812702:web:91aa558a02af9764af72cf",
    measurementId: "G-E19WMHFSG6"
  };

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
