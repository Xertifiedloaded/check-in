

import { prisma } from "@/lib/prisma"
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { content, userId } = req.body

    if (!content) {
      return res.status(400).json({ message: "Check-in message is required" })
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }
    try {
      const currentDate = new Date()
      let streak = await prisma.streak.findFirst({
        where: { userId: userId },
      })

      let streakUpdated = false
      let newStreak = null

      if (!streak) {
        newStreak = await prisma.streak.create({
          data: {
            userId: userId,
            startDate: currentDate,
            currentStreak: 1,
            lastCheckIn: currentDate,
          },
        })
        streakUpdated = true
      } else {
        if (isConsecutiveDay(streak.lastCheckIn, currentDate)) {
          newStreak = await prisma.streak.update({
            where: { id: streak.id },
            data: {
              currentStreak: streak.currentStreak + 1,
              lastCheckIn: currentDate,
            },
          })
          streakUpdated = true
        } else if (isSameDay(streak.lastCheckIn, currentDate)) {
          newStreak = streak
        } else {
          await prisma.streak.delete({
            where: { id: streak.id },
          })
          newStreak = null
        }
      }
      const checkIn = await prisma.post.create({
        data: {
          content,
          userId,
        },
      })
      return res.status(201).json({
        message: "Check-in posted successfully",
        checkIn,
        updatedStreak: newStreak ? newStreak.currentStreak : 0,
        streakUpdated,
      })
    } catch (error) {
      console.error("Error creating check-in:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

function isConsecutiveDay(date1, date2) {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000
  const differenceInDays = Math.round((date2 - date1) / oneDayInMilliseconds)
  return differenceInDays === 1
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
