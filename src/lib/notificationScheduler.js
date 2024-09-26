import schedule from "node-schedule"
import UserModel from "@/models/UserModel"
import sendNotification from "./sendNotification"

const scheduleNotifications = () => {
  // Schedule the job to run every day at 9 AM
  schedule.scheduleJob("0 9 * * *", async () => {
    const users = await UserModel.find({})
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const user of users) {
      // If last check-in was more than 1 day ago
      if (user.lastCheckIn < today - 24 * 60 * 60 * 1000) {
        console.log("hello this is your notification ")

        // sendNotification(user);
      }
    }
  })
}

export default scheduleNotifications
