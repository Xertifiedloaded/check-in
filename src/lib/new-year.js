import { PrismaClient } from "@prisma/client";
import { transporter } from "./nodemailer";
import { happyNewYearTemplate } from "./NewYearTemplate";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function sendHappyNewYearEmails() {
  try {
    const today = new Date();

    if (today.getMonth() === 0 && today.getDate() === 1) {
      const users = await prisma.user.findMany({
        where: {
          notificationsEnabled: true, 
          isDeleted: false, 
        },
      });
  

      const validUsers = users.filter(user => validateEmail(user.email));
      for (const user of validUsers) {
        const mailOptions = {
          to: user.email,
          subject: "Happy New Year from Daily Checkin!",
          html: happyNewYearTemplate(user.name),
          attachments: [
            {
              filename: "new-year-2025.jpeg",
              path: path.join(process.cwd(), "public", "new-year-2025.jpeg"),
              cid: "newYearBanner",
            },
          ],
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${user.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
        }
      }

      console.log(`Happy New Year emails sent to ${validUsers.length} users.`);
    } else {
      console.log("Not the start of a new year, skipping Happy New Year emails.");
    }
  } catch (error) {
    console.error("Error sending Happy New Year emails:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

export { sendHappyNewYearEmails };
