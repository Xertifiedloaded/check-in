
import { sendNotification } from "./emailContent";
import { prisma } from "@/lib/prisma"

export default async function Reminder() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        streaks: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notificationPromises = users.map(async (user) => {
      let notificationSent = false;

      if (user.streaks.length > 0) {
        const lastCheckInDate = new Date(user.streaks[0].lastCheckIn);
        lastCheckInDate.setHours(0, 0, 0, 0);

        if (lastCheckInDate.getTime() < today.getTime() - 24 * 60 * 60 * 1000) {
          console.log(`Sending streak reminder to ${user.email}`);
          await sendNotification(user, 'streak');
          notificationSent = true;
        }
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

      if (user.streaks.length > 0 && 
          new Date(user.streaks[0].lastCheckIn).getTime() < today.getTime() - 24 * 60 * 60 * 1000 && 
          !hasPostedToday) {
        console.log(`Sending combined reminder to ${user.email}`);
        await sendNotification(user, 'combined');
        notificationSent = true;
      }

      if (!notificationSent) {
        console.log(`No reminders needed for ${user.email} today.`);
      }
    });

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
}
