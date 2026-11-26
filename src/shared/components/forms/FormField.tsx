import { useState, type InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
};
export function FormField({
  label,
  error,
  registration,
  type = 'text',
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);
  const id = registration.name;
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="input-group">
        <input
          {...props}
          {...registration}
          id={id}
          type={type === 'password' && visible ? 'text' : type}
          className={'form-control' + (error ? ' is-invalid' : '')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? id + '-error' : undefined}
        />
        {type === 'password' && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && (
        <p className="text-danger small mt-1" id={id + '-error'}>
          {error}
        </p>
      )}
    </div>
  );
}
