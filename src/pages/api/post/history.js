import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Check for an authenticated session
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const checkIns = await prisma.post.findMany({
        where: { userId: session.user.id },
        select: { createdAt: true }, 
      });

      const checkedInDates = checkIns
        .filter(checkIn => checkIn.createdAt) 
        .map(checkIn =>
          new Date(checkIn.createdAt).toISOString().split("T")[0]
        );

      return res.status(200).json({ checkedInDates });
    } catch (error) {
      console.error("Error fetching check-in history:", error);
      return res.status(500).json({ error: "Failed to fetch check-in history" });
    }
  }
  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
