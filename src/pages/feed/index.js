import { FeedUserCard } from "@/components/Card";
import { prisma } from "@/lib/prisma";

export default function Index({ posts }) {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <FeedUserCard key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Sort posts 
    },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(), 
  }));

  return {
    props: {
      posts: serializedPosts,
    },
  };
}
