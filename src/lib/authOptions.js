import databaseConnection from "./database"
import { comparePassword } from "./auth"
import UserModel from "@/models/UserModel"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, password } = credentials
        try {
          await databaseConnection()
          const user = await UserModel.findOne({ email })
          console.log(user)
          if (!user) {
            return null
          }
          const isMatch = await comparePassword(password, user.password)
          
          if (!isMatch) {
            return null
          }
          return user
        } catch (error) {
          console.log(error)
          return null
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({user, account}) {
      console.log("User:", user)
      console.log("Account:", account)
      if (!account || !account.provider) {
        console.error("Account is undefined or missing provider")
        return null
      }
      if (account.provider === "google") {
        try {
          const { name, email } = user
          await databaseConnection()
          const ifUserExist = await UserModel.findOne({ email })
          if (ifUserExist) {
            return user
          }
          const newUser = new UserModel({ name: name, email: email })
          const res = await newUser.save()
          if (res.status === 200 || res.status === 201) {
            return user
          }
        } catch (error) {
          console.log(error)
          return null
        }
      }
      return user
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
      }
      console.log(session)
      return session
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
