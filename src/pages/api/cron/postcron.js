
// export default async function handler(req, res) {
//     const authHeader = req.headers.authorization;
//     if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//         return res.status(401).json({ success: false });
//     }
//     if (req.method === 'POST') {
//         try {
//           const response = await fetch(`http://localhost:3000/api/cron/cron`, {
//             method: 'POST',
//           });
    
//           if (!response.ok) {
//             throw new Error('Failed to start email scheduler');
//           }
    
//           res.status(200).json({ message: 'Email scheduler started successfully' });
//         } catch (error) {
//           console.error('Error:', error);
//           res.status(500).json({ error: 'Failed to start email scheduler' });
//         }
//       } else if (req.method === 'DELETE') {
//         try {
//           const response = await fetch(`http://localhost:3000/api/cron/cron`, {
//             method: 'DELETE',
//           });
    
//           if (!response.ok) {
//             throw new Error('Failed to stop email scheduler');
//           }
    
//           res.status(200).json({ message: 'Email scheduler stopped successfully' });
//         } catch (error) {
//           console.error('Error:', error);
//           res.status(500).json({ error: 'Failed to stop email scheduler' });
//         }
//       } else {
//         res.status(405).json({ error: 'Method not allowed' });
//       }

  
// }






