
import GoogleProvider from "next-auth/providers/google";

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET_LOCAL,
}

);

export default googleProvider;
