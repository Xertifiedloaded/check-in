

import credentialsProvider from "@/providers/Credential";
import githubProvider from "@/providers/GitHubProvider";
import googleProvider from "@/providers/GoogleProvider";
import databaseConnection from "./database";
import UserModel from "@/models/UserModel";

export const authOptions = {
  providers: [
    credentialsProvider,
    githubProvider,
    googleProvider,
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await databaseConnection()
      if (account.provider === "google") {
        const existingUser = await UserModel.findOne({ googleId: profile.id });
        if (!existingUser) {
          const newUser = await UserModel.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            googleId: profile.id,
          });
          user.userId = newUser._id; 
        } else {
          user.userId = existingUser._id; 
        }
      }
      return true; 
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.userId; 
      }
      return token; 
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; 
      }
      return session; 
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; 
    },
  },
};





