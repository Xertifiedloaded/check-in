import { PrismaClient } from "@prisma/client";
import { transporter } from "./nodemailer";



const prisma = new PrismaClient();
async function sendReminderEmail(userEmail) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Reminder to Check-In",
    html: "Hello! Don't forget to check in today!" 
  };

  await transporter.sendMail(mailOptions);
}

export async function sendRemindersToUnseenUsers() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const users = await prisma.user.findMany({
      where: {
        lastSeen: {
          lt: today,
        },
      },
    });

    for (const user of users) {
      await sendReminderEmail(user.email);
      console.log(`Reminder email sent to ${user.email}`);
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  } finally {
    await prisma.$disconnect();
  }
}
