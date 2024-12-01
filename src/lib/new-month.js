import { PrismaClient } from "@prisma/client";
import { happyNewMonthTemplate } from "./NewYearTemplate";
import { transporter } from "./nodemailer";
import * as fs from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

async function sendHappyNewMonthEmails() {
  try {
    const today = new Date();

    if (today.getDate() === 1) {
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
          subject: "Happy New Month from Daily Checkin!",
          html: happyNewMonthTemplate(user.name),
          attachments: [
            {
              filename: 'banner.jpg',
              path: path.join(process.cwd(), 'public', 'banner.jpg'),
              cid: 'monthlyBanner' 
            }
          ]
        };

        await transporter.sendMail(mailOptions);
      }

      console.log(`Happy new month emails sent to ${validUsers.length} users.`);
    } else {
      console.log("Not the start of a new month, skipping happy new month emails.");
    }
  } catch (error) {
    console.error("Error sending happy new month emails:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

export { sendHappyNewMonthEmails };