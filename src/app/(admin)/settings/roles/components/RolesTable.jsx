import { Badge, Button, Table } from 'react-bootstrap';
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
    <Table hover className="align-middle mb-0">
      <thead className="bg-light bg-opacity-50">
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
                    <Badge bg="dark-subtle" text="dark" className="fw-normal">
                      <IconifyIcon icon="tabler:lock" /> System
                    </Badge>
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
                    <Link to={`/settings/roles/${role.id}`} className="btn btn-light btn-sm me-2">
                      Edit
                    </Link>
                    <Button
                      variant="light"
                      size="sm"
                      className="text-danger"
                      disabled={Boolean(blocker)}
                      title={blocker ?? 'Delete this role'}
                      onClick={() => onDelete(role)}
                    >
                      Delete
                    </Button>
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