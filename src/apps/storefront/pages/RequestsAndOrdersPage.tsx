import { Link, useSearchParams } from 'react-router-dom';
import { useRequestsQuery, useOrdersQuery } from '@/services/api/recordsApi';
import {
  pageNumber,
  statusLabel,
  money,
  requestStatus,
  orderStatus,
} from '../features/records/model';
import { DataFeedback } from '@/shared/components/feedback/DataFeedback';
import { PageControls } from '@/shared/components/navigation/PageControls';
export function RequestsAndOrdersPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'orders' ? 'orders' : 'requests';
  const page = pageNumber(params.get('page'));
  const statuses =
    tab === 'requests' ? requestStatus.options : orderStatus.options;
  const raw = params.get('status') ?? '';
  const status = statuses.some((value) => value === raw) ? raw : '';
  const requests = useRequestsQuery(
    { page, ...(status ? { status } : {}) },
    { skip: tab !== 'requests' },
  );
  const orders = useOrdersQuery(
    { page, ...(status ? { status } : {}) },
    { skip: tab !== 'orders' },
  );
  const query = tab === 'requests' ? requests : orders;
  const records =
    tab === 'requests'
      ? requests.currentData?.requests
      : orders.currentData?.orders;
  return (
    <>
      <h1>Requests and orders</h1>
      <div className="nav nav-pills gap-2 my-3" aria-label="Record type">
        {(['requests', 'orders'] as const).map((value) => (
          <button
            key={value}
            className={'nav-link' + (tab === value ? ' active' : '')}
            aria-pressed={tab === value}
            onClick={() => setParams({ tab: value })}
          >
            {statusLabel(value)}
          </button>
        ))}
      </div>
      <label htmlFor="record-status" className="form-label">
        Status
      </label>
      <select
        id="record-status"
        className="form-select mb-4"
        value={status}
        onChange={(event) =>
          setParams({
            tab,
            ...(event.target.value ? { status: event.target.value } : {}),
          })
        }
      >
        <option value="">All statuses</option>
        {statuses.map((value) => (
          <option key={value} value={value}>
            {statusLabel(value)}
          </option>
        ))}
      </select>
      {query.isLoading ||
      (query.isFetching && !query.currentData) ||
      query.error ? (
        <DataFeedback
          loading={query.isLoading || (query.isFetching && !query.currentData)}
          error={query.error}
          retry={query.refetch}
        />
      ) : (
        <>
          {!records?.length && <p role="status">No {tab} found.</p>}
          <div className="d-grid gap-3">
            {records?.map((record) => (
              <article className="card p-4" key={record.id}>
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <h2 className="h3">{record.outfitType}</h2>
                  <span className="badge text-bg-secondary align-self-start">
                    {statusLabel(record.status)}
                  </span>
                </div>
                <p>
                  Quantity: {record.quantity} ·{' '}
                  {'budgetAmount' in record
                    ? 'Budget: ' + money(record.budgetAmount)
                    : 'Agreed price: ' + money(record.priceAmount)}
                </p>
                <Link to={'/account/' + tab + '/' + record.id}>
                  View {tab === 'requests' ? 'request' : 'order'}
                </Link>
              </article>
            ))}
          </div>
          <PageControls
            page={page}
            hasMore={query.currentData?.hasMore ?? false}
            change={(page) =>
              setParams({
                tab,
                page: String(page),
                ...(status ? { status } : {}),
              })
            }
          />
        </>
      )}
      <p className="small">
        New requests and agreement changes are not available yet. Payments
        remain arranged directly between the parties.
      </p>
    </>
  );
}
