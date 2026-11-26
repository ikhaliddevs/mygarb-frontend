import { authPath } from './model';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/services/api/authApi';
import { baseApi } from '@/services/api/baseApi';
import { useAppDispatch } from '@/app/hooks';
import { FormField } from '@/shared/components/forms/FormField';
import { loginSchema, safeReturn, authError, type LoginInput } from './model';

export function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, state] = useLoginMutation();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const submit = handleSubmit(async (input) => {
    setError('');
    try {
      const user = await login(input).unwrap();
      dispatch(baseApi.util.resetApiState());
      navigate(safeReturn(params.get('returnTo'), user.role), {
        replace: true,
      });
    } catch (failure) {
      setError(authError(failure));
      resetField('password');
    }
  });
  return (
    <>
      <h1>Welcome back</h1>
      <p>Sign in to your MY GARB account.</p>
      {params.has('expired') && (
        <p role="status">
          Please sign in to continue. If you were signed in, your session may
          have ended.
        </p>
      )}
      {error && (
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      )}
      <form noValidate onSubmit={submit}>
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          registration={register('email')}
          error={errors.email?.message}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          registration={register('password')}
          error={errors.password?.message}
        />
        <Link
          className="d-block mb-3"
          to={authPath('/forgot-password', params.get('returnTo'))}
        >
          Forgot password?
        </Link>
        <button
          disabled={isSubmitting || state.isLoading}
          className="btn btn-primary w-100"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4">
        New to MY GARB?{' '}
        <Link to={authPath('/register', params.get('returnTo'))}>
          Create an account
        </Link>
      </p>
      <Link to={authPath('/verify-email', params.get('returnTo'))}>
        Verify your email
      </Link>
      <br />
      <Link to="/">Return home</Link>
    </>
  );
}
