import { Link } from 'react-router-dom';
export function FoundationPage() {
  return (
    <div className="foundation-page">
      <a className="visually-hidden-focusable skip-link" href="#main">
        Skip to content
      </a>
      <header className="brand-header">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3">
          <span className="wordmark">MY GARB</span>
          <span className="badge rounded-pill text-bg-secondary">
            In development
          </span>
        </div>
      </header>
      <main id="main" className="container py-5" tabIndex={-1}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <p className="eyebrow">Custom Nigerian occasion wear</p>
            <h1 className="display-3">
              Every stitch starts with an agreement.
            </h1>
            <p className="lead">
              A place to find a designer, agree your outfit’s details and follow
              its progress to handover.
            </p>
            <section
              className="card border-0 mt-4"
              aria-labelledby="preview-title"
            >
              <div className="card-body p-4">
                <h2 id="preview-title" className="h3">
                  The foundation is taking shape
                </h2>
                <p className="mb-0">
                  This is an early application preview. Designer discovery, and
                  custom requests are not available yet.
                </p>
              </div>
            </section>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link className="btn btn-primary" to="/login">
                Sign in
              </Link>
              <Link className="btn btn-outline-primary" to="/register">
                Create an account
              </Link>
            </div>
            <p className="small text-body-secondary mt-4">
              During the pilot, payment and handover will be arranged directly
              between customers and designers.
            </p>
          </div>
        </div>
      </main>
      <footer className="brand-footer mt-auto py-4">
        <div className="container">
          MY GARB <span aria-hidden="true">·</span> Made for your occasion
        </div>
      </footer>
    </div>
  );
}
