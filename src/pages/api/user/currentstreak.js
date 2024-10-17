import { getUserCurrentStreak } from "@/controller/commentController";
import { authOptions } from "@/lib/authOptions";

import { getServerSession } from "next-auth";



export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: "You must be logged in to perform this action." });
  }

  const userId = session.user.id;

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
