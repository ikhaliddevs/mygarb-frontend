import { Outlet } from 'react-router-dom';
import { WorkspaceShell } from '@/shared/layouts/WorkspaceShell';
import { LogoutButton } from '@/features/auth/LogoutButton';
export function StorefrontLayout() {
  return (
    <WorkspaceShell
      title="Customer account"
      actions={<LogoutButton />}
      links={[
        { label: 'Account', to: '/account' },
        { label: 'Requests and orders', to: '/account/requests' },
        { label: 'Messages', to: '/account/messages' },
        { label: 'Measurements', to: '/account/measurements' },
        { label: 'Profile', to: '/account/profile' },
        { label: 'Notifications', to: '/account/notifications' },
      ]}
    >
      <Outlet />
    </WorkspaceShell>
  );
}
