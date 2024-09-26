import databaseConnection from "@/lib/database";
import CheckIn from "@/models/CheckIn";

export default async function handler(req, res) {
  await databaseConnection();

  const { id } = req.query;

  if (req.method === "GET") {
    try {

      const checkIns = await CheckIn.find({ userId: id })
        .populate("userId", "name profilePicture")
        .sort({ createdAt: 1 }); 

      if (!checkIns || checkIns.length === 0) {
        return res.status(200).json({
          message: `No check-ins found for user with ID: ${id}`,
          checkIns: [],
        });
      }

      return res.status(200).json({
        message: `Check-ins retrieved successfully for user ID: ${id}`,
        checkIns,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error fetching user check-ins",
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }
}
