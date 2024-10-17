import { getUserCurrentStreak } from "@/controller/commentController";


export default async function handler(req, res) {

  const { userId } = req.query;
  if (req.method === 'GET') {
    try {
      const currentStreak = await getUserCurrentStreak(userId);

      if (currentStreak === null) {
        return res.status(404).json({ message: 'Streak not found' });
      }

      return res.status(200).json({ currentStreak });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
