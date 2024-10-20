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
    line-height: 1.6;
    color: #333333;
  `

  const buttonStyle = `
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 15px;
  `

  const getCommonHtml = (content) => `
    <html>
      <body style="${baseStyle}">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #4CAF50;">Hello ${userName}!</h2>
          ${content}
          <p>
            <a href="https://daily-check-in.com.ng" style="${buttonStyle}">Visit Our Website</a>
          </p>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Best regards,<br>Your App Team
            <br>Makinde Olaitan Oreofe
          </p>
        </div>
      </body>
    </html>
  `

  switch (type) {
    case "streak":
      return {
        subject: "Don't Forget to Check In!",
        body: getCommonHtml(`
          <p>Just a quick reminder to check in today and maintain your streak!</p>
          <p>Keep up the great work and don't break your momentum.</p>
        `),
      }
    case "post":
      return {
        subject: "Reminder: Post Today!",
        body: getCommonHtml(`
          <p>You haven't posted today! Share something with us!</p>
          <p>Your thoughts and experiences are valuable to our community.</p>
          <p>Your participation makes our community thrive!</p>
          <p>Log in to your account to stay updated with the latest activities.</p>
        `),
      }
    case "combined":
      return {
        subject: "Reminder: Check In & Post!",
        body: getCommonHtml(`
          <p>Just a friendly reminder:</p>
          <ul>
            <li>Check in today to keep your streak alive!</li>
            <li>You haven't posted yet—share your thoughts!</li>
          </ul>
          <p>Your participation makes our community thrive!</p>
        `),
      }
    default:
      return {
        subject: "Notification",
        body: getCommonHtml(`
          <p>You have a new notification!</p>
          <p>Log in to your account to stay updated with the latest activities.</p>
        `),
      }
  }
}
