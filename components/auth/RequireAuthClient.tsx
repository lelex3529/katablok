'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuthClient({ children }: RequireAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <span className='text-katalyx-primary font-sora text-lg animate-pulse'>
          Chargement...
        </span>
      </div>
    );
  }

  if (!session) return null;
  return <>{children}</>;
}
