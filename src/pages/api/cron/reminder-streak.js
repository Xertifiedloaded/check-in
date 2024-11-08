import { sendStreakEndReminders } from "../../../lib/streak-reminder";

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        await sendStreakEndReminders();
        return res.status(200).json({ message: "Reminder emails sent successfully." });
      } catch (error) {
        console.error("Error sending reminders:", error);
        return res.status(500).json({ error: "Failed to send reminders." });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
  