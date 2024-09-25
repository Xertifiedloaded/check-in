import { verifyToken } from "@/lib/auth"
import CheckIn from "@/models/CheckIn"
import StreakModel from "@/models/StreakModel"
import UserModel from "@/models/UserModel"




export const postCheckIn = async (req, res) => {
  verifyToken(req, res, async () => {
    const { message } = req.body
    const userId = req.userId
    const today = new Date().toISOString().split("T")[0]
    
    try {
      const existingCheckIn = await CheckIn.findOne({ userId, date: today })
      const checkIn = await CheckIn.create({ userId, message, date: today })
      let userStreak = await StreakModel.findOne({ userId })

      const user = await UserModel.findById(userId).select("name profilePicture"); 

      if (!existingCheckIn) {
        if (userStreak) {
          const lastCheckInDate = userStreak.lastCheckInDate
          if (isYesterday(lastCheckInDate)) {
            userStreak.streak += 1
          } else if (lastCheckInDate !== today) {
            userStreak.streak = 1
          }
          userStreak.lastCheckInDate = today
          await userStreak.save()
        } else {
          userStreak = await StreakModel.create({
            userId,
            streak: 1,
            lastCheckInDate: today,
          })
        }
      }

      res.status(200).json({
        message: "Check-in posted successfully",
        checkIn,
        userStreak,
        user: {
          name: user.name,
          profilePicture: user.profilePicture,
          message 
        }
      })
    } catch (error) {
      console.error("Error posting check-in:", error)
      res.status(500).json({
        message: "Error posting check-in",
        error: error.message,
      })
    }
  })
}

export const getCheckIns = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toISOString().split("T")[0];

  try {
    const checkIns = await CheckIn.find({
      date: { $in: [today, yesterdayFormatted] },
    })
      .populate("userId", "name profilePicture");

    if (checkIns.length === 0) {
      console.log("No check-ins found for today and yesterday.");
      return res.status(200).json({
        message: "No check-ins found for today and yesterday.",
        todayCheckIns: [],
        yesterdayCheckIns: [],
      });
    }

    const streaks = await StreakModel.find({
      userId: { $in: checkIns.map(checkIn => checkIn.userId._id) },
    });

    const streakMap = {};
    streaks.forEach(streak => {
      streakMap[streak.userId] = streak;
    });

    const formattedCheckIns = checkIns.map(checkIn => {
      const streak = streakMap[checkIn.userId._id] || { streak: 0, lastCheckInDate: null };
      return {
        ...checkIn.toObject(),
        user: {
          name: checkIn.userId.name,
          profilePicture: checkIn.userId.profilePicture,
        },
        streak: streak.streak,
        lastCheckInDate: streak.lastCheckInDate,
      };
    });


    formattedCheckIns.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      message: "Check-ins for today and yesterday",
      todayCheckIns: formattedCheckIns.filter(checkIn => checkIn.date === today),
      yesterdayCheckIns: formattedCheckIns.filter(checkIn => checkIn.date === yesterdayFormatted),
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
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const incomingDate = new Date(date)
  incomingDate.setHours(0, 0, 0, 0)

  return incomingDate.getTime() === yesterday.getTime()
}
