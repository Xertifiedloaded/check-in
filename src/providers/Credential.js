import CredentialsProvider from "next-auth/providers/credentials"

const URL =
  process.env.NEXT_CREDENTIAL_PRODUCTION ||
  process.env.NEXT_CREDENTIAL_LOCAL ||
  "https://check-in-green.vercel.app/api/auth/login"

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  async authorize(credentials) {
    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    })

    const data = await res.json()

    if (res.ok && data.user) {
      const { user } = data
      return {
        name: user.name,
        userId: user._id.toString(),
        email: user.email,
        image: user.profilePicture || null,
      }
    } else {
      return null
    }
  },
})

export default credentialsProvider
