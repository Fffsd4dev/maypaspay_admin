import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/date';
import AdminActionsMenu from './AdminActionsMenu';
import StatusBadge from './StatusBadge';

const AdminsTable = ({ admins, roles, onChanged }) => (
  <div className="table-responsive">
    <Table hover className="align-middle mb-0">
      <thead className="bg-light bg-opacity-50">
        <tr>
          <th>Name</th>
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
              <Link to={`/settings/admins/${admin.uuid}`} className="fw-semibold text-body">
                {admin.name}
              </Link>
              <div className="text-muted fs-13">{admin.email}</div>
            </td>
            <td>{admin.role?.label}</td>
            <td>
              <StatusBadge status={admin.status} isLocked={admin.is_locked} />
            </td>
            <td className="text-nowrap">{formatDateTime(admin.last_login_at)}</td>
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
