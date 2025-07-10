import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { ReactNode } from 'react';
import authOptions from '@/lib/authOptions';

interface RequireAuthProps {
  children: ReactNode;
}

export default async function RequireAuth({ children }: RequireAuthProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/login');
  }
  return <>{children}</>;
}
