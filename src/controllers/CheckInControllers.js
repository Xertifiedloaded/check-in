import { verifyToken } from "@/lib/auth";
import CheckIn from "@/models/CheckIn";
import StreakModel from "@/models/StreakModel";

export const postCheckIn = async (req, res) => {
  verifyToken(req, res, async () => {
    const { message } = req.body;
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const existingCheckIn = await CheckIn.findOne({ userId, date: today });
      if (existingCheckIn) {
        return res.status(400).json({ message: "You have already checked in today" });
      }

      const checkIn = await CheckIn.create({ userId, message, date: today });
      let userStreak = await StreakModel.findOne({ userId });

      if (userStreak) {
        const lastCheckInDate = new Date(userStreak.lastCheckInDate);
        lastCheckInDate.setHours(0, 0, 0, 0);

        if (isYesterday(lastCheckInDate)) {
          userStreak.streak += 1;
        } else if (lastCheckInDate.getTime() !== today.getTime()) {
          userStreak.streak = 1;
        }
        userStreak.lastCheckInDate = today;
        await userStreak.save();
      } else {
        userStreak = await StreakModel.create({ userId, streak: 1, lastCheckInDate: today });
      }

      res.status(200).json({ message: "Check-in posted successfully", checkIn, userStreak });
    } catch (error) {
      console.error("Error posting check-in:", error);
      res.status(500).json({ message: "Error posting check-in", error: error.message });
    }
  });
};

export const getCheckIns = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    const checkIns = await CheckIn.find({
      date: { $gte: yesterday, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    }).populate("userId", "name");

    if (checkIns.length === 0) {
      console.log("No check-ins found. Diagnostic information:");
      console.log("Query date range:", yesterday, "to", new Date(today.getTime() + 24 * 60 * 60 * 1000));
      
      const recentCheckIns = await CheckIn.find().sort({ date: -1 }).limit(5);
      console.log("5 most recent check-ins:", checkIns);
    }

    res.status(200).json(checkIns);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    res.status(500).json({ message: "Error fetching check-ins", error: error.message });
  }
};

function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return date.getTime() === yesterday.getTime();
}