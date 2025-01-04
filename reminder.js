require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: 'certifiedloaded@gmail.com',
    pass: 'kzisjgrcckzfbhdn',
  },
});

const BATCH_SIZE = 50; 
const DELAY = 2000; 

async function sendReminderEmailToAll(users) {
  const sentEmails = new Set();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    if (sentEmails.has(user.email)) {
      console.log(`Skipping duplicate email for ${user.email}`);
      continue;
    }

    const personalizedHtml = reminderTemplate(user.name, "https://daily-check-in.com.ng");

    const mailOptions = {
      to: user.email,
      subject: "Reminder to Check-In",
      html: personalizedHtml,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${user.email}`);
      sentEmails.add(user.email);
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error.message);
    }

    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`Batch of ${BATCH_SIZE} emails sent. Pausing for ${DELAY / 1000} seconds...`);
      await delay(DELAY);
    }
  }
}

async function sendRemindersToUnseenUsers() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to compare only the date

    // Fetch users and their latest streak information
    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true,
        isDeleted: false,
      },
      include: {
        streaks: {
          orderBy: {
            lastCheckIn: 'desc', // Order by last check-in date to get the latest streak
          },
          take: 1, // Only take the most recent streak
        },
      },
    });

    // Filter users who haven't checked in today
    const validUsers = users.filter(user => {
      if (user.streaks.length === 0) return true; // No streak, send reminder

      const lastStreak = user.streaks[0];
      return !lastStreak.lastCheckIn || new Date(lastStreak.lastCheckIn).getDate() !== today.getDate();
    }).map(user => ({
      name: user.name,
      email: user.email,
    }));

    if (validUsers.length > 0) {
      console.log(`Sending reminders to ${validUsers.length} users who haven't checked in today...`);
      await sendReminderEmailToAll(validUsers);
    } else {
      console.log("No valid users found to send reminders.");
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

sendRemindersToUnseenUsers();

// Reminder email template
const reminderTemplate = (userName, websiteUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reminder to Check-In</title>
    </head>
    <body>
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Nunito', Helvetica, Arial, sans-serif;">
        <tr>
          <td style="background-color: #007AFF; color: #fff; padding: 40px; border-radius: 12px 12px 0 0;">
            <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Hi ${userName},</h1>
            <p style="font-size: 15px; font-weight: 400; margin-top: 12px;">We noticed you haven’t posted today! Share your thoughts with the community and inspire others..</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F5F5F5; padding: 20px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px; font-weight: 400; margin-top: 12px;">Your contributions are what make our community vibrant and engaging</p>
            <a href="${websiteUrl}" style="display: inline-block; background-color: #007AFF; color: #fff; padding: 16px 24px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">Check-In Now</a>
            <p style="font-size: 14px; color: #888; margin-top: 24px;">If you need help or have any questions, don't hesitate to reach out to us.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #EEEEEE; text-align: center; padding: 20px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 14px; color: #888;">Best regards,<br>Your Team at DailyCheckin</p>
            <p style="font-size: 12px; color: #aaa;">You're receiving this email because you signed up with us.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
