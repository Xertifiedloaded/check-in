import nodemailer from 'nodemailer';
import { createEmailContent } from './emailContent';

export const transporter = nodemailer.createTransport({
  service: 'gmail', 
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  connectionTimeout: 10000, 
  socketTimeout: 10000,
});



export const  NotificationOption = {
  // from: process.env.EMAIL_USER,
  to: 'horllypizzy@gmail.com',  
  subject: 'Automated Email Update',
  text: 'This is your automated email update.',
  html: '<h1>Automated Update</h1><p>This is your automated email update.</p>'
};




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
