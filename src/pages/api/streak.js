import databaseConnection from "@/lib/database";
import StreakModel from "@/models/StreakModel";

const handler = async (req, res) => {

  if (req.method === "GET") {
    databaseConnection()
    try {
      const allUserStreaks = await StreakModel.find().populate("userId", "name");
      if (allUserStreaks.length === 0) {
        return res.status(404).json({ message: "No user streaks found." });
      }
      return res.status(200).json({
        message: "All user streaks retrieved successfully",
        streaks: allUserStreaks,
      });
    } catch (error) {
      console.error("Error fetching all user streaks:", error);
      return res.status(500).json({
        message: "Error fetching all user streaks",
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
