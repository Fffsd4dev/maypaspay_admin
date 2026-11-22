/**
 * Settings > Roles & permissions: list roles, delete unused ones, open the editor.
 * Route: /settings/roles (needs settings.roles)
 */
import { useState } from 'react';
import { Alert, Card, CardBody, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteRole } from '@/api/roles';
import PageTitle from '@/components/PageTitle';
import ReasonModal from '@/components/ReasonModal';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import RolesTable from './components/RolesTable';
import useRolesList from './useRolesList';

const RolesPage = () => {
  const { roles, loading, error, reload } = useRolesList();
  const [roleToDelete, setRoleToDelete] = useState(null);

  const confirmDelete = async (body) => {
    await deleteRole(roleToDelete.id, body);
    toast.success(`The ${roleToDelete.label} role has been deleted.`);
    reload();
  };

  return (
    <>
      <PageTitle title="Roles & permissions" subTitle="Settings" />

      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">Roles</h5>
              <p className="text-muted mb-0 fs-13">
                A role is a set of permissions. Changes apply to everyone with the role on their next request.
              </p>
            </div>
            <Link to="/settings/roles/new" className="btn btn-primary">
              <IconifyIcon icon="tabler:plus" className="me-1" /> New role
            </Link>
          </div>

          {error && <Alert variant="danger" className="py-2">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : (
            roles.length > 0 && <RolesTable roles={roles} onDelete={setRoleToDelete} />
          )}
        </CardBody>
      </Card>

      {roleToDelete && (
        <ReasonModal
          show
          title="Delete role"
          subject={roleToDelete.label}
          confirmText="This permanently deletes the role. It can't be undone."
          reason="required"
          danger
          onConfirm={confirmDelete}
          onClose={() => setRoleToDelete(null)}
        />
      )}
    </>
  );
};

export default RolesPage;