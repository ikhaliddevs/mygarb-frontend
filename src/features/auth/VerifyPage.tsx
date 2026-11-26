import { authPath } from './model';
import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVerifyMutation, useResendMutation } from '@/services/api/authApi';
import { FormField } from '@/shared/components/forms/FormField';
import { verifySchema, authError, type VerifyInput } from './model';
export function VerifyPage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const initial = z
    .object({ email: z.string(), message: z.string() })
    .safeParse(location.state);
  const [verify] = useVerifyMutation();
  const [resend, resendState] = useResendMutation();
  const [error, setError] = useState('');
  const [message, setMessage] = useState(
    initial.success ? initial.data.message : '',
  );
  const [verified, setVerified] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<VerifyInput>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: initial.success ? initial.data.email : '',
      otp: '',
    },
  });
  return (
    <>
      <h1>Verify your email</h1>
      <p>
        Enter the six-digit code from your inbox. Codes expire after 10 minutes
        and can be used once.
      </p>
      {message && (
        <p role="status" className="alert alert-info">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      {verified ? (
        <>
          <p role="status">Email verified. Sign in to continue.</p>
          <Link
            className="btn btn-primary"
            to={authPath('/login', params.get('returnTo'))}
          >
            Sign in
          </Link>
        </>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(async (input) => {
            setError('');
            setMessage('');
            try {
              await verify(input).unwrap();
              setVerified(true);
            } catch (failure) {
              setError(authError(failure));
            }
          })}
        >
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            registration={register('email')}
            error={errors.email?.message}
          />
          <FormField
            label="Verification code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            registration={register('otp')}
            error={errors.otp?.message}
          />
          <button
            disabled={isSubmitting || resendState.isLoading}
            className="btn btn-primary w-100"
          >
            {isSubmitting ? 'Verifying…' : 'Verify email'}
          </button>
          <button
            type="button"
            disabled={isSubmitting || resendState.isLoading}
            className="btn btn-secondary w-100 mt-3"
            onClick={async () => {
              if (!(await trigger('email'))) return;
              setError('');
              setMessage('');
              try {
                setMessage(
                  await resend({ email: getValues('email') }).unwrap(),
                );
              } catch (failure) {
                setError(authError(failure));
              }
            }}
          >
            {resendState.isLoading ? 'Requesting…' : 'Resend code'}
          </button>
          <p className="small mt-2">
            Wait at least 60 seconds between code requests. Delivery is not
            guaranteed.
          </p>
        </form>
      )}
      <Link
        className="d-block mt-3"
        to={authPath('/login', params.get('returnTo'))}
      >
        Back to sign in
      </Link>
    </>
  );
}
