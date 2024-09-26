import { authOptions } from "@/lib/authOptions";
import databaseConnection from "@/lib/database";
import UserModel from "@/models/UserModel";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  await databaseConnection(); 
  const session = await getServerSession(req, res, authOptions); 
  const userId = session?.user?.id; 

  const { imageUrl } = req.body; 

  try {
    if (req.method === "POST") {
      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      existingUser.profilePicture = imageUrl;
      await existingUser.save();

      return res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePicture: existingUser.profilePicture,
      });
    }

    if (req.method === "DELETE") {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.profilePicture = null;
      await user.save();

      return res.status(200).json({ message: "Profile picture deleted successfully" });
    }

    res.setHeader("Allow", ["POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Error in profile picture handler:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
