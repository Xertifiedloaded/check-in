import { transporter } from "./nodemailer";

export const sendNotification = async (user, type) => {
  const { subject, body } = createEmailContent(user.name, type);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};

export async function sendEmailCommentNotification({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: 'Daily-CheckIn <noreply@checkin.com.ng>',
      to: to,
      subject: subject,
      html: html, 
    });
    return true;
  } catch (error) {

    return false;
  }
}



export const createEmailContent = (userName, type) => {
  switch (type) {
    case 'streak':
      return {
        subject: 'Don\'t Forget to Check In!',
        body: `Hi ${userName},\n\nJust a quick reminder to check in today and maintain your streak!\n\nBest,\nYour App Team`,
      };
    case 'post':
      return {
        subject: 'Reminder: Post Today!',
        body: `Hi ${userName},\n\nYou haven’t posted today! Share something with us!\n\nCheers,\nYour App Team`,
      };
    case 'combined':
      return {
        subject: 'Reminder: Check In & Post!',
        body: `Hi ${userName},\n\nJust a friendly reminder:\n- Check in today to keep your streak alive!\n- You haven’t posted yet—share your thoughts!\n\nThanks,\nYour App Team`,
      };
    default:
      return {
        subject: 'Notification',
        body: `Hi ${userName},\n\nYou have a new notification!\n\nBest,\nYour App Team`,
      };
  }
};
