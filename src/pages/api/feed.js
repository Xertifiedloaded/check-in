import databaseConnection from "@/lib/database";
import CheckIn from "@/models/CheckIn";

export default async function handler(req, res) {
  await databaseConnection();
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const checkIns = await CheckIn.find({}).populate("userId", "name profilePicture");
    const formattedCheckIns = checkIns.map((checkIn) => ({
      user: {
        id: checkIn.userId._id,
        name: checkIn.userId.name,
        profilePicture: checkIn.userId.profilePicture,
      },
      message: checkIn.message,
      date: checkIn.date,
    }));

    formattedCheckIns.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      message: "All check-ins retrieved successfully",
      checkIns: formattedCheckIns,
    });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    res.status(500).json({
      message: "Error fetching check-ins",
      error: error.message,
    });
  }
}
