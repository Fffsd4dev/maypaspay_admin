import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

/** Why a role can't be deleted, or null if it can. */
const deleteBlocker = (role) => {
  if (role.is_system) return 'Built-in role';
  if (role.admins_count > 0) return `Move its ${role.admins_count} admin${role.admins_count === 1 ? '' : 's'} first`;
  return null;
};

const RolesTable = ({ roles, onDelete }) => (
  <div className="table-responsive">
    <Table hover className="data-table align-middle">
      <thead>
        <tr>
          <th>Role</th>
          <th>Permissions</th>
          <th>Admins</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => {
          const blocker = deleteBlocker(role);
          return (
            <tr key={role.id}>
              <td>
                <div className="fw-semibold d-flex align-items-center gap-2">
                  {role.label}
                  {role.is_system && (
                    <span className="status-pill status-pill-neutral">
                      <IconifyIcon icon="tabler:lock" /> System
                    </span>
                  )}
                </div>
                <code className="fs-12 text-muted">{role.name}</code>
                {role.description && <div className="text-muted fs-13">{role.description}</div>}
              </td>
              <td>{role.is_system ? 'Every permission' : `${role.permissions.length} permission${role.permissions.length === 1 ? '' : 's'}`}</td>
              <td>{role.admins_count}</td>
              <td className="text-end text-nowrap">
                {role.is_system ? (
                  <span className="text-muted fs-13">Can't be edited</span>
                ) : (
                  <>
                    <Link to={`/settings/roles/${role.id}`} className="btn btn-sm btn-outline-subtle me-2">
                      <IconifyIcon icon="tabler:pencil" /> Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-subtle is-danger"
                      disabled={Boolean(blocker)}
                      title={blocker ?? 'Delete this role'}
                      onClick={() => onDelete(role)}
                    >
                      <IconifyIcon icon="tabler:trash" /> Delete
                    </button>
                    {blocker && <div className="text-muted fs-12 mt-1">{blocker}</div>}
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </div>
);

export default RolesTable;