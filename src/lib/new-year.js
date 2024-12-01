import { PrismaClient } from "@prisma/client";
import { transporter } from "./nodemailer";
import { happyNewYearTemplate } from "./NewYearTemplate";
import * as fs from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

async function sendHappyNewYearEmails() {
  try {
    const today = new Date();

    if (today.getMonth() === 0 && today.getDate() === 1) {
      const users = await prisma.user.findMany({
        select: {
          name: true,
          email: true,
        },
      });

      const validUsers = users.filter(user => user.email && validateEmail(user.email));
      for (const user of validUsers) {
        const mailOptions = {
          to: user.email,
          subject: "Happy New Year from Daily Checkin!",
          html: happyNewYearTemplate(user.name),
          attachments: [
            {
              filename: 'new-year-2025.jpeg',
              path: path.join(process.cwd(), 'public', 'new-year-2025.jpeg'),
              cid: 'newYearBanner'
            }
          ]
        };
        await transporter.sendMail(mailOptions);
      }

      console.log(`Happy new year emails sent to ${validUsers.length} users.`);
    } else {
      console.log("Not the start of a new year, skipping happy new year emails.");
    }
  } catch (error) {
    console.error("Error sending happy new year emails:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

export { sendHappyNewYearEmails };