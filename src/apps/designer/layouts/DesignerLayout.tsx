import { Outlet } from 'react-router-dom';
import { WorkspaceShell } from '@/shared/layouts/WorkspaceShell';
import { LogoutButton } from '@/features/auth/LogoutButton';
export function DesignerLayout() {
  return (
    <WorkspaceShell
      title="Designer workspace"
      actions={<LogoutButton />}
      links={[
        { label: 'Overview', to: '/designer/dashboard' },
        { label: 'Business profile' },
        { label: 'Portfolio' },
        { label: 'Incoming requests' },
        { label: 'Production' },
      ]}
    >
      <Outlet />
    </WorkspaceShell>
  );
}
