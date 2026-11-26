import { Link, Outlet } from 'react-router-dom';
import portrait from '../../../images/black-gold-agbada.jpg';
export function AuthLayout() {
  return (
    <div className="auth-layout">
      <a className="visually-hidden-focusable skip-link" href="#main">
        Skip to content
      </a>
      <aside className="auth-art d-none d-lg-flex">
        <img
          src={portrait}
          alt="Man in black and gold embroidered agbada"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
        <Link to="/" className="wordmark">
          MY GARB
        </Link>
        <p>Every stitch agreed before the first cut.</p>
      </aside>
      <div className="auth-content">
        <header className="brand-header p-3 d-lg-none">
          <Link to="/" className="wordmark text-white text-decoration-none">
            MY GARB
          </Link>
        </header>
        <main id="main" tabIndex={-1} className="auth-form">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
