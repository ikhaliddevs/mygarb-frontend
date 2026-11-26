import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/services/api/authApi';
import { baseApi } from '@/services/api/baseApi';
import { useAppDispatch } from '@/app/hooks';
import { authError } from './model';
export function LogoutButton() {
  const [logout, state] = useLogoutMutation();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  function clear() {
    navigate('/login', { replace: true });
    dispatch(baseApi.util.resetApiState());
  }
  return (
    <div>
      <button
        className="btn btn-secondary"
        disabled={state.isLoading}
        onClick={async () => {
          setError('');
          try {
            await logout().unwrap();
            clear();
          } catch (failure) {
            if (
              failure &&
              typeof failure === 'object' &&
              'status' in failure &&
              failure.status === 401
            )
              clear();
            else setError(authError(failure));
          }
        }}
      >
        {state.isLoading ? 'Signing out…' : 'Sign out'}
      </button>
      {error && (
        <p role="alert" className="mt-2 mb-0">
          {error} You have not been signed out.
        </p>
      )}
    </div>
  );
}
