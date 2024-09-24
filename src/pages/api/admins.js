
import databaseConnection from '@/lib/database';
import User from '@/model/User';

export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === 'GET') {
    try {
      const admins = await User.find(); 
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}