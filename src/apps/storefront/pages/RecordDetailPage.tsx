import { Link, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useRequestDetailQuery,
  useOrderDetailQuery,
} from '@/services/api/recordsApi';
import { idSchema } from '../features/account/model';
import { statusLabel, money } from '../features/records/model';
import { DataFeedback } from '@/shared/components/feedback/DataFeedback';
import { ReferenceGallery } from '@/shared/components/ui/ReferenceGallery';
import { ConfirmedOrderRecovery } from '../features/records/ConfirmedOrderRecovery';
export function RecordDetailPage({ kind }: { kind: 'request' | 'order' }) {
  const { id } = useParams();
  const valid = idSchema.safeParse(id);
  const request = useRequestDetailQuery(
    kind === 'request' && valid.success ? valid.data : skipToken,
  );
  const order = useOrderDetailQuery(
    kind === 'order' && valid.success ? valid.data : skipToken,
  );
  const query = kind === 'request' ? request : order;
  const data = query.currentData;
  if (!valid.success)
    return (
      <>
        <h1>Invalid record</h1>
        <Link to="/account/requests">Back to requests and orders</Link>
      </>
    );
  if (query.isLoading || query.error || !data)
    return (
      <DataFeedback
        loading={query.isLoading}
        error={query.error}
        retry={query.refetch}
      />
    );
  return (
    <>
      <Link to="/account/requests">Back to requests and orders</Link>
      <h1 className="mt-3">{data.outfitType}</h1>
      <p>
        {statusLabel(kind)} · {statusLabel(data.status)}
      </p>
      <section className="card p-4 mb-4">
        <h2 className="h3">Outfit details</h2>
        <p className="text-break">{data.description}</p>
        <dl>
          <dt>Quantity</dt>
          <dd>{data.quantity}</dd>
          <dt>{kind === 'request' ? 'Budget' : 'Agreed price'}</dt>
          <dd>
            {money(
              'budgetAmount' in data ? data.budgetAmount : data.priceAmount,
            )}
          </dd>
          <dt>{kind === 'request' ? 'Needed by' : 'Agreed completion date'}</dt>
          <dd>
            {'desiredCompletionDate' in data
              ? data.desiredCompletionDate
              : data.completionDate}
          </dd>
        </dl>
        {'responseText' in data && data.responseText && (
          <p>Designer response: {data.responseText}</p>
        )}
        <ReferenceGallery sources={data.referenceImageUrls} />
      </section>
      {'proposal' in data && data.proposal && (
        <section className="card p-4 mb-4">
          <h2 className="h3">Designer proposal</h2>
          <p>Proposed price: {money(data.proposal.priceAmount)}</p>
          <p>Proposed completion date: {data.proposal.completionDate}</p>
          <p>
            This price/date proposal does not include the full versioned
            specification. Initial confirmation is not yet available.
          </p>
        </section>
      )}
      {kind === 'request' &&
        data.status === 'confirmed' &&
        'orderPending' in data &&
        data.orderPending === true && (
          <ConfirmedOrderRecovery key={data.id} id={data.id} />
        )}
      {'orderId' in data &&
        data.orderId &&
        !('orderPending' in data && data.orderPending) && (
          <p>
            <Link to={'/account/orders/' + data.orderId}>
              View confirmed order
            </Link>
          </p>
        )}
      <section className="card p-4 mb-4">
        <h2 className="h3">Original measurement snapshot</h2>
        <p>
          These are the measurements shared for this record. Updating your
          profile does not alter this snapshot.
        </p>
        <dl className="row">
          {data.measurementSnapshot.values.map((item) => (
            <div className="col-6 col-md-4" key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                {item.value} {data.measurementSnapshot.unit}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      {'history' in data && (
        <section className="card p-4 mb-4">
          <h2 className="h3">Status history</h2>
          <ol>
            {data.history.map((entry, index) => (
              <li key={index}>
                {statusLabel(entry.status)} ·{' '}
                {new Date(entry.at).toLocaleString()}
              </li>
            ))}
          </ol>
        </section>
      )}
      <Link
        className="btn btn-primary"
        to={
          '/account/messages/' +
          ('requestId' in data ? data.requestId : data.id)
        }
      >
        Open conversation
      </Link>
      <p className="small mt-3">
        Confirmation, cancellation, handover, completion and issue-reporting
        actions are not available in this release.
      </p>
    </>
  );
}
