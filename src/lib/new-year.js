import { PrismaClient } from "@prisma/client";
import { happyNewMonthTemplate } from "./NewYearTemplate";
import { transporter } from "./nodemailer";


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

      if (validUsers.length > 0) {
        const bccEmails = validUsers.map(user => user.email).join(", ");
        const personalizedHtml = validUsers.map(user => happyNewMonthTemplate(user.name)).join("<br/>");

        const mailOptions = {
          bcc: bccEmails,
          subject: "Happy New Year from Daily Checkin!",
          html: personalizedHtml,
        };

        await transporter.sendMail(mailOptions);
        console.log("Happy new year emails sent to all users.");
      } else {
        console.log("No users found to send happy new year emails.");
      }
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