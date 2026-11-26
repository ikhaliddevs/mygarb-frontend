import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="container py-5">
      <p className="eyebrow">MY GARB</p>
      <h1>Page not found</h1>
      <p>
        This page is unavailable. The application is currently in development.
      </p>
      <Link className="btn btn-primary" to="/">
        Return home
      </Link>
    </main>
  );
}
