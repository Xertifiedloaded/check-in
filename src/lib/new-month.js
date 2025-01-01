import { PrismaClient } from "@prisma/client";
import { happyNewMonthTemplate } from "./NewYearTemplate";
import { transporter } from "./nodemailer";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function sendHappyNewMonthEmails() {
  try {
    const today = new Date();

    if (today.getDate() === 1) {
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
      for (const user of validUsers) {
        const mailOptions = {
          to: user.email,
          subject: "Happy New Month from Daily Checkin!",
          html: happyNewMonthTemplate(user.name),
          attachments: [
            {
              filename: "banner.jpg",
              path: path.join(process.cwd(), "public", "banner.jpg"),
              cid: "monthlyBanner", 
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

      console.log(`Happy New Month emails sent to ${validUsers.length} users.`);
    } else {
      console.log("Not the start of a new month, skipping Happy New Month emails.");
    }
  } catch (error) {
    console.error("Error sending Happy New Month emails:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

export { sendHappyNewMonthEmails };
