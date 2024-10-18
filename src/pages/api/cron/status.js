
import axios from 'axios';

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ success: false });
    }
  
  if (req.method === 'GET') {
    try {
      const response = await axios.post(
        'https://check-in-psi.vercel.app/api/cron/cron', 
        {}, 
        {
          headers: {
            Authorization: authHeader, 
          },
        }
      );
      
      console.log('POST request triggered successfully:', response.data);
      return res.status(200).json({ message: 'POST request triggered successfully' });
    } catch (error) {
      console.error('Error triggering POST request:', error);
      return res.status(500).json({ error: 'Failed to trigger POST request' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
