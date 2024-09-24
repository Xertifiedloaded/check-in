// pages/api/logout.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict');
      
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }