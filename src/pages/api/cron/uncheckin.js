import { PrismaClient } from "@prisma/client";
import { transporter } from "../../../lib/nodemailer";
import { reminderTemplate } from "../../../lib/CheckinReminder";
const prisma = new PrismaClient();

async function sendReminderEmailToAll(users) {
    const bccEmails = users.map(user => user.email).join(", ");
    const personalizedHtml = users.map(user => {
      return reminderTemplate(user.name, "https://daily-check-in.com.ng");
    }).join("<br/>");
  
    const mailOptions = {
      bcc: bccEmails,
      subject: "Reminder to Check-In",
      html: personalizedHtml, 
    };

    await transporter.sendMail(mailOptions);
    console.log("Reminder emails sent to all users.");
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

    const validUsers = users.filter(user => user.email && validateEmail(user.email));
    if (validUsers.length > 0) {
      await sendReminderEmailToAll(validUsers); 
    } else {
      console.log("No users found to send reminders.");
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
