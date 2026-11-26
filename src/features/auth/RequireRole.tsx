import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useSessionQuery } from '@/services/api/authApi';
import type { Role } from './model';
import { LoadingPage } from '@/shared/components/feedback/LoadingPage';

export function RequireRole({ role }: { role: Role }) {
  const location = useLocation();
  const session = useSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 60000,
  });
  if (session.isLoading || (!session.data && session.isFetching))
    return <LoadingPage />;
  if (session.error) {
    if ('status' in session.error && session.error.status === 401) {
      return (
        <Navigate
          replace
          to={
            '/login?expired=1&returnTo=' +
            encodeURIComponent(location.pathname + location.search)
          }
        />
      );
    }
    return (
      <main className="container py-5">
        <h1>Session unavailable</h1>
        <p role="alert">
          We could not check your session. Protected content remains
          unavailable.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => void session.refetch()}
        >
          Try again
        </button>{' '}
        <Link to="/">Return home</Link>
      </main>
    );
  }
  if (
    !session.data ||
    session.data.status !== 'active' ||
    session.data.role !== role
  )
    return <Navigate replace to="/access-denied" />;
  return <Outlet context={session.data} />;
}
