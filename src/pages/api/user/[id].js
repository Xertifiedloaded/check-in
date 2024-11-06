import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          name: true,
          email: true,
          isVerified: true,
          profilePicture: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  } else if (req.method === "PATCH") {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    try {
      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: { name, email },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Failed to update user" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete the user along with their associated posts and streaks
      await prisma.user.delete({
        where: {
          id: id,
        },
      });
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res
      .setHeader("Allow", ["GET", "PATCH", "DELETE"])
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }
}
