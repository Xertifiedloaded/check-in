import   { NotificationOption, transporter } from '../../../lib/nodemailer'
import cron from 'node-cron';
let cronJob;

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       if (cronJob) {
//         cronJob.stop();
//       }

//       cronJob = cron.schedule('* * * * *', async () => {
//         try {
//           await transporter.sendMail(NotificationOption);
//           console.log('Email sent successfully at:', new Date().toLocaleString());
//         } catch (error) {
//           console.error('Error sending email:', error);
//         }
//       });

//       res.status(200).json({ message: 'Cron job started successfully' });
//     } catch (error) {
//       console.error('Error starting cron job:', error);
//       res.status(500).json({ error: 'Failed to start cron job' });
//     }
//   } else if (req.method === 'DELETE') {
//     if (cronJob) {
//       cronJob.stop();
//       cronJob = null;
//     }
//     res.status(200).json({ message: 'Cron job stopped successfully' });
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }




export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false });
  }

  if (req.method === 'POST') {
    try {
      await transporter.sendMail(NotificationOption);
      console.log('Email sent successfully at:', new Date().toLocaleString());
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
