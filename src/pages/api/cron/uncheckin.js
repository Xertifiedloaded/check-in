import { PrismaClient } from "@prisma/client";
import { transporter } from "../../../lib/nodemailer";
import { reminderTemplate } from "../../../lib/CheckinReminder";

const prisma = new PrismaClient();

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
      console.error(`Failed to send email to ${user.email}:`, error);
    }
  }
}

export async function sendRemindersToUnseenUsers() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch users who haven't posted today
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
      await sendReminderEmailToAll(validUsers);
    } else {
      console.log("No users found to send reminders.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}
