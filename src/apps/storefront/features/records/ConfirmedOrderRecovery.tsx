import { useRecoverConfirmedOrderMutation } from '@/services/api/recordsApi';
import { useNavigate } from 'react-router-dom';

// Render only after the server reports a durable confirmed intent with a missing order.
export function ConfirmedOrderRecovery({ id }: { id: string }) {
  const [recover, result] = useRecoverConfirmedOrderMutation();
  const navigate = useNavigate();
  async function restore() {
    try {
      const order = await recover(id).unwrap();
      void navigate('/account/orders/' + order.id);
    } catch {
      // Keep the same request identity for an explicit safe retry.
    }
  }
  return (
    <section className="card p-4 mb-4">
      <h2 className="h3">Order creation pending</h2>
      <p>
        Your confirmation was already recorded. Resume creation of that same
        order using its saved terms.
      </p>
      {result.isError && (
        <p role="alert">
          Unable to retrieve the order. Refresh this request to check its
          status, or retry recovery. Do not submit a replacement request.
        </p>
      )}
      <button
        className="btn btn-primary"
        disabled={result.isLoading}
        onClick={() => void restore()}
      >
        {result.isLoading ? 'Recovering order…' : 'Recover confirmed order'}
      </button>
    </section>
  );
}
