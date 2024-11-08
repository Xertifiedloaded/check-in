import { transporter } from "./nodemailer"


export async function sendEmailCommentNotification({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: "Daily-CheckIn <noreply@checkin.com.ng>",
      to: to,
      subject: subject,
      html: html,
    })
    return true
  } catch (error) {
    return false
  }
}

export const sendNotification = async (user, type) => {
  const { subject, body } = createEmailContent(user.name, type)

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: subject,
    html: body,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Notification sent to ${user.email}`)
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error)
  }
}

export const createEmailContent = (userName, type) => {
  const baseStyle = `
    font-family: Arial, sans-serif;
    line-height: 1.8;
    color: #333;
    background-color: #f4f4f4;
    padding: 20px;
  `;

  const buttonStyle = `
    display: inline-block;
    padding: 12px 24px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 16px;
    margin-top: 20px;
  `;

  const cardStyle = `
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `;

  const footerStyle = `
    font-size: 14px;
    color: #888;
    margin-top: 20px;
  `;

  const getCommonHtml = (content) => `
    <html>
      <body style="${baseStyle}">
        <div style="text-align: center; padding: 20px;">
          <img src="https://www.daily-check-in.com.ng/check.svg" alt="Company Logo" style="max-width: 120px;"/>
        </div>
        <div style="${cardStyle}">
          <h2 style="color: #4CAF50; text-align: center;">Hello, ${userName}!</h2>
          ${content}
          <div style="text-align: center;">
            <a href="https://daily-check-in.com.ng" style="${buttonStyle}">Visit Our Website</a>
          </div>
          <p style="${footerStyle}">
            Best regards,<br>
            Your App Team<br>
            Makinde Olaitan Oreofe
          </p>
        </div>
      </body>
    </html>
  `;

  switch (type) {
    case "streak":
      return {
        subject: "Don't Forget to Check In!",
        body: getCommonHtml(`
          <p style="font-size: 16px; color: #555;">
            Just a quick reminder to check in today and keep your streak going strong!
            Every check-in brings you closer to your goals.
          </p>
        `),
      };
    case "post":
      return {
        subject: "Reminder: Post Today!",
        body: getCommonHtml(`
          <p style="font-size: 16px; color: #555;">
            We noticed you haven’t posted today! Share your thoughts with the community and inspire others.
          </p>
          <p style="font-size: 16px; color: #555;">
            Your contributions are what make our community vibrant and engaging.
          </p>
        `),
      };
    case "combined":
      return {
        subject: "Reminder: Check In & Post!",
        body: getCommonHtml(`
          <p style="font-size: 16px; color: #555;">
            Just a friendly reminder:
          </p>
          <ul style="font-size: 16px; color: #555; margin-left: 20px;">
            <li>Check in today to keep your streak alive!</li>
            <li>Share a post with the community—you haven't posted yet!</li>
          </ul>
          <p style="font-size: 16px; color: #555;">
            Your participation helps keep our community strong and active.
          </p>
        `),
      };
    default:
      return {
        subject: "Notification",
        body: getCommonHtml(`
          <p style="font-size: 16px; color: #555;">
            You have a new notification! Log in to your account to stay updated on the latest activities and announcements.
          </p>
        `),
      };
  }
};
