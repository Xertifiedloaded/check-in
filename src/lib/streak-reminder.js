import { PrismaClient } from "@prisma/client";
import { streakEndReminderTemplate } from "./NewYearTemplate";
import { transporter } from "./nodemailer";


const prisma = new PrismaClient();

async function sendStreakEndReminders() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      where: {
        streaks: {
          some: {
            lastCheckIn: {
              lt: new Date(today.getTime() - 24 * 60 * 60 * 1000),
            },
          },
        },
        hasPostedToday: false,
      },
    });

    const validUsers = users.filter(user => user.email && validateEmail(user.email));

    if (validUsers.length > 0) {
      const bccEmails = validUsers.map(user => user.email).join(", ");
      const personalizedHtml = validUsers.map(user => streakEndReminderTemplate(user.name, user.checkInUrl)).join("<br/>");

      const mailOptions = {
        bcc: bccEmails,
        subject: "Your streak is about to end - Don't forget to check in!",
        html: personalizedHtml,
      };

      await transporter.sendMail(mailOptions);
      console.log("Streak end reminder emails sent to all eligible users.");
    } else {
      console.log("No users found to send streak end reminders.");
    }
  } catch (error) {
    console.error("Error sending streak end reminders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

export { sendStreakEndReminders };