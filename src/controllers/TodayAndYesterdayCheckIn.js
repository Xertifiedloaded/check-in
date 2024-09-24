import CheckIn from "@/models/CheckIn";


export const getCheckIns = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toISOString().split('T')[0];

  const checkIns = await CheckIn.find({
    date: { $in: [today, yesterdayFormatted] },
  }).populate('userId', 'name');

  res.status(200).json(checkIns);
};
