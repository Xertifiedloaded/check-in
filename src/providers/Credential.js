

import CredentialsProvider from "next-auth/providers/credentials";

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  async authorize(credentials) {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok && data.user) {
      const { user } = data;
      return {
        name: user.name,
        userId: user._id.toString(),
        email: user.email,
        image: user.profilePicture || null,
      };
    } else {
      return null;
    }
  },
});

export default credentialsProvider;
