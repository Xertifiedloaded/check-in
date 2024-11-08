import { sendHappyNewMonthEmails } from "../../../lib/new-month";

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        await sendHappyNewMonthEmails();
        return res.status(200).json({ message: "Reminder emails sent successfully." });
      } catch (error) {
        console.error("Error sending reminders:", error);
        return res.status(500).json({ error: "Failed to send reminders." });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
  