// import { prisma } from "@/lib/prisma"

// export default async function handler(req, res) {
//   try {
//     const streaksWithUserInfo = await prisma.streak.findMany({
//       include: {
//         user: {
//           select: {
//             name: true,
//             profilePicture: true
//           }
//         }
//       },
      
//     })

//     const formattedStreaks = streaksWithUserInfo.map(streak => ({
//       id: streak.id,
//       startDate: streak.startDate,
//       currentStreak: streak.currentStreak,
//       lastCheckIn: streak.lastCheckIn,
//       userId: streak.userId,
//       userName: streak.user?.name ?? null,
//       userProfilePicture: streak.user?.profilePicture ?? null
//     }))

//     res.status(200).json(formattedStreaks)
//   } catch (error) {
//     console.error("Error fetching streaks: ", error)
//     res.status(500).json({ error: "An error occurred while fetching streaks." })
//   }
// }




import { prisma } from "@/lib/prisma"

export default async function handler(req, res) {
  try {
    const streaksWithUserInfo = await prisma.streak.findMany({
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true
          }
        }
      }
    })

    const sortedStreaks = streaksWithUserInfo.sort((a, b) => b.currentStreak - a.currentStreak)
    const formattedStreaks = sortedStreaks.map((streak, index) => ({
      rank: index + 1, 
      id: streak.id,
      startDate: streak.startDate,
      currentStreak: streak.currentStreak,
      lastCheckIn: streak.lastCheckIn,
      userId: streak.userId,
      userName: streak.user?.name ?? null,
      userProfilePicture: streak.user?.profilePicture ?? null
    }))

    res.status(200).json(formattedStreaks)
  } catch (error) {
    console.error("Error fetching streaks: ", error)
    res.status(500).json({ error: "An error occurred while fetching streaks." })
  }
}
