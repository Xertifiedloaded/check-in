import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { UserTable } from '@/components/UserTable';

export async function getServerSideProps() {
  const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,
        email: true,
        username: true,
        isVerified: true,
        isOwner: true,
        profilePicture: true,
        streaks: {
          select: {
            currentStreak: true,
          },
        },
      },
  });

  return {
    props: {
      users,
    },
  };
}

export default function UsersPage({ users }) {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <UserTable users={users} />
      </Suspense>
    </div>
  );
}
