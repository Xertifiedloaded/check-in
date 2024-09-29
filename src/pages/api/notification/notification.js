


export default function handler(req, res) {
  scheduleNotifications();
  res.status(200).json({ message: 'Notification scheduler started' });
}
