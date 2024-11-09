import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../lib/authOptions";
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { userId } = req.query;
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }

  if (req.method === "POST") {
    try {
      const task = await prisma.task.create({
        data: {
          content: req.body.content,
          userId: session?.user?.id,
        },
      });
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create task" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
