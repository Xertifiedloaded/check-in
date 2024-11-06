import Reminder from '../../../lib/Reminder';


export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'GET') {
    try {
      await Reminder()
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



