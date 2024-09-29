import schedule from "node-schedule";
import sendNotification from "./nodemailer";
import { prisma } from "./prisma";

const scheduleNotifications = () => {
//  run every day at 9 AM
  schedule.scheduleJob("0 9 * * *", async () => {
    try {
      const users = await prisma.user.findMany({
        include: {
          posts: true, 
          streaks: true,
        },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to the start of the day

      for (const user of users) {
        let notificationSent = false;
        if (user.streaks.length > 0 && user.streaks[0].lastCheckIn < today - 24 * 60 * 60 * 1000) {
          console.log(`Sending streak reminder to ${user.email}`);
          await sendNotification(user, 'streak');
          notificationSent = true;
        }

        const hasPostedToday = user.posts.some(post => {
          const postDate = new Date(post.createdAt);
          postDate.setHours(0, 0, 0, 0); 
          return postDate.getTime() === today.getTime();
        });

        if (!hasPostedToday) {
          console.log(`Sending posting reminder to ${user.email}`);
          await sendNotification(user, 'post');
          notificationSent = true;
        }

        // Optionally, send a combined notification if both conditions are true
        if (user.streaks.length > 0 && user.streaks[0].lastCheckIn < today - 24 * 60 * 60 * 1000 && !hasPostedToday) {
          console.log(`Sending combined reminder to ${user.email}`);
          await sendNotification(user, 'combined');
          notificationSent = true;
        }

        if (!notificationSent) {
          console.log(`No reminders needed for ${user.email} today.`);
        }
      }
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  });
};

export default scheduleNotifications;
