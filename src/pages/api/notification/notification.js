
export default async function handler(req, res) {
  try {
    await scheduleNotifications();
    res.status(200).json({ message: 'Notification scheduler started' });
  } catch (error) {
    console.error('Error starting notification scheduler:', error);
    res.status(500).json({ error: 'Failed to start notification scheduler' });
  }
}