import { verifyToken } from "@/lib/auth";
import { authOptions } from "@/lib/authOptions";
import databaseConnection from "@/lib/database";
import UserModel from "@/models/UserModel";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  await databaseConnection();
    const session = await getServerSession(req, res, authOptions)
    const userId = session?.user?.id
    try {
      if (req.method === 'PATCH') {
        const { newEmail, newName } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (newEmail && !emailRegex.test(newEmail)) {
          return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        if (newEmail) {
          user.email = newEmail;
        }

        if (newName) {
          user.name = newName; 
        }

        await user.save(); 

        const updatedUser = await UserModel.findById(userId);
        return res.status(200).json({ 
          message: 'User details updated successfully', 
          email: updatedUser.email,
          name: updatedUser.name 
        });
      }

      if (req.method === 'DELETE') {
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        await UserModel.findByIdAndDelete(userId); 

        return res.status(200).json({ message: 'User account deleted successfully' });
      }

      res.setHeader('Allow', ['PATCH', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
