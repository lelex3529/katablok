import RequireAuth from '@/components/auth/RequireAuth';

export default function PropositionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
