/**
 * Settings > Admins: list, search and manage staff accounts.
 * Route: /settings/admins (needs settings.admins)
 */
import { useState } from 'react';
import { Alert, Button, Card, CardBody, Spinner } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import TablePagination from '@/components/TablePagination';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useDebounce from '@/hooks/useDebounce';
import AdminFilters from './components/AdminFilters';
import AdminsTable from './components/AdminsTable';
import InviteAdminModal from './components/InviteAdminModal';
import useAdmins from './useAdmins';
import useRoles from './useRoles';

const PER_PAGE = 25;

const AdminsPage = () => {
  const [filters, setFilters] = useState({ search: '', status: '', roleId: '', page: 1 });
  const [showInvite, setShowInvite] = useState(false);

  // Wait until the user stops typing before searching.
  const search = useDebounce(filters.search.trim());
  const { roles, rolesError } = useRoles();
  const { admins, meta, loading, error, reload } = useAdmins({ ...filters, search, perPage: PER_PAGE });

  // Changing any filter goes back to page 1.
  const updateFilters = (changes) => setFilters((current) => ({ ...current, ...changes, page: 1 }));

  return (
    <>
      <PageTitle title="Admins" subTitle="Settings" />

      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">Staff accounts</h5>
              <p className="text-muted mb-0 fs-13">Every change here is recorded in the audit log.</p>
            </div>
            <Button onClick={() => setShowInvite(true)} disabled={rolesError}>
              <IconifyIcon icon="tabler:user-plus" className="me-1" /> Invite admin
            </Button>
          </div>

          {rolesError && <Alert variant="warning" className="py-2">Roles could not be loaded, so inviting and changing roles is unavailable.</Alert>}

          <AdminFilters search={filters.search} status={filters.status} roleId={filters.roleId} roles={roles} onChange={updateFilters} />

          {error && <Alert variant="danger" className="py-2">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : admins.length === 0 ? (
            !error && <p className="text-center text-muted py-5 mb-0">No admins match these filters.</p>
          ) : (
            <AdminsTable admins={admins} roles={roles} onChanged={reload} />
          )}

          <TablePagination meta={meta} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
        </CardBody>
      </Card>

      <InviteAdminModal show={showInvite} roles={roles} onClose={() => setShowInvite(false)} onDone={reload} />
    </>
  );
};

export default AdminsPage;
