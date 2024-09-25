import CheckIn from "@/models/CheckIn";

export const allCheckin = async (req, res) => {
  const { id } = req.query; 

  if (!id) {
    return res.status(400).json({ message: "User _id is required" });
  }

  try {
    const checkIns = await CheckIn.find({ userId: id })
      .populate("userId", "name")
      .sort({ date: -1 }); 

    res.status(200).json({
      message: "All check-ins retrieved successfully",
      checkIns,
    });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    res.status(500).json({
      message: "Error fetching check-ins",
      error: error.message,
    });
  }
};
