import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const ProtectedRoute = ({ children }) => {
    const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 
    
    if (status === "unauthenticated") {
      router.push('/'); 
    }
  }, [status, router]);

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
