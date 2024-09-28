
import databaseConnection from "@/lib/database";
import UserModel from "@/models/UserModel";
import { getServerSession } from "next-auth/next"; 

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await databaseConnection();

  try {

    const users = await UserModel.find({}, { checkIns: 1, name: 1, email: 1 });

    const allCheckIns = users.reduce((acc, user) => {
      const userCheckIns = user.checkIns.map(checkIn => ({
        userId: user.id,
        name: user.name,
        email: user.email,
        message: checkIn.message,
        date: checkIn.date,
      }));
      return acc.concat(userCheckIns);
    }, []);

    const sortedCheckIns = allCheckIns.sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.status(200).json({
      message: "feed check-ins retrieved successfully",
      data: sortedCheckIns, 
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
