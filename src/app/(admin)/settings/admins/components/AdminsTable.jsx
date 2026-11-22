import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/date';
import { getInitials } from '@/utils/format';
import AdminActionsMenu from './AdminActionsMenu';
import StatusBadge from './StatusBadge';

const AdminsTable = ({ admins, roles, onChanged }) => (
  <div className="table-responsive">
    <Table hover className="data-table align-middle">
      <thead>
        <tr>
          <th>Admin</th>
          <th>Role</th>
          <th>Status</th>
          <th>Last sign-in</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {admins.map((admin) => (
          <tr key={admin.uuid}>
            <td>
              <div className="table-person">
                <span className="initials-avatar">{getInitials(admin.name)}</span>
                <div>
                  <Link to={`/settings/admins/${admin.uuid}`} className="fw-semibold text-body">
                    {admin.name}
                  </Link>
                  <div className="text-muted fs-13">{admin.email}</div>
                </div>
              </div>
            </td>
            <td>{admin.role?.label}</td>
            <td>
              <StatusBadge status={admin.status} isLocked={admin.is_locked} />
            </td>
            <td className="text-nowrap text-muted">{formatDateTime(admin.last_login_at)}</td>
            <td className="text-end">
              <AdminActionsMenu admin={admin} roles={roles} onDone={onChanged} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

export default AdminsTable;