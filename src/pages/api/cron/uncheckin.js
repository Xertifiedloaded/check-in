import { PrismaClient } from "@prisma/client";
import { transporter } from "../../../lib/nodemailer";
import { reminderTemplate } from "../../../lib/CheckinReminder";
const prisma = new PrismaClient();

async function sendReminderEmail(userEmail) {
  const mailOptions = {
    to: userEmail,
    subject: "Reminder to Check-In",
    html: reminderTemplate(userEmail, "https://daily-check-in.com.ng"),
  };

  await transporter.sendMail(mailOptions);
}

export async function sendRemindersToUnseenUsers() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const users = await prisma.user.findMany({
      where: {
        posts: {
          none: {
            createdAt: {
              gte: today, 
            },
          },
        },
      },
    });

    for (const user of users) {
      if (user.email && validateEmail(user.email)) {
        await sendReminderEmail(user.email);
        console.log(`Reminder email sent to ${user.email}`);
      }
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}
