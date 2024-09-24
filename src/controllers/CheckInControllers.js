import CheckIn from "@/models/CheckIn";
import StreakModel from "@/models/StreakModel";

export const postCheckIn = async (req, res) => {
  const { userId, message } = req.body;
  const today = new Date().toISOString().split('T')[0]; 

  const checkIn = await CheckIn.create({ userId, message, date: today });
  const userStreak = await StreakModel.findOne({ userId });
  if (userStreak) {
    const lastCheckInDate = userStreak.lastCheckInDate;

    if (isYesterday(lastCheckInDate)) {
      userStreak.streak += 1;
      userStreak.lastCheckInDate = today;
      await userStreak.save();
    } else if (lastCheckInDate !== today) {
      userStreak.streak = 1;
      userStreak.lastCheckInDate = today;
      await userStreak.save();
    }
  } else {
    await Streak.create({ userId, streak: 1, lastCheckInDate: today });
  }

  res.status(200).json({ message: 'Check-in posted successfully', checkIn });
};

// Utility function to check if date is yesterday
function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date === yesterday.toISOString().split('T')[0];
}
