import { getSession } from "next-auth/react"

import databaseConnection from "@/lib/database"
import UserModel from "@/models/UserModel"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
// 96584d1a-ff14-4865-84e9-573051acf604 || 66f34b2e35cc8346d20a2aa8

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await databaseConnection();
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const userId = session.user.id;
  console.log(userId);

  // const userId = "96584d1a-ff14-4865-84e9-573051acf604"; 
  try {
    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Check-in message is required" });
    }

    const currentDate = new Date();
    const lastCheckInDate = user.lastCheckInDate ? new Date(user.lastCheckInDate) : null;

    let streakUpdated = false;
    if (!lastCheckInDate || lastCheckInDate.toDateString() !== currentDate.toDateString()) {
      if (lastCheckInDate && currentDate - lastCheckInDate <= 86400000) { 
        user.streakCount += 1;
      } else {
        user.streakCount = 1;
      }
      streakUpdated = true;
    }

    user.lastCheckInDate = currentDate;
    user.checkIns.unshift({ message, date: currentDate });

    await user.save();

    return res.status(200).json({
      message: "Check-in successful",
      id:user.id,
      streakCount: user.streakCount,
      streakUpdated,
      checkInDate: currentDate,
      checkIns: user.checkIns 
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
