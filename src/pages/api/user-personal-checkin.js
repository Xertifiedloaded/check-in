
import databaseConnection from "@/lib/database";
import UserModel from "@/models/UserModel";
import { getServerSession } from "next-auth/next"; 

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await databaseConnection();

  try {
    const userId = "96584d1a-ff14-4865-84e9-573051acf604"; 
    const user = await UserModel.findOne({ id: userId }, { checkIns: 1, name: 1, email: 1 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sortedCheckIns = user.checkIns.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      message: "User check-ins retrieved successfully",
      user: {
        name: user.name,
        email: user.email,
        checkIns: sortedCheckIns
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
