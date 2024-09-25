import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not Authorized" });
    }

    return res.status(200).json({ success: session });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ message: "POST request handled" });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
