import RequireAuth from '@/components/auth/RequireAuth';
import Dashboard from '@/components/ui/HomePage';

export default function HomePage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
