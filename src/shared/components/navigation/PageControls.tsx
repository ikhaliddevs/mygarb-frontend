export function PageControls({
  page,
  hasMore,
  change,
}: {
  page: number;
  hasMore: boolean;
  change: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Pagination"
      className="d-flex align-items-center gap-3 my-4"
    >
      <button
        className="btn btn-outline-primary"
        disabled={page <= 1}
        onClick={() => change(page - 1)}
      >
        Previous
      </button>
      <span>Page {page}</span>
      <button
        className="btn btn-outline-primary"
        disabled={!hasMore || page >= 1000}
        onClick={() => change(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
