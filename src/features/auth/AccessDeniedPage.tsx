import { Link } from 'react-router-dom';
export function AccessDeniedPage() {
  return (
    <main className="container py-5">
      <h1>Access denied</h1>
      <p>Your account does not have access to this workspace.</p>
      <Link to="/">Return home</Link> ·{' '}
      <Link to="/login">Sign in with another account</Link>
    </main>
  );
}
