import { authOptions } from "@/lib/authOptions";
import databaseConnection from "@/lib/database";
import UserModel from "@/models/UserModel";

import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  await databaseConnection();

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id; 
  if (req.method === "GET") {

    try {
      const user = await UserModel.findById(userId).select("profilePicture");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.profilePicture) {
        return res.status(200).json({
          message: "No profile picture found",
          profilePicture: null,
        });
      }

      return res.status(200).json({ profilePicture: user.profilePicture });
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
