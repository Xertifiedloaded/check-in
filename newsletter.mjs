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
});

async function sendEmails() {
  try {
    const users = await prisma.user.findMany();
    const emailPromises = users.map(async (user) => {
      try {
        await transporter.sendMail({
          from: `makindeolaitan01@gmail.com`,
          to: user.email,
          subject: "Access Restored: DailyCheckin is Back Online!",
          html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <main style="padding: 20px;">
              <p style="font-size: 16px; line-height: 1.6;">
                Hi <strong>${user.name}</strong>,
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                We're excited to let you know that our platform is now accessible from any ISP(Internet Service Provider) at <a href="https://daily-check-in.com.ng" style="color: #007bff;">dailycheckin.com.ng</a>. You can log in anytime to keep up with your daily activities.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                If you haven’t checked in today, be sure to do so to maintain your streak! Consistent check-ins help you stay on track and make the most of our platform.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                We’re thrilled to announce new updates on dailyCheckin! You can now view each other’s profiles, including profile pictures, and choose to make your check-ins private or public. We've also introduced a new UI design, along with options for both dark and light mode to enhance your experience.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                And that’s not all—soon, you’ll be able to chat directly with other users on the platform. This new messaging feature is just around the corner, so stay tuned for more updates!
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                Thank you for being part of the dailyCheckin community. We’re here to support you every step of the way.
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
        console.log(`Email sent to ${user.email}`);
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
      }
    });
    await Promise.all(emailPromises);
    console.log("All email attempts completed.");
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

sendEmails();