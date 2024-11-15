
import { transporter } from './nodemailer';

export async function sendReminderEmail(recipientEmail) {


  const mailOptions = {
    to: recipientEmail,                  
    subject: 'Reminder Email',           
    text: 'This is your reminder email!'   
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
