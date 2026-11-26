import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useConversationQuery,
  useSendMessageMutation,
  useRequestDetailQuery,
  useOrderDetailQuery,
} from '@/services/api/recordsApi';
import { idSchema } from '../features/account/model';
import { pageNumber, messageInput } from '../features/records/model';
import { DataFeedback } from '@/shared/components/feedback/DataFeedback';
import { PageControls } from '@/shared/components/navigation/PageControls';
import { authError } from '@/features/auth/model';
export function ConversationPage() {
  const { id } = useParams();
  const parsed = idSchema.safeParse(id);
  const [params, setParams] = useSearchParams();
  const page = pageNumber(params.get('page'));
  const query = useConversationQuery(
    parsed.success ? { id: parsed.data, page } : skipToken,
  );
  const request = useRequestDetailQuery(
    parsed.success ? parsed.data : skipToken,
  );
  const order = useOrderDetailQuery(query.data?.orderId ?? skipToken);
  const [send] = useSendMessageMutation();
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ text: string }>({ resolver: zodResolver(messageInput) });
  const status = query.data?.orderId
    ? order.data?.status
    : request.data?.status;
  const closed =
    status === 'declined' || status === 'cancelled' || status === 'completed';
  const maySend = !closed && Boolean(status) && !request.error && !order.error;
  if (!parsed.success)
    return (
      <>
        <h1>Invalid conversation</h1>
        <Link to="/account/messages">Back to messages</Link>
      </>
    );
  return (
    <>
      <Link to="/account/messages">Back to messages</Link>
      <h1 className="mt-3">Conversation</h1>
      <p>Messages do not change agreed commercial terms.</p>
      {query.isLoading || query.error || !query.currentData ? (
        <DataFeedback
          loading={query.isLoading || query.isFetching}
          error={query.error}
          retry={query.refetch}
        />
      ) : (
        <>
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            Refresh messages
          </button>
          {!query.currentData.messages.length && (
            <p role="status">No messages yet.</p>
          )}
          <ol className="list-unstyled d-grid gap-3">
            {query.currentData.messages.map((message) => (
              <li key={message.id} className="card p-3">
                <small>
                  {message.kind === 'text' ? 'Message' : 'Agreement record'} ·{' '}
                  <time dateTime={message.at}>
                    {new Date(message.at).toLocaleString()}
                  </time>
                </small>
                <p className="text-break mt-2 mb-0 message-text">
                  {message.text}
                </p>
              </li>
            ))}
          </ol>
          <PageControls
            page={page}
            hasMore={query.currentData.hasMore}
            change={(page) => setParams({ page: String(page) })}
          />
          {closed ? (
            <p role="status">This conversation is read-only.</p>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit(async (input) => {
                setError('');
                setSent(false);
                try {
                  await send({ id: parsed.data, text: input.text }).unwrap();
                  reset({ text: '' });
                  setSent(true);
                } catch (failure) {
                  setError(
                    authError(failure) +
                      ' Check refreshed messages before sending again: a lost response may still have saved your message.',
                  );
                }
              })}
            >
              <label className="form-label" htmlFor="message-text">
                Message
              </label>
              <textarea
                id="message-text"
                className="form-control mb-2"
                rows={4}
                {...register('text')}
                aria-invalid={Boolean(errors.text)}
                aria-describedby="message-error"
              />
              <p id="message-error" className="text-danger">
                {errors.text?.message}
              </p>
              {error && (
                <p role="alert" className="alert alert-danger">
                  {error}
                </p>
              )}
              {sent && (
                <p role="status">
                  Message sent. Refresh or move to the last page to view the
                  latest messages.
                </p>
              )}
              {!maySend && (
                <p role="status">
                  Sending is unavailable until this request or order can be
                  checked.
                </p>
              )}
              <button
                className="btn btn-primary"
                disabled={isSubmitting || !maySend}
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </>
      )}
    </>
  );
}
