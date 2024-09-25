import { allCheckin } from "@/controllers/singleCheckin";
import databaseConnection from "@/lib/database";

export default async function handler(req, res) {
    await databaseConnection();
  if (req.method === "GET") {
    return allCheckin(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
