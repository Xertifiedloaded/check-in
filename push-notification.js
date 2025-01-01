require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const admin = require('firebase-admin');
const nodemailer = require("nodemailer");

if (!admin.apps.length) {
  const serviceAccount = require("./service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendNotificationToAll(users) {
  const sentNotifications = new Set();

  for (const user of users) {
    if (sentNotifications.has(user.email)) {
      console.log(`Skipping duplicate email for ${user.email}`);
      continue;
    }

    const personalizedNotification = notificationTemplate(user.name, "https://daily-check-in.com.ng");

    const payload = {
      token: user.fcmToken,
      notification: {
        title: "Reminder to Check-In",
        body: personalizedNotification,
      },
      webpush: {
        fcmOptions: {
          link: "https://daily-check-in.com.ng", 
        },
      },
    };

    try {
      await admin.messaging().send(payload);
      console.log(`Reminder notification sent to ${user.email}`);
      sentNotifications.add(user.email);
    } catch (error) {
      console.error(`Failed to send notification to ${user.email}:`, error.message);
    }
  }
}

async function sendRemindersToUnseenUsers() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true,
        isDeleted: false,
      },
      select: {
        name: true,
        email: true,
        fcmToken: true,  
      },
    });

    const validUsers = users.filter(user => validateEmail(user.email) && user.fcmToken);

    if (validUsers.length > 0) {
      console.log(`Sending reminders to ${validUsers.length} users...`);
      await sendNotificationToAll(validUsers);
    } else {
      console.log("No users found to send reminders.");
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

sendRemindersToUnseenUsers();

const notificationTemplate = (userName, websiteUrl) => {
  return `Hi ${userName},\n\nWe noticed you haven’t posted today! Share your thoughts with the community and inspire others.\n\nYour contributions are what make our community vibrant and engaging.\n\nClick here to check-in now: ${websiteUrl}\n\nIf you need help or have any questions, don't hesitate to reach out to us.\n\nBest regards,\nYour Team at DailyCheckin`;
};
