import { comparePassword } from "./auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, password } = credentials
        try {
          if (!email || !password) {
            throw new Error("Email and password are required.")
          }
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            throw new Error("User not found. Please check the email.")
          }

          const isMatch = await comparePassword(password, user.password)
          if (!isMatch) {
            throw new Error("Incorrect password. Please try again.")
          }
          if (user.isGoogleAuth) {
            throw new Error("This user is registered with Google authentication. Please log in with Google.");
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
    async signIn({ user, account }) {
      if (!account || !account.provider) {
        console.error("Account is undefined or missing provider")
        return false
      }

      if (account.provider === "google") {
        const { name, email, image } = user 
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email },
          })

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                name,
                email,
                profilePicture: image,
                isGoogleAuth: true,
              },
            })
          } else {
            if (!dbUser.profilePicture || dbUser.profilePicture !== image) {
              dbUser = await prisma.user.update({
                where: { email },
                data: {
                  profilePicture: image,
                },
              })
            }
          }
          user.id = dbUser.id
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      if (account && account.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        })
        if (dbUser) {
          token.id = dbUser.id
        }
      }

      console.log(`JWT token:`, token)
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
      }
      console.log(`Session:`, session)
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
