import { getCheckIns, postCheckIn } from "@/controllers/CheckInControllers";

import databaseConnection from "@/lib/database";


export default async function handler(req, res) {
  await databaseConnection();

  switch (req.method) {
    case 'POST':
      return postCheckIn(req, res);  
    case 'GET':
      return getCheckIns(req, res);  
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
