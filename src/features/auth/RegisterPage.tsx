import { authPath } from './model';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from '@/services/api/authApi';
import { FormField } from '@/shared/components/forms/FormField';
import { authError, registerSchema, type RegisterInput } from './model';
export function RegisterPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [createAccount] = useRegisterMutation();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'customer' },
  });
  return (
    <>
      <h1>Create your account</h1>
      <p>
        Already registered?{' '}
        <Link to={authPath('/login', params.get('returnTo'))}>Sign in</Link>
      </p>
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      <form
        noValidate
        onSubmit={handleSubmit(async (input) => {
          setError('');
          try {
            const message = await createAccount(input).unwrap();
            navigate(authPath('/verify-email', params.get('returnTo')), {
              state: { email: input.email, message },
            });
          } catch (failure) {
            setError(authError(failure));
          }
        })}
      >
        <fieldset className="mb-3">
          <legend className="fs-6 fw-semibold">I’m joining as</legend>
          {(['customer', 'designer'] as const).map((role) => (
            <label
              key={role}
              className="card p-3 mb-2 d-flex flex-row gap-3 align-items-center"
            >
              <input
                type="radio"
                value={role}
                {...register('role')}
                className="form-check-input"
              />
              <span>{role === 'customer' ? 'Customer' : 'Designer'}</span>
            </label>
          ))}
        </fieldset>
        <FormField
          label="Full name"
          autoComplete="name"
          registration={register('name')}
          error={errors.name?.message}
        />
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
          autoComplete="new-password"
          registration={register('password')}
          error={errors.password?.message}
        />
        <p className="small">
          Use at least 8 characters (maximum 72 UTF-8 bytes). We’ll request a
          verification code for your email.
        </p>
        <button disabled={isSubmitting} className="btn btn-primary w-100">
          {isSubmitting ? 'Submitting…' : 'Create account'}
        </button>
      </form>
    </>
  );
}
