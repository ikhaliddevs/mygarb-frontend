export function RouteErrorPage() {
  return (
    <main className="container py-5">
      <p className="eyebrow">MY GARB</p>
      <h1>We couldn’t open this page</h1>
      <p role="alert">
        Please try again. If the problem continues, return home.
      </p>
      <div className="d-flex flex-wrap gap-3">
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
        <a className="btn btn-outline-primary" href="/">
          Return home
        </a>
      </div>
    </main>
  );
}
