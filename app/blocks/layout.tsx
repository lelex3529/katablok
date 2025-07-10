import RequireAuth from '@/components/auth/RequireAuth';

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
