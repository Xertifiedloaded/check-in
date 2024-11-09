
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../lib/authOptions";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const taskId = req.query.id;

  if (req.method === "PATCH") {
    try {
      const task = await prisma.task.update({
        where: {
          id: taskId,
          userId: session.user.id,
        },
        data: {
          completed: req.body.completed,
        },
      });
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update task" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}