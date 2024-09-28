import databaseConnection from "@/lib/database";
import UserModel from "@/models/UserModel";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await databaseConnection();

  try {
    const users = await UserModel.find(
      {},
      { checkIns: 1, name: 1, email: 1, profilePicture: 1 }
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const checkIns = [];

    users.forEach((user) => {
      user.checkIns.forEach((checkIn) => {
        const checkInDate = new Date(checkIn.date);

        if (checkInDate >= today) {
          checkIns.push({
            id: user.id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            message: checkIn.message,
            date: checkIn.date,
            dateCategory: "today",
          });
        }

        else if (checkInDate < today && checkInDate >= yesterday) {
          checkIns.push({
            id: user.id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            message: checkIn.message,
            date: checkIn.date,
            dateCategory: "yesterday",
          });
        }
      });
    });

    const todaysCheckIns = checkIns
      .filter((checkIn) => checkIn.dateCategory === "today")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const yesterdaysCheckIns = checkIns
      .filter((checkIn) => checkIn.dateCategory === "yesterday")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      message: "All check-ins retrieved successfully",
      today: todaysCheckIns,
      yesterday: yesterdaysCheckIns,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}






// import databaseConnection from "@/lib/database";
// import UserModel from "@/models/UserModel";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   await databaseConnection();

//   try {
//     const users = await UserModel.find(
//       {},
//       { checkIns: 1, name: 1, email: 1, profilePicture: 1 }
//     );

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     const userCheckInsMap = {};

//     users.forEach((user) => {
//       user.checkIns.forEach((checkIn) => {
//         const checkInDate = new Date(checkIn.date);

//         // If today's check-in and latest, store in the map
//         if (checkInDate >= today) {
//           if (!userCheckInsMap[user.id] || new Date(userCheckInsMap[user.id].date) < checkInDate) {
//             userCheckInsMap[user.id] = {
//               id: user.id,
//               name: user.name,
//               email: user.email,
//               profilePicture: user.profilePicture,
//               message: checkIn.message,
//               date: checkIn.date,
//               dateCategory: "today",
//             };
//           }
//         }
//         // If yesterday's check-in and there's no entry, store the latest check-in
//         else if (checkInDate < today && checkInDate >= yesterday) {
//           if (!userCheckInsMap[user.id]) {
//             userCheckInsMap[user.id] = {
//               id: user.id,
//               name: user.name,
//               email: user.email,
//               profilePicture: user.profilePicture,
//               message: checkIn.message,
//               date: checkIn.date,
//               dateCategory: "yesterday",
//             };
//           }
//         }
//       });
//     });

//     const sortedCheckIns = Object.values(userCheckInsMap);

//     const todaysCheckIns = sortedCheckIns
//       .filter((checkIn) => checkIn.dateCategory === "today")
//       .sort((a, b) => new Date(b.date) - new Date(a.date));

//     const yesterdaysCheckIns = sortedCheckIns
//       .filter((checkIn) => checkIn.dateCategory === "yesterday")
//       .sort((a, b) => new Date(b.date) - new Date(a.date));

//     return res.status(200).json({
//       message: "Latest check-ins retrieved successfully",
//       today: todaysCheckIns,
//       yesterday: yesterdaysCheckIns,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// }