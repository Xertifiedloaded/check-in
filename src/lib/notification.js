import scheduleNotifications from "@/lib/notificationScheduler";

let schedulerStarted = false;

export default async function handler(req, res) {
  if (!schedulerStarted) {
    scheduleNotifications();
    schedulerStarted = true; 
  }
  console.log(schedulerStarted);
  res.status(200).json({ message: 'Scheduler started!' });
}
