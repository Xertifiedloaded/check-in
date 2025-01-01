const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "certifiedloaded@gmail.com",
    pass: "kzisjgrcckzfbhdn",
  },
});
async function sendHappyNewMonthEmails() {
  try {
    const today = new Date();

    if (today.getDate() === 1) {
      const users = await prisma.user.findMany({
        where: {
          notificationsEnabled: true,
          isDeleted: false,
        },
      });

      const validUsers = users.filter((user) => validateEmail(user.email));

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
      console.log(
        "Not the start of a new month, skipping Happy New Month emails."
      );
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

sendHappyNewMonthEmails();

const happyNewMonthTemplate = (userName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy New Month</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      margin: 10px 0;
      color: #555555;
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      background-color: #f1f1f1;
      color: #888888;
      text-align: center;
      padding: 10px 20px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Happy New Month!</h1>
    </div>
    <div class="content">
      <p>Dear ${userName},</p>
      <p>Welcome to a brand new month! 🌟</p>
      <p>We hope this month brings you happiness, success, and all your heart desires.</p>
      <p>Thank you for being part of our journey.</p>
      <p>Best wishes,</p>
      <p><strong>The Daily Check-in Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Daily Check-in. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
