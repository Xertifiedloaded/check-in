
import GitHubProvider from "next-auth/providers/github";

const githubProvider = GitHubProvider({
  clientId: process.env.GITHUB_ID || process.env.GITHUB_ID_LOCA,
  clientSecret: process.env.GITHUB_SECRET || process.env.GITHUB_SECRET_LOCAL,
});

export default githubProvider;
