import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  useNotificationsQuery,
  useReadNotificationMutation,
} from '@/services/api/recordsApi';
import { pageNumber } from '../features/records/model';
import { DataFeedback } from '@/shared/components/feedback/DataFeedback';
import { PageControls } from '@/shared/components/navigation/PageControls';
import { authError } from '@/features/auth/model';
const labels = {
  new_request: 'New request',
  accepted: 'Request accepted',
  declined: 'Request declined',
  confirmed: 'Request confirmed',
  new_message: 'New message',
  order_in_progress: 'Production started',
  order_ready: 'Order ready',
  order_completed: 'Order completed',
};
export function NotificationsPage() {
  const [params, setParams] = useSearchParams();
  const page = pageNumber(params.get('page'));
  const query = useNotificationsQuery(page, {
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
  });
  const [markRead, state] = useReadNotificationMutation();
  const [error, setError] = useState('');
  return (
    <>
      <h1>Notifications</h1>
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      {query.isLoading || query.error || !query.currentData ? (
        <DataFeedback
          loading={query.isLoading || query.isFetching}
          error={query.error}
          retry={query.refetch}
        />
      ) : (
        <>
          <p>
            {
              query.currentData.notifications.filter((item) => !item.readAt)
                .length
            }{' '}
            unread on this page
          </p>
          {query.currentData.deliveryPending && (
            <p role="status">
              More notifications are being collected. This page checks for
              updates automatically.
            </p>
          )}
          {!query.currentData.notifications.length && (
            <p role="status">No notifications yet.</p>
          )}
          <ul className="list-unstyled d-grid gap-3">
            {query.currentData.notifications.map((item) => (
              <li className="card p-4" key={item.id}>
                <h2 className="h4">
                  {labels[item.type]}{' '}
                  {!item.readAt && (
                    <span className="badge text-bg-secondary">Unread</span>
                  )}
                </h2>
                <time dateTime={item.at}>
                  {new Date(item.at).toLocaleString()}
                </time>
                <div className="d-flex flex-wrap gap-3 mt-3">
                  <Link
                    className="btn btn-outline-primary"
                    to={
                      item.type === 'new_message'
                        ? '/account/messages/' + item.requestId
                        : item.orderId
                          ? '/account/orders/' + item.orderId
                          : '/account/requests/' + item.requestId
                    }
                  >
                    View details
                  </Link>
                  {!item.readAt && (
                    <button
                      className="btn btn-primary"
                      disabled={state.isLoading}
                      onClick={async () => {
                        setError('');
                        try {
                          await markRead(item.id).unwrap();
                        } catch (failure) {
                          setError(authError(failure));
                        }
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
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
