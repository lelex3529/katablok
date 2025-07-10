import RequireAuth from '@/components/auth/RequireAuth';

export default function HomePage() {
  return (
    <RequireAuth>
      <HomePage />
    </RequireAuth>
  );
}
