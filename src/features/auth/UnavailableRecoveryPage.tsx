import { authPath } from './model';
import { Link, useSearchParams } from 'react-router-dom';
export function UnavailableRecoveryPage() {
  const [params] = useSearchParams();
  return (
    <>
      <h1>Password recovery unavailable</h1>
      <p role="status">
        Password recovery and reset are not supported yet. No recovery email has
        been requested and your password has not been changed.
      </p>
      <Link
        className="btn btn-primary"
        to={authPath('/login', params.get('returnTo'))}
      >
        Back to sign in
      </Link>
    </>
  );
}
