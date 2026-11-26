import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
export function WorkspaceShell({
  title,
  links,
  children,
  actions,
}: {
  title: string;
  links: { label: string; to?: string }[];
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="foundation-page">
      <a className="visually-hidden-focusable skip-link" href="#main">
        Skip to content
      </a>
      <header className="brand-header">
        <div className="container py-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <Link className="wordmark text-white text-decoration-none" to="/">
            MY GARB
          </Link>
          <span>{title}</span>
          {actions}
        </div>
      </header>
      <div className="container py-4 flex-grow-1">
        <div className="row g-4">
          <aside className="col-12 col-lg-3">
            <nav
              aria-label={title + ' navigation'}
              className="nav nav-pills flex-row flex-lg-column gap-2"
            >
              {links.map((link) =>
                link.to ? (
                  <NavLink
                    key={link.label}
                    end
                    className="nav-link"
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ) : (
                  <span
                    key={link.label}
                    className="nav-link text-body-secondary"
                    aria-disabled="true"
                  >
                    {link.label} <small>(coming soon)</small>
                  </span>
                ),
              )}
            </nav>
          </aside>
          <main id="main" tabIndex={-1} className="col-12 col-lg-9">
            {children}
          </main>
        </div>
      </div>
      <footer className="brand-footer py-4">
        <div className="container">MY GARB · Made for your occasion</div>
      </footer>
    </div>
  );
}
