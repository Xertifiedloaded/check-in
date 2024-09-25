import { verifyToken } from "@/lib/auth";
import CheckIn from "@/models/CheckIn";
import StreakModel from "@/models/StreakModel";

export const postCheckIn = async (req, res) => {
  verifyToken(req, res, async () => {
    const { message } = req.body;
    const userId = req.userId
    const today = new Date().toISOString().split("T")[0];
    try {
      const existingCheckIn = await CheckIn.findOne({ userId, date: today });
      const checkIn = await CheckIn.create({ userId, message, date: today });
      let userStreak = await StreakModel.findOne({ userId });

      if (!existingCheckIn) {
        if (userStreak) {
          const lastCheckInDate = userStreak.lastCheckInDate;
          if (isYesterday(lastCheckInDate)) {
            userStreak.streak += 1;
          } else if (lastCheckInDate !== today) {
            userStreak.streak = 1;
          }
          userStreak.lastCheckInDate = today;
          await userStreak.save();
        } else {
          userStreak = await StreakModel.create({
            userId,
            streak: 1,
            lastCheckInDate: today,
          });
        }
      }

      res.status(200).json({
        message: "Check-in posted successfully",
        checkIn,
        userStreak,
      });
    } catch (error) {
      console.error("Error posting check-in:", error);
      res.status(500).json({
        message: "Error posting check-in",
        error: error.message,
      });
    }
  });
};

export const getCheckIns = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toISOString().split("T")[0];

  try {
    const checkIns = await CheckIn.find({
      date: { $in: [today, yesterdayFormatted] },
    }).populate("userId", "name");

    if (checkIns.length === 0) {
      console.log("No check-ins found for today and yesterday.");
    } else {
  
    }

    res.status(200).json({
      message: "Check-ins for today and yesterday",
      todayCheckIns: checkIns.filter((checkIn) => checkIn.date === today),
      yesterdayCheckIns: checkIns.filter((checkIn) => checkIn.date === yesterdayFormatted),
    });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    res.status(500).json({
      message: "Error fetching check-ins",
      error: error.message,
    });
  }
};

function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const incomingDate = new Date(date);
  incomingDate.setHours(0, 0, 0, 0);

  return incomingDate.getTime() === yesterday.getTime();
}
