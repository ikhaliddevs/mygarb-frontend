import { Link, useSearchParams } from 'react-router-dom';
import { useRequestsQuery } from '@/services/api/recordsApi';
import { pageNumber, statusLabel } from '../features/records/model';
import { DataFeedback } from '@/shared/components/feedback/DataFeedback';
import { PageControls } from '@/shared/components/navigation/PageControls';
export function ConversationsPage() {
  const [params, setParams] = useSearchParams();
  const page = pageNumber(params.get('page'));
  const query = useRequestsQuery({ page });
  return (
    <>
      <h1>Messages</h1>
      <p>Open the conversation attached to a request.</p>
      {query.isLoading || query.error || !query.currentData ? (
        <DataFeedback
          loading={query.isLoading || query.isFetching}
          error={query.error}
          retry={query.refetch}
        />
      ) : (
        <>
          {!query.currentData.requests.length && (
            <p role="status">No conversations yet.</p>
          )}
          <div className="d-grid gap-3">
            {query.currentData.requests.map((item) => (
              <article className="card p-4" key={item.id}>
                <h2 className="h3">
                  <Link to={'/account/messages/' + item.id}>
                    {item.outfitType}
                  </Link>
                </h2>
                <p className="mb-0">{statusLabel(item.status)}</p>
              </article>
            ))}
          </div>
          <PageControls
            page={page}
            hasMore={query.currentData.hasMore}
            change={(page) => setParams({ page: String(page) })}
          />
        </>
      )}
    </>
  );
}
