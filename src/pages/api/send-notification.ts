import admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

if (!admin.apps.length) {
  const serviceAccount = require("../../../service_key.json"); 
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token, title, message, link } = req.body;

    const payload = {
      token,
      notification: {
        title,
        body: message,
      },
      webpush: link && {
        fcmOptions: {
          link,
        },
      },
    };

    try {
      await admin.messaging().send(payload);
      return res.status(200).json({ success: true, message: "Notification sent!" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
