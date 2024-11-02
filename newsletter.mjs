
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: 'certifiedloaded@gmail.com',
      pass: 'kzisjgrcckzfbhdn',
    },
  })
async function sendEmails() {
  try {
    const users = await prisma.user.findMany();
    const emailPromises = users.map((user) => {
      return transporter.sendMail({
        from: `makindeolaitan01@gmail.com`,
        to: user.email,
        subject: "Update: Temporary Access Disruption for Glo Network Users",
        html:`
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <header style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">dailyCheckin Team</h1>
        </header>
        <main style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.6;">
            Hi <strong>${user.name}</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            We’re reaching out to inform you of a temporary access issue that some users are facing. If you’re using the Glo service provider, you may experience difficulties accessing our platform. This issue isn’t limited to our website; it affects all websites hosted on Vercel, including Vercel’s own site.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            We’re actively working to resolve this by migrating to a new hosting platform that will ensure reliable access for everyone, regardless of network provider. This migration should be completed within the next 24 hours, though it may take a short period afterward for our domain to fully propagate.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            If you’re able to connect through a network other than Glo, you can continue using our platform without interruption. We greatly appreciate your patience and understanding as we make this transition to improve your experience.
          </p>
        </main>
        <footer style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <p style="font-size: 14px; color: #555; margin: 0;">
            Best regards,<br> dailyCheckin Team
          </p>
        </footer>
      </div>
        `,
      });
    });

    await Promise.all(emailPromises);
    console.log("Emails sent successfully to all users!");
  } catch (error) {
    console.error("Error sending emails:", error);
  } finally {
    await prisma.$disconnect();
  }
}

sendEmails();