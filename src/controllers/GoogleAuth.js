// import React from 'react'

// export default function GoogleAuth() {
//     async signIn({ user, account, profile }) {
//         if (existingUser) {
//           const updatedUser = await UserModel.findOneAndUpdate(
//             { googleId: profile.sub }, 
//             {
//               $set: {
//                 name: user.name,
//                 email: user.email,
//                 image: user.image,
//                 updatedAt: new Date(), 
//               },
//             },
//             { new: true, runValidators: true } 
//           );
        
//           if (!updatedUser) {
//             console.error('User update failed: No user was found to update.');
//             return false; 
//           }
        
//           user.id = updatedUser._id;
//           user.permissions = updatedUser.permissions || ["google-signin"];
//         } else {
//           const newUser = new UserModel({
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             googleId: profile.sub,
//             isGoogleAuth: true,
//             permissions: ["google-signin"],
//           });
        
//           try {
//             await newUser.save(); 
//             user.id = newUser._id; 
//             user.permissions = ["google-signin"]; 
//           } catch (error) {
//             console.error('Error saving new user:', error); 
//             return false; 
//           }
//         }
//         return true; 
        
//       }
// }
