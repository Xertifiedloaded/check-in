
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendNotification = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email, 
    subject: 'Reminder: Check in to maintain your streak!',
    text: `Hello ${user.name},\n\nThis is a friendly reminder to check in today to keep your streak going!\n\nBest regards,\nYour App Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};

export default sendNotification;
