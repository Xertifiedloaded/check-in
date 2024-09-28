import databaseConnection from "@/lib/database";
import UserModel from "@/models/UserModel";

export default async function handler(req, res) {
  await databaseConnection();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const users = await UserModel.find({}, { 
      name: 1, 
      email: 1, 
      profilePicture: 1, 
      streakCount: 1, 
      lastCheckInDate: 1 
    });

    const now = new Date();
    const twentyFourHoursAgo = new Date(now);
    twentyFourHoursAgo.setHours(now.getHours() - 24); 
    const ongoingStreaks = users.filter(user => {
      const lastCheckIn = user.lastCheckInDate ? new Date(user.lastCheckInDate) : null;
      return lastCheckIn && lastCheckIn >= twentyFourHoursAgo; 
    });

    const sortedOngoingStreaks = ongoingStreaks.sort((a, b) => b.streakCount - a.streakCount);
    const formattedStreaks = sortedOngoingStreaks.map(user => ({
      name: user.name,
      profilePicture: user.profilePicture,
      streakCount: user.streakCount,
      lastCheckInDate: user.lastCheckInDate, 
    }));

    return res.status(200).json({
      message: "Ongoing streaks retrieved successfully",
      streaks: formattedStreaks,
    });
  } catch (error) {
    console.error("Error fetching users' streaks:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
