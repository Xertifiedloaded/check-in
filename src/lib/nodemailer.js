import nodemailer from 'nodemailer';
import { createEmailContent } from './emailContent';

export const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});



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
