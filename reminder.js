import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");




 const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: 'certifiedloaded@gmail.com',
      pass: "kzisjgrcckzfbhdn",
    },
  })

async function sendReminderEmailToAll(users) {
  const sentEmails = new Set();

  for (const user of users) {
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
      },
    });

    const validUsers = users.filter(user => validateEmail(user.email));

    if (validUsers.length > 0) {
      console.log(`Sending reminders to ${validUsers.length} users...`);
      await sendReminderEmailToAll(validUsers);
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







const reminderTemplate = (userName, websiteUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
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
  

  