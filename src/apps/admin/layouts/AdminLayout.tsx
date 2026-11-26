import { Outlet } from 'react-router-dom';
import { WorkspaceShell } from '@/shared/layouts/WorkspaceShell';
import { LogoutButton } from '@/features/auth/LogoutButton';
export function AdminLayout() {
  return (
    <WorkspaceShell
      title="Administration"
      actions={<LogoutButton />}
      links={[
        { label: 'Overview', to: '/admin/dashboard' },
        { label: 'Approvals' },
        { label: 'Designers' },
        { label: 'Issues' },
        { label: 'Reviews' },
        { label: 'Audit history' },
      ]}
    >
      <Outlet />
    </WorkspaceShell>
  );
}
