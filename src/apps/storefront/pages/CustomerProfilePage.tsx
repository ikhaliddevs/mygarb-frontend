import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
} from '@/services/api/customerApi';
import {
  profileInputSchema,
  type ProfileInput,
} from '../features/account/model';
import { FormField } from '@/shared/components/forms/FormField';
import { DataFeedback } from '@/shared/components/feedback/DataFeedback';
import { authError } from '@/features/auth/model';
function ProfileEditor({ profile }: { profile: ProfileInput }) {
  const [save] = useUpdateCustomerProfileMutation();
  const [feedback, setFeedback] = useState('');
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileInputSchema),
    defaultValues: profile,
  });
  return (
    <form
      className="card p-4"
      noValidate
      onSubmit={handleSubmit(async (data) => {
        setFeedback('');
        setFailed(false);
        try {
          const saved = await save(data).unwrap();
          reset({ name: saved.name, phone: saved.phone });
          setFeedback('Account details saved.');
        } catch (error) {
          setFailed(true);
          setFeedback(authError(error));
        }
      })}
    >
      <h2 className="h3">Personal details</h2>
      {feedback && <p role={failed ? 'alert' : 'status'}>{feedback}</p>}
      <FormField
        label="Full name"
        autoComplete="name"
        registration={register('name')}
        error={errors.name?.message}
      />
      <FormField
        label="Phone (private)"
        type="tel"
        autoComplete="tel"
        registration={register('phone')}
        error={errors.phone?.message}
      />
      <button
        className="btn btn-primary align-self-start"
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? 'Saving…' : 'Save account details'}
      </button>
    </form>
  );
}
export function CustomerProfilePage() {
  const query = useCustomerProfileQuery();
  return (
    <>
      <h1>My profile</h1>
      <p>Your personal details are private.</p>
      {query.isLoading || query.error || !query.data ? (
        <DataFeedback
          loading={query.isLoading}
          error={query.error}
          retry={query.refetch}
        />
      ) : (
        <ProfileEditor profile={query.data} />
      )}
      <section className="card p-4 mt-4">
        <h2 className="h3">My measurements</h2>
        <p>
          Keep your measurements up to date. Existing request and order
          snapshots remain unchanged.
        </p>
        <Link to="/account/measurements">Manage measurements</Link>
      </section>
      <section className="card p-4 mt-4">
        <h2 className="h3">Security</h2>
        <Link to="/forgot-password">Password recovery availability</Link>
        <p className="small mt-3 mb-0">
          Email changes and contact preferences are not available yet.
        </p>
      </section>
    </>
  );
}
