import { Link } from 'react-router-dom';
export function DataFeedback({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error?: unknown;
  retry: () => unknown;
}) {
  if (loading) return <p role="status">Loading…</p>;
  const expired =
    error &&
    typeof error === 'object' &&
    'status' in error &&
    error.status === 401;
  return (
    <div className="alert alert-danger">
      <p role="alert">
        {expired
          ? 'Your session has ended. Please sign in again.'
          : 'Unable to load this information. Please try again.'}
      </p>
      {expired ? (
        <Link to="/login">Sign in</Link>
      ) : (
        <button
          className="btn btn-outline-primary"
          onClick={() => void retry()}
        >
          Try again
        </button>
      )}
    </div>
  );
}
